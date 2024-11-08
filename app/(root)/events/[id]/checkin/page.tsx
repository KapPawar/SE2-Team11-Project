import CheckoutButton from "@/components/shared/CheckoutButton";
import { createEventCheckIn } from "@/lib/actions/checkin.action";
import { getEventById } from "@/lib/actions/event.actions";
import { getOrdersByUser, hasOrderedEvent } from "@/lib/actions/order.actions";
import { auth } from "@clerk/nextjs";
import React from "react";

type CheckInEventProps = {
  params: {
    id: string;
  };
};

const CheckInEvent = async ({ params: { id } }: CheckInEventProps) => {
  const event = await getEventById(id);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // console.log(userId);
  var checkedIn = false;
  const hasOrdered = await hasOrderedEvent({ eventId: id, userId });
  //   const checkedIn = await checkInUser({ eventId: id, userId });
  if (hasOrdered) {
    checkedIn = await createEventCheckIn({ eventId: id, userId });
  }

  return (
    <div className="flex items-center justify-center h-full">
      {checkedIn ? (
        <>
          {/* <div className="flex flex-col items-center justify-center"> */}
          <p className="p-2">You are successfully checked in for this event.</p>
          {/* <CheckoutButton event={event} /> */}
          {/* </div> */}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="p-2">You have not purchased a ticket for this event.</p>
          <CheckoutButton event={event} hasOrdered={false} />
        </div>
      )}
    </div>
  );
};

export default CheckInEvent;
