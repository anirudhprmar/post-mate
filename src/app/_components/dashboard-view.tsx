import { Safari } from "~/components/ui/safari"

export function DashboardView() {
    return (
        <div className=" w-full ">
          
            <Safari
                url="post-mate"
                imageSrc="/dash.png"
                className="border-none"
            />
        </div>
    )
}
