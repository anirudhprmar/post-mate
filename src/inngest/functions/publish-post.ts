import { inngest } from "~/lib/inngest";

export const publishPost = inngest.createFunction(
    {
        id: "post.publish",
        name: "Publish Scheduled Post"
    },
    {
        event: "post.publish"
    },
    //   async ({ event, step }) => {
    //     const { postId } = event.data;

    //     // Your publishing logic goes here
    //     // Step 1: Fetch post + targets
    //     // Step 2: Post to each platform
    //     // Step 3: Update statuses
    //   }
);