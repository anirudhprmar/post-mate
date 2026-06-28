export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface GraphPageListResponse {
  data?: FacebookPage[];
  error?: { message: string; code: number };
}

interface DebugTokenResponse {
  data?: {
    granular_scopes?: {
      scope?: string;
      target_ids?: string[];
    }[];
  };
  error?: { message: string };
}

async function fetchMeAccounts(userToken: string): Promise<FacebookPage[]> {
  const url = new URL("https://graph.facebook.com/v25.0/me/accounts");
  url.searchParams.set("access_token", userToken);
  url.searchParams.set("fields", "id,name,access_token,category");

  const res = await fetch(url);
  const data = (await res.json()) as GraphPageListResponse;

  if (!res.ok || data.error) {
    console.warn(
      "[Facebook] /me/accounts failed:",
      data.error?.message ?? res.status,
    );
    return [];
  }

  return data.data ?? [];
}

async function fetchPageIdsFromDebugToken(
  userToken: string,
  appId: string,
  appSecret: string,
): Promise<string[]> {
  const url = new URL("https://graph.facebook.com/v25.0/debug_token");
  url.searchParams.set("input_token", userToken);
  url.searchParams.set("access_token", `${appId}|${appSecret}`);

  const res = await fetch(url);
  const data = (await res.json()) as DebugTokenResponse;

  if (!res.ok || data.error) {
    console.warn(
      "[Facebook] debug_token failed:",
      data.error?.message ?? res.status,
    );
    return [];
  }

  const pageIds = new Set<string>();
  for (const entry of data.data?.granular_scopes ?? []) {
    if (!entry.scope?.startsWith("pages_")) continue;
    for (const id of entry.target_ids ?? []) {
      pageIds.add(String(id));
    }
  }

  return [...pageIds];
}

async function fetchPageById(
  userToken: string,
  pageId: string,
): Promise<FacebookPage | null> {
  const url = new URL(`https://graph.facebook.com/v25.0/${pageId}`);
  url.searchParams.set("fields", "access_token,name");
  url.searchParams.set("access_token", userToken);

  const res = await fetch(url);
  const data = (await res.json()) as FacebookPage & {
    error?: { message: string };
  };

  if (!res.ok || data.error || !data.access_token) {
    console.warn(
      `[Facebook] Failed to fetch page ${pageId}:`,
      data.error?.message ?? res.status,
    );
    return null;
  }

  return {
    id: data.id ?? pageId,
    name: data.name ?? `Page ${pageId}`,
    access_token: data.access_token,
  };
}

export async function fetchFacebookPages(
  userToken: string,
  appId: string,
  appSecret: string,
): Promise<FacebookPage[]> {
  const fromAccounts = await fetchMeAccounts(userToken);
  if (fromAccounts.length > 0) {
    return fromAccounts;
  }

  const pageIds = await fetchPageIdsFromDebugToken(userToken, appId, appSecret);
  if (pageIds.length === 0) {
    return [];
  }

  const pages = await Promise.all(
    pageIds.map((pageId) => fetchPageById(userToken, pageId)),
  );

  return pages.filter((page): page is FacebookPage => page !== null);
}
