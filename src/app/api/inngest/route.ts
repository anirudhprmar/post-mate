import { serve } from "inngest/next";
import { inngest } from "~/lib/inngest";
import { publishPost } from "~/inngest/functions/publish-post";
import { checkScheduledPosts } from "~/inngest/functions/check-scheduled";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [publishPost, checkScheduledPosts]
});