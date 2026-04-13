import PricingTable from "./_components/pricing-table";
// import { api } from "~/trpc/server";

export default async function PricingPage() {
    // const isAuthenticated = await api.user.isAuthenticated();

    // let purchaseDetails = null;
    // if (isAuthenticated) {
    //     purchaseDetails = await api.payment.getPurchaseDetails();
    // }

    return (
        <div className="flex flex-col items-center justify-center w-full ">
            <PricingTable
                initialIsAuthenticated={false}
                initialPurchaseDetails={null}
            />
        </div>
    );
}