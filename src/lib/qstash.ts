import { Client } from "@upstash/qstash";
import { env } from "~/env";

export const qstash = new Client({ 
    baseUrl: "https://qstash-us-east-1.upstash.io",
    token: env.QSTASH_TOKEN
});
