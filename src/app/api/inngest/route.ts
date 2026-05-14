import { serve } from "inngest/next";
import { inngest } from "~/lib/inngest";
import { publishPost } from "~/inngest/functions/publish-post";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [publishPost],
});