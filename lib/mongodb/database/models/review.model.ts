import { Document, Schema, model, models } from "mongoose";

// Interface for a Review
export interface IReview {
  userId: string; // Reference to User
  userName: string; // User's name
  review: string; // The actual review text
  rating: number; // Rating for the review (e.g., 1-5)
  reviewTimeStamp: Date; // Date when the review was posted
}

// Interface for Event Reviews (Including average rating for the event)
export interface IEventReview extends Document {
  event: string; // Reference to Event
  reviews: IReview[]; // Array of reviews
  averageRating: number; // The average rating of the event calculated from all reviews
}

// Define the schema for an individual review
const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1-5
  reviewTimeStamp: { type: Date, default: Date.now },
});

// Define the schema for the event reviews
const EventReviewSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  reviews: [ReviewSchema], // Array of reviews for the event
  averageRating: { type: Number, default: 0 }, // Stores the average rating for the event
});

// Create and export the EventReview model
const EventReviews =
  models.EventReviews || model("EventReviews", EventReviewSchema);

export default EventReviews;
