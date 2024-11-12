"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  addReviewToEvent,
  getReviewsByEvent,
} from "@/lib/actions/review.actions";
import { getEventById } from "@/lib/actions/event.actions";
import Link from "next/link";

type Review = {
  userId: string;
  userName: string;
  text: string;
  rating: number;
  timestamp: Date;
};

const Reviews = ({ id, userId }: { id: string; userId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [event, setEvent] = useState<any>(null);

  const { user } = useUser();
  console.log(user);
  useEffect(() => {
    // Fetch and sort reviews when the component loads
    const fetchReviews = async () => {
      const eventReviews = await getReviewsByEvent({ eventId: id });
      if (eventReviews) {
        const sortedReviews = eventReviews.reviews
          .map((r: any) => ({
            userId: r.userId,
            userName: r.userName,
            text: r.review,
            rating: r.rating,
            timestamp: new Date(r.reviewTimeStamp),
          }))
          .sort(
            (a: Review, b: Review) =>
              b.timestamp.getTime() - a.timestamp.getTime()
          ); // Sort by timestamp, latest first

        setReviews(sortedReviews);
      }
    };

    const fetchEvent = async () => {
      const event = await getEventById(id);
      setEvent(event);
    };
    fetchReviews();
    fetchEvent();
  }, [id]);

  const handleAddReview = async () => {
    if (newReview.trim() && rating > 0 && rating <= 5 && user) {
      const success = await addReviewToEvent({
        eventId: id,
        userId,
        userName: user.username || "Anonymous",
        review: newReview,
        rating,
      });
      if (success) {
        const newReviewObj: Review = {
          userId: user.username || "Anonymous",
          userName: user.username || "Anonymous",
          text: newReview,
          rating,
          timestamp: new Date(),
        };
        setReviews([newReviewObj, ...reviews]);
        setNewReview("");
        setRating(0);
      }
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - timestamp.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 120) return "a minute ago";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 7200) return "an hour ago";
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return "yesterday";
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  return (
    <>
      <section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left ">
          Reviews ({reviews.length})
        </h3>
        {event && (
          <h3 className="wrapper text-lg font-bold text-center sm:text-left text-primary-500">
            {event.title}
          </h3>
        )}
      </section>

      <div className="p-4 m-10 bg-white rounded-lg shadow-md flex flex-col justify-center">
        {/* Review Form */}
        <SignedIn>
          <div className="w-full mt-4 flex flex-col items-center justify-center space-y-2">
            <Input
              placeholder="Add a review..."
              type="text"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="input-field"
            />
            <div className="flex items-center justify-center file:space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  {star <= rating ? "★" : "☆"}
                </span>
              ))}
            </div>
            <Button onClick={handleAddReview} className="button w-full md:w-52">
              Post
            </Button>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center justify-center">
            <p className="text-gray-600">Login to add a review</p>
          </div>
        </SignedOut>

        {/* Reviews List */}
        <ul className="mt-4 space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <li
                key={index}
                className="flex items-center justify-center gap-2"
              >
                <p className="font-semibold">{review.userName}</p>
                <div className="flex items-start justify-between p-3 bg-gray-100 rounded-lg shadow-sm w-full">
                  <div className="flex flex-col">
                    <p className="text-sm text-yellow-500">
                      Rating:{" "}
                      {"★".repeat(review.rating) +
                        "☆".repeat(5 - review.rating)}
                    </p>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(review.timestamp)}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Reviews;
