import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { refreshAccountToken } from "~/lib/social-oauth/refresh";
import { qstash } from "~/lib/qstash";
import { env } from "~/env";

const REFRESH_INTERVAL_MS = 50 * 24 * 60 * 60 * 1000; // 50 days

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("upstash-signature")!;
  const isValid = await receiver.verify({ body, signature });
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { accountId } = JSON.parse(body) as { accountId: string };

  const success = await refreshAccountToken(accountId);

  if (success) {
    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/refresh-token`,
      body: { accountId },
      delay: Math.ceil(REFRESH_INTERVAL_MS / 1000),
    });
  }

  return NextResponse.json({ ok: true, accountId, success });
}
