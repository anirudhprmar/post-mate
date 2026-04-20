"use client";
import { useState } from "react";

/**
 * @typedef {{
 *   platform: "reddit" | "twitter";
 *   url: string;
 *   title: string | null;
 *   text: string | null;
 *   author: string | null;
 *   subreddit?: string | null;
 *   score?: number | null;
 *   externalLink?: string | null;
 *   createdAt?: string | null;
 *   media?: Array<{ type: "image" | "video" | "gif"; url: string }>;
 * }} ScrapedPost
 */

// ─── Icons ────────────────────────────────────────────────────────────────────
const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
/** @param {{ onSave?: (url: string, post: ScrapedPost) => void }} props */
export default function PostScraper({ onSave }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(/** @type {ScrapedPost | null} */ (null));
  const [error, setError] = useState(/** @type {string | null} */ (null));
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /** @param {React.KeyboardEvent<HTMLInputElement>} e */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleFetch();
  };

  return (
    <div className="scraper-root">
      {/* Header */}
      <header>
        <div className="logo-row">
          <span className="platform-badge reddit"><RedditIcon /> Reddit</span>
          <span className="divider">+</span>
          <span className="platform-badge twitter"><TwitterIcon /> Twitter / X</span>
        </div>
        <h1>Post Fetcher</h1>
        <p className="subtitle">Paste a Reddit or X post link to extract its full content</p>
      </header>

      {/* Input */}
      <div className="input-row">
        <div className="input-wrap">
          <LinkIcon />
          <input
            type="url"
            placeholder="https://reddit.com/r/... or https://x.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button onClick={handleFetch} disabled={loading || !url.trim()} className="fetch-btn">
          {loading ? <span className="spinner" /> : "Fetch"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-box">⚠ {error}</div>}

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-4 mt-6">
          <PostCard post={result} />
          {onSave && (
            <button
              onClick={() => onSave(url, result)}
              className="fetch-btn mt-4 w-full bg-primary text-primary-foreground font-bold"
            >
              ⭐ Save to Inspiration Board
            </button>
          )}
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
/** @param {{ post: ScrapedPost, actions?: React.ReactNode }} props */
export function PostCard({ post, actions }) {
  const isReddit = post.platform === "reddit";
  const media = post.media ?? [];

  return (
    <div className={`post-card ${post.platform}`}>
      {/* Platform badge */}
      <div className="post-platform">
        {isReddit ? <RedditIcon /> : <TwitterIcon />}
        <span>{isReddit ? "Reddit" : "Twitter / X"}</span>
        {post.subreddit && <span className="subreddit">{post.subreddit}</span>}
      </div>

      {/* Title */}
      {post.title && <h2 className="post-title">{post.title}</h2>}

      {/* Text */}
      {post.text && <p className="post-text">{post.text}</p>}

      {/* Meta */}
      <div className="post-meta">
        {post.author && <span>👤 {post.author}</span>}
        {post.score != null && <span>⬆ {post.score.toLocaleString()}</span>}
        {post.createdAt && (
          <span>🕒 {new Date(post.createdAt).toLocaleDateString()}</span>
        )}
      </div>

      {/* External link */}
      {post.externalLink && (
        <a className="external-link" href={post.externalLink} target="_blank" rel="noopener noreferrer">
          🔗 {post.externalLink}
        </a>
      )}

      {/* Media */}
      {media.length > 0 && (
        <div className="media-section">
          <div className="media-label">Media ({media.length})</div>
          <div className="media-grid">
            {media.map((m, i) => (
              <MediaItem key={i} item={m} />
            ))}
          </div>
        </div>
      )}

      {/* Source link */}
      <a className="source-link" href={post.url} target="_blank" rel="noopener noreferrer">
        View original post ↗
      </a>

      {/* Actions footer (Remake etc) */}
      {actions && (
        <div className="mt-4 pt-4 border-t border-[#2a2a30]">
          {actions}
        </div>
      )}
    </div>
  );
}

/** @param {{ item: { type: "image" | "video" | "gif"; url: string } }} props */
function MediaItem({ item }) {
  if (item.type === "image" || item.type === "gif") {
    return (
      <div className="media-item">
        <img src={item.url} alt="Post media" loading="lazy" />
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="media-url">
          {item.type === "gif" ? "🎞 GIF" : "🖼 Image"} ↗
        </a>
      </div>
    );
  }
  if (item.type === "video") {
    return (
      <div className="media-item">
        <video src={item.url} controls playsInline />
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="media-url">
          🎬 Video ↗
        </a>
      </div>
    );
  }
  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .scraper-root {
    font-family: 'DM Sans', sans-serif;
    background: #0e0e10;
    color: #e8e6e3;
    min-height: 100vh;
    padding: 48px 24px 80px;
    max-width: 720px;
    margin: 0 auto;
  }

  header { text-align: center; margin-bottom: 40px; }

  .logo-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .platform-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .platform-badge.reddit { background: #ff450022; color: #ff6634; border: 1px solid #ff450044; }
  .platform-badge.twitter { background: #1d9bf022; color: #4db8ff; border: 1px solid #1d9bf044; }

  .divider { color: #444; font-size: 18px; }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #e8e6e3 0%, #888 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
  }

  .subtitle { color: #666; font-size: 15px; }

  .input-row {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }

  .input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #1a1a1e;
    border: 1.5px solid #2e2e35;
    border-radius: 12px;
    padding: 0 16px;
    transition: border-color 0.2s;
    color: #555;
  }

  .input-wrap:focus-within { border-color: #555; color: #aaa; }

  .input-wrap input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #e8e6e3;
    padding: 14px 0;
  }

  .input-wrap input::placeholder { color: #444; }

  .fetch-btn {
    background: #e8e6e3;
    color: #0e0e10;
    border: none;
    border-radius: 12px;
    padding: 14px 28px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    min-width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fetch-btn:hover:not(:disabled) { opacity: 0.85; }
  .fetch-btn:active:not(:disabled) { transform: scale(0.97); }
  .fetch-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid #33333388;
    border-top-color: #0e0e10;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-box {
    background: #2a1010;
    border: 1px solid #ff444433;
    color: #ff8080;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .post-card {
    background: #16161a;
    border: 1.5px solid #2a2a30;
    border-radius: 16px;
    padding: 28px;
    animation: fadeUp 0.35s ease;
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  .post-card.reddit { border-color: #ff450022; }
  .post-card.twitter { border-color: #1d9bf022; }

  .post-platform {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #666;
  }

  .post-card.reddit .post-platform { color: #ff6634; }
  .post-card.twitter .post-platform { color: #4db8ff; }

  .subreddit {
    background: #ffffff0d;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    color: #888;
  }

  .post-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.4;
    color: #e8e6e3;
    margin-bottom: 14px;
  }

  .post-text {
    font-size: 14px;
    line-height: 1.7;
    color: #aaa;
    margin-bottom: 18px;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 13px;
    color: #555;
    margin-bottom: 18px;
  }

  .external-link {
    display: block;
    font-size: 13px;
    color: #4db8ff;
    word-break: break-all;
    margin-bottom: 18px;
    text-decoration: none;
  }
  .external-link:hover { text-decoration: underline; }

  .media-section { margin-bottom: 20px; }

  .media-label {
    font-size: 12px;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .media-item {
    background: #0e0e10;
    border: 1px solid #2a2a30;
    border-radius: 10px;
    overflow: hidden;
  }

  .media-item img,
  .media-item video {
    width: 100%;
    display: block;
    max-height: 240px;
    object-fit: cover;
  }

  .media-url {
    display: block;
    font-size: 12px;
    color: #555;
    padding: 8px 12px;
    text-decoration: none;
    transition: color 0.2s;
  }
  .media-url:hover { color: #aaa; }

  .source-link {
    display: inline-block;
    font-size: 13px;
    color: #555;
    text-decoration: none;
    border-top: 1px solid #222;
    padding-top: 16px;
    margin-top: 4px;
    width: 100%;
    transition: color 0.2s;
  }
  .source-link:hover { color: #aaa; }
`;
