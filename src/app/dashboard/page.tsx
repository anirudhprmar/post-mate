import ContentFormat from "~/components/content-format";

export default function Home() {

    return (
        <div className="h-screen p-2">
            <div className="flex flex-col items-start justify-center gap-2">
                <h1 className="text-xl">New Post</h1>
                <p className="text-muted-foreground text-sm">What are you making today?</p>
            </div>
            <ContentFormat />
        </div>
    );
}
