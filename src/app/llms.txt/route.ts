export const dynamic = "force-static";

export async function GET() {
  const llmsContent = `# post mate

> post mate is an AI-powered social media management platform that lets creators and businesses create platform-specific content from a single idea, then schedule and publish to all their social accounts from one place.

## What is post mate?

post mate (https://post-mate.xyz) is a content creation and scheduling tool built for creators, personal brands, and businesses who want to grow across multiple social media platforms without the manual overhead. You write or generate one post, and post mate handles adapting it for each platform's unique style and publishing it across all your connected accounts simultaneously.

post mate is actively developed by Anirudh (founder).

## Key Features

- **AI-powered content generation** — Generate platform-specific post ideas tailored to your niche and audience. Never stare at a blank screen again.
- **Multi-platform publishing** — Publish to Instagram, X (Twitter), LinkedIn, Threads, Facebook, and YouTube with a single click.
- **Post scheduling** — Queue up content for peak engagement times so your audience always sees you at the right moment.
- **Unified content management** — One dashboard to manage all your platforms. Track posts, edit drafts, and stay organised across every account.
- **Idea pipeline** — A continuous stream of fresh, relevant post ideas to keep your content calendar full every week.
- **Platform-specific content adaptation** — Content is automatically tailored to each platform's format, tone, and character limits.
- **Calendar view** — Visualise your scheduled content across week and month views.
- **Media uploads** — Attach images and videos to posts before publishing.
- **Draft management** — Save works-in-progress and return to them later.

## Supported Platforms

post mate currently supports publishing and scheduling to:

- **X (Twitter)**
- **Instagram**
- **LinkedIn**
- **Threads**
- **YouTube**
- **Facebook Pages**

Each platform uses OAuth for secure account connection. Users can connect multiple accounts per platform.

## Frequently Asked Questions

**What is Postmate?**
Postmate is a content creation and posting tool that helps you create tailored content for different platform's taste and post content on multiple social media platforms all at the same time.

**How is Postmate better than ChatGPT?**
Postmate is a complete platform for your content. You can manage content, schedule it, and post to multiple accounts simultaneously — things ChatGPT cannot do. It provides a complete package for content ideation, management, and scheduling.

**What's included in the 7-day free trial?**
Full access to all features in the chosen plan. A credit card is required but you won't be charged during the 7 days. A reminder is sent 3 days before the trial ends. Cancel anytime.

**Can Postmate help with personal branding and business?**
Yes. It is built exactly for this purpose — to help individuals and businesses grow on social media.

**Is Postmate available on mobile?**
Yes, but a desktop experience is recommended for best results.

## Links

- Website: https://post-mate.xyz
- X / Twitter: https://x.com/app_postmate
- LinkedIn: https://www.linkedin.com/company/app-postmate
- Support email: app.postmate@gmail.com
`;

  return new Response(llmsContent, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
