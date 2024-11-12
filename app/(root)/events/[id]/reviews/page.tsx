import Reviews from "@/components/shared/Reviews";
import { auth } from "@clerk/nextjs";
import React from "react";

type ReviewProps = {
  params: {
    id: string;
  };
};

const EventReviews = async ({ params: { id } }: ReviewProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  return (
    <section className="">
      <Reviews id={id} userId={userId} />
    </section>
  );
};

export default EventReviews;
