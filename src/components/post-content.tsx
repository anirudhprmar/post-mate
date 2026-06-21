"use client";

import AccountSelection from "./account-selection";
import MediaList from "./media-list";
import { PostEditor } from "./post-editor";
import PostPreview from "./post-preview";
import InsertMedia from "./insert-media";

export default function PostContent() {
  return (
    <div className="flex flex-col justify-between">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="p-2">
          <p className="mb-2 font-bold">Your Post</p>
          <div className="space-y-4">
            <AccountSelection />
            <div className="bg-muted/70 flex flex-col gap-2 rounded-md p-3">
              <InsertMedia />
              <MediaList />
              <PostEditor />
            </div>
          </div>
        </div>

        <div className="flex h-fit flex-col border-l p-2 pl-3">
          <p className="mb-2 font-bold">Post Preview</p>
          <PostPreview />
        </div>
      </div>
    </div>
  );
}
