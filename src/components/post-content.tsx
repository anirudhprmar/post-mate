
export default function PostContent() {
    return (
        <div className="grid grid-cols-2 h-full">
            <div>
                <p className="font-medium mb-2">Written Post</p>

                <div>
                    {/* accounts available  */}
                </div>

                <div>
                    {/* <CustomEditor/> */}
                </div>

            </div>
            <div className="border-l pl-3 flex flex-col">
                <p className="font-medium mb-2">Post Preview</p>
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-muted rounded-sm p-3">
                        <p className="text-muted-foreground text-sm">Write something to preview.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
