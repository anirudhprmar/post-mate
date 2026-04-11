import { Button } from "~/components/ui/button";
import Container from "./_components/container";
import { DashboardView } from "./_components/dashboard-view";
import Navbar from "./_components/navbar";


export default function Page() {

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      <Container>
        <Navbar />
        <main>
          <section className="mt-10 min-h-full">
            <div className="flex items-center justify-between mx-auto max-w-7xl px-6 py-10 lg:px-8">

              <div className="flex flex-col gap-4">
                <h1 className="text-6xl max-w-xl">Know what to post, create it fast, and publish everywhere.</h1>
                <p className="text-xl max-w-lg">PostSpark helps you build a consistent presence across LinkedIn, Instagram, and X without the daily grind.</p>
                <Button className="w-fit">Join the waitlist</Button>
              </div>
              <DashboardView />
            </div>
          </section>
        </main>
      </Container>


    </div>
  );
}
