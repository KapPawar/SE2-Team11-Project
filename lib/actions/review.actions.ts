"use server";

import { connectToDatabase } from "../mongodb/database";
import EventReviews from "../mongodb/database/models/review.model";
import { handleError } from "../utils";

// Interface for adding a review
interface AddReviewParams {
  eventId: string;
  userId: string;
  userName: string;
  review: string;
  rating: number; // Rating for the review (1-5)
}

// Interface for getting reviews
interface GetReviewsParams {
  eventId: string;
}

// Function to calculate the average rating for an event
const calculateAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

// Add a review to the event
export const addReviewToEvent = async ({
  eventId,
  userId,
  userName,
  review,
  rating,
}: AddReviewParams): Promise<boolean> => {
  try {
    await connectToDatabase();

    // Add the new review entry
    const result = await EventReviews.findOneAndUpdate(
      { event: eventId },
      {
        $push: {
          reviews: {
            userId,
            userName,
            review,
            rating,
            reviewTimeStamp: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    if (result) {
      // Calculate the new average rating for the event
      const averageRating = calculateAverageRating(result.reviews);

      // Update the event's average rating
      result.averageRating = averageRating;
      await result.save();
    }

    return !!result;
  } catch (error) {
    handleError(error);
    return false; // Return false if an error occurred
  }
};

// Get reviews by event ID
export const getReviewsByEvent = async ({ eventId }: GetReviewsParams) => {
  try {
    await connectToDatabase();

    const eventReviews = await EventReviews.findOne({ event: eventId })
      .populate("reviews.userId") // Populate the user details for each review
      .exec();

    return JSON.parse(JSON.stringify(eventReviews));
  } catch (error) {
    handleError(error);
  }
};
