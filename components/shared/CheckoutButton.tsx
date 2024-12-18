"use client";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";
import { useQRCode } from "next-qrcode";
import { useUrl } from "nextjs-current-url";
import { checkEventCheckIn } from "@/lib/actions/checkin.action";
import { getReviewsByEvent } from "@/lib/actions/review.actions";
import { IReview } from "@/lib/mongodb/database/models/review.model";

type Review = {
  event: string; // Reference to Event
  reviews: IReview[]; // Array of reviews
  averageRating: number; // The average rating of the event calculated
};

const CheckoutButton = ({
  event,
  hasOrdered,
}: {
  event: IEvent;
  hasOrdered: boolean;
}) => {
  const [averageRating, setAverageRating] = useState(0);
  const qrcodeUrl = useUrl() + "/checkin";
  const videoPage = useUrl() + "/video";
  const reviewPage = useUrl() + "/reviews";

  const { Canvas } = useQRCode();

  const hasEventFinished = new Date(event.endDateTime) < new Date();

  const inProgress = () =>
    new Date(event.startDateTime) < new Date() &&
    new Date(event.endDateTime) > new Date();

  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const isEventCreator = userId === event.organizer._id.toString();

  const [checkedIn, setCheckedIn] = useState(false);
  useEffect(() => {
    // Fetch and sort reviews when the component loads
    const fetchReviews = async () => {
      const eventReviews = await getReviewsByEvent({ eventId: event._id });
      if (eventReviews) {
        setAverageRating(Math.ceil(eventReviews.averageRating));
      }
    };

    fetchReviews();
  }, [event._id]);

  useEffect(() => {
    const isCheckedIn = async () => {
      if (event.type === "1" && hasOrdered) {
        const checkedIn = await checkEventCheckIn({
          eventId: event._id,
          userId,
        });
        setCheckedIn(checkedIn);
      }
    };
    isCheckedIn();
  }, [event]);

  return (
    <div className="flex flex-col items-start gap-3">
      {/* Cannot but past events */}

      <div className="flex items-center justify-start gap-2">
        <p className="text-2xl text-yellow-500">
          {"★".repeat(averageRating) + "☆".repeat(5 - averageRating)}
        </p>
        <Link href={reviewPage} className="text-primary-500">
          See all reviews
        </Link>
      </div>

      {hasEventFinished ? (
        <p className="text-red-400">Sorry, tickets are no longer available</p>
      ) : (
        <>
          {/* {inProgress() && (
            <p className="p-2 text-primary-400">Event is in progress.</p>
          )} */}
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {!isEventCreator && !hasOrdered && (
              <Checkout event={event} userId={userId} />
            )}

            {!isEventCreator &&
              event.type == "1" &&
              hasOrdered &&
              inProgress() &&
              (checkedIn ? (
                <p className="font-semibold">
                  You have successfully checked in for this event.
                </p>
              ) : (
                <Button asChild className="button rounded-full" size="lg">
                  <Link href={qrcodeUrl}>Check In</Link>
                </Button>
              ))}

            {!isEventCreator &&
              event.type == "1" &&
              hasOrdered &&
              !inProgress() && (
                <p className="font-semibold">
                  You have registered for this event. Please check in when the
                  event starts.
                </p>
              )}

            {isEventCreator && event.type === "1" && inProgress() && (
              <div className="flex flex-col gap-5">
                <p className="font-semibold">
                  Event is in progress. Scan the QR Code to checkin:
                </p>
                <div className="">
                  <Canvas
                    text={qrcodeUrl}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 0,
                      scale: 4,
                      width: 150,
                      color: {
                        dark: "#000",
                        light: "#f6f8fd",
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {!isEventCreator && hasOrdered && event.type === "2" && (
              <div className="flex flex-col gap-5">
                <p className="font-semibold">This is a pre-recorded session.</p>
                <Button asChild className="button rounded-full" size="lg">
                  <Link href={videoPage}>Start Session</Link>
                </Button>
              </div>
            )}
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
