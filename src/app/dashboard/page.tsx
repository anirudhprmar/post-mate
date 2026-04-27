import Platforms from "~/components/platforms";

export default function Home() {

    return (
        <div className="h-screen p-2">
            <div className="flex flex-col items-start justify-center">
                <h1 className="text-xl">Create New Post</h1>
                <p className="text-muted-foreground text-sm">Start by choosing a platform</p>
            </div>

            <Platforms />
        </div>
    );
}
