import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const events = await getAllEvents({
    query: searchText,
    category: category,
    page: page,
    limit: 6,
  });

  return (
    <>
      <section className="bg-[#40826D] bg-contain py-5 md:py-10">
        <div
          className="wrapper grid grid-cols-1 gap-5
        md:grid-cols-2 2xl:gap-0"
        >
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold text-white">
              Organize, Engage, Succeed: Your Events, Our Platform!
            </h1>
            <Button
              size="lg"
              asChild
              className="button w-full sm:w-fit bg-white text-black hover:bg-gray-200"
            >
              <Link href="#events">Explore</Link>
            </Button>
          </div>
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8
      md:gap-12"
      >
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events?.data}
          emptyTitle="No events found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}
