import { Safari } from "~/components/ui/safari"

export function DashboardView() {
    return (
        <div className=" w-full lg:w-[709px] absolute -right-70 top-30 mask-r-from-20% to-0%">
            <Safari
                url="postspark"
                imageSrc="/dash.png"
                className="border-none"
            />
        </div>
    )
}
