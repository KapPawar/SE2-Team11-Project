import { Document, Schema, model, models } from "mongoose";

export interface IComment {
  userId: string; // Reference to User
  userName: string; // User name
  comment: string; // Comment text
  commentTimeStamp: Date; // Time of check-in
}

export interface IEventComment extends Document {
  event: string; // Reference to Event
  comments: IComment[]; // Array of checked-in users with timestamps
}

// Define the nested schema for each checked-in user
const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String },
  comment: { type: String },
  commentTimeStamp: { type: Date, default: Date.now },
});

// Define the main EventCheckIn schema
const EventCommentSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  comments: [CommentSchema], // Array of nested user check-in details
});

// Create and export the EventCheckIn model
const EventComments =
  models.EventComments || model("EventComments", EventCommentSchema);

export default EventComments;
