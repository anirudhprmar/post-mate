import { Card, CardContent } from "~/components/ui/card";


export default function InspirationPage() {
    return (
        <div>
            <h1 className="font-bold text-2xl">Inspiration board</h1>
            <p>Get inspired by your favorite creators</p>

            <div>
                <p>drop in their profile link</p>
            </div>

            <div>
                <p className="font-bold">X</p>
                <Card className="w-20 h-20">
                    <CardContent>
                        <p>https://x.com/marclou</p>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}