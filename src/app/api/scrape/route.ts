
export async function POST(request: string) {
  const { url } = await request.json();

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    if (isRedditUrl(url)) {
      const data = await scrapeReddit(url);
      return Response.json(data);
    } else if (isTwitterUrl(url)) {
      const data = await scrapeTwitter(url);
      return Response.json(data);
    } else {
      return Response.json({ error: "Unsupported platform. Only Reddit and Twitter/X links are supported." }, { status: 400 });
    }
  } catch (err) {
    return Response.json({ error: err.message || "Failed to fetch post" }, { status: 500 });
  }
}

// ─── Platform Detection ───────────────────────────────────────────────────────

function isRedditUrl(url) {
  return /reddit\.com\/r\/[^/]+\/comments\//.test(url);
}

function isTwitterUrl(url) {
  return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/.test(url);
}

// ─── Reddit Scraper ───────────────────────────────────────────────────────────

async function scrapeReddit(url) {
  // Strip query params and trailing slash, then append .json
  const cleanUrl = url.split("?")[0].replace(/\/$/, "") + ".json";

  const res = await fetch(cleanUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PostScraper/1.0)",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Reddit post");

  const json = await res.json();
  const post = json[0]?.data?.children?.[0]?.data;

  if (!post) throw new Error("Could not parse Reddit post");

  const media = [];

  // Images via Reddit preview
  if (post.preview?.images) {
    for (const img of post.preview.images) {
      const src = img.source?.url?.replace(/&amp;/g, "&");
      if (src) media.push({ type: "image", url: src });
    }
  }

  // Reddit-hosted image (i.redd.it)
  if (post.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(post.url)) {
    if (!media.find((m) => m.url === post.url)) {
      media.push({ type: "image", url: post.url });
    }
  }

  // Reddit-hosted video (v.redd.it)
  if (post.is_video && post.media?.reddit_video?.fallback_url) {
    media.push({
      type: "video",
      url: post.media.reddit_video.fallback_url.replace(/&amp;/g, "&"),
    });
  }

  // Gallery
  if (post.is_gallery && post.media_metadata) {
    for (const item of Object.values(post.media_metadata)) {
      if (item.status === "valid" && item.s?.u) {
        media.push({ type: "image", url: item.s.u.replace(/&amp;/g, "&") });
      }
    }
  }

  // External link (not self-post, not image)
  const externalLink =
    !post.is_self && post.url && !post.url.includes("reddit.com") ? post.url : null;

  return {
    platform: "reddit",
    title: post.title || null,
    text: post.selftext || null,
    author: post.author ? `u/${post.author}` : null,
    subreddit: post.subreddit ? `r/${post.subreddit}` : null,
    score: post.score ?? null,
    url: `https://reddit.com${post.permalink}`,
    externalLink,
    media,
    createdAt: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : null,
  };
}

// ─── Twitter/X Scraper (via fxtwitter public API) ─────────────────────────────

async function scrapeTwitter(url) {
  // Extract tweet ID from URL
  const match = url.match(/\/status\/(\d+)/);
  if (!match) throw new Error("Invalid Twitter/X URL");

  const tweetId = match[1];
  const apiUrl = `https://api.fxtwitter.com/status/${tweetId}`;

  const res = await fetch(apiUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PostScraper/1.0)" },
  });

  if (!res.ok) throw new Error("Failed to fetch tweet");

  const json = await res.json();
  const tweet = json.tweet;

  if (!tweet) throw new Error("Could not parse tweet");

  const media = [];

  if (tweet.media?.photos) {
    for (const photo of tweet.media.photos) {
      media.push({ type: "image", url: photo.url });
    }
  }

  if (tweet.media?.videos) {
    for (const video of tweet.media.videos) {
      // Pick highest quality variant
      const best = video.variants
        ?.filter((v) => v.content_type === "video/mp4")
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
      if (best?.url) media.push({ type: "video", url: best.url });
    }
  }

  if (tweet.media?.gifs) {
    for (const gif of tweet.media.gifs) {
      media.push({ type: "gif", url: gif.url });
    }
  }

  return {
    platform: "twitter",
    title: null,
    text: tweet.text || null,
    author: tweet.author?.name
      ? `${tweet.author.name} (@${tweet.author.screen_name})`
      : null,
    score: tweet.likes ?? null,
    url: tweet.url || url,
    externalLink: null,
    media,
    createdAt: tweet.created_at || null,
  };
}
