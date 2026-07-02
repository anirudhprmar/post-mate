import { type NextRequest, NextResponse } from "next/server";
import { downloadMediaFromR2 } from "~/lib/r2-download";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return new NextResponse("Missing key parameter", { status: 400 });
  }

  try {
    const { buffer, contentType } = await downloadMediaFromR2(key);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving R2 media:", error);
    return new NextResponse("Media not found", { status: 404 });
  }
}
