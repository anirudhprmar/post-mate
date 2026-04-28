import { notFound } from "next/navigation";
import PostLayout from "~/components/post-layout";


export default async function FormatPage({ params }: { params: Promise<{ format: "written" | "image" | "video" }> }) {
    const { format } = await params;

    if (!format) notFound();

    return (
        <div className="h-screen p-2">
            <PostLayout format={format}>
                {/* {format === "written" && <WrittenPosting />}
                {format === "image" && <ImagePosting />}
                {format === "video" && <VideoPosting />} */}
            </PostLayout>
        </div>
    )
}
