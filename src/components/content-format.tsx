import { Clapperboard, FileText, ImagePlus, TextAlignEnd, TextAlignStart } from "lucide-react"
import Link from "next/link"

export default function ContentFormat() {
    const formats = [
        {
            name: "Written",
            icon: <TextAlignStart />,
            href: "/dashboard/post/written",
            description: "Thoughts, Threads, Long form posts..."
        },
        {
            name: "Image",
            icon: <ImagePlus />,
            href: "/dashboard/post/image",
            description: "Text posts with images, carousels... "
        },
        {
            name: "Video",
            icon: <Clapperboard />,
            href: "/dashboard/post/video",
            description: "demo videos, shorts, reels..."
        }
    ]
    return (
        <div className="mt-4 grid grid-cols-3 gap-3  mx-auto">
            {formats.map((format) => (
                <Link href={format.href} key={format.name}>
                    <div className="cursor-pointer border border-border rounded-md p-10 flex flex-col items-center justify-center hover:bg-secondary">
                        <div className="bg-white border border-border rounded-md p-4 mb-3">
                            {format.icon}
                        </div>
                        <p>{format.name}</p>
                        <p className="text-muted-foreground text-sm text-center py-2">{format.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
