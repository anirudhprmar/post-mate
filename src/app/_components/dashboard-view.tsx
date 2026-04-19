import { Safari } from "~/components/ui/safari"

export function DashboardView() {
    return (
        <div className=" w-full lg:w-[1009] mask-b-from-0% to-100%">
            <Safari
                url="post mate"
                imageSrc="/dash.png"
                className="border-none"
            />
        </div>
    )
}
