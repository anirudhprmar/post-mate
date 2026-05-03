import InsertMedia from "./insert-media";
import { PostEditor } from "./post-editor";

export default function PostContent() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="font-bold mb-2">Your Post</p>

                <div className="space-y-3">
                    {/* accounts available  */}
                    <div>
                        {/* <p className="text-sm font-medium">Accounts</p> */}
                    </div>

                    <div>
                        {/* <p className="text-sm font-medium">Selected</p> */}
                    </div>

                    <div className="rounded-md p-3 bg-muted-foreground/30 flex flex-col gap-2">
                        <InsertMedia />
                        <PostEditor />
                    </div>

                </div>

            </div>
            <div className="border-l pl-3 flex flex-col">
                <p className="font-bold mb-2">Post Preview</p>
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-muted rounded-sm p-3">
                        <p className="text-muted-foreground text-sm">Write something to preview.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
