import { Document, Schema, model, models } from "mongoose";

export interface ICheckedInUser {
  userId: string; // Reference to User
  checkInTime: Date; // Time of check-in
}

export interface IEventCheckIn extends Document {
  event: string; // Reference to Event
  checkedInUsers: ICheckedInUser[]; // Array of checked-in users with timestamps
}

// Define the nested schema for each checked-in user
const CheckedInUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  checkInTime: { type: Date, default: Date.now },
});

// Define the main EventCheckIn schema
const EventCheckInSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  checkedInUsers: [CheckedInUserSchema], // Array of nested user check-in details
});

// Create and export the EventCheckIn model
const EventCheckIn =
  models.EventCheckIn || model("EventCheckIn", EventCheckInSchema);

export default EventCheckIn;
