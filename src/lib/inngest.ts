import { Inngest } from "inngest";
import { env } from "~/env";

export const inngest = new Inngest({
    id: "post-mate",
    name: "Postmate",
    serveUrl: env.NEXT_PUBLIC_APP_URL,
});