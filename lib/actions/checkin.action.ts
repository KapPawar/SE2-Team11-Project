"use server";

import { connectToDatabase } from "../mongodb/database";
import EventCheckIn from "../mongodb/database/models/checkin.model";
import { handleError } from "../utils";
import { ObjectId } from "mongodb";

interface CreateEventCheckInParams {
  eventId: string;
  userId: string;
}

export const checkEventCheckIn = async ({
  eventId,
  userId,
}: CreateEventCheckInParams): Promise<boolean> => {
  try {
    await connectToDatabase();

    // Check if the user is already checked in for the event
    const existingCheckIn = await EventCheckIn.findOne({
      event: eventId,
      "checkedInUsers.userId": userId,
    });

    // If the user is already checked in, return false
    if (existingCheckIn) return true;

    // Return true if the operation was successful, otherwise false
    return false;
  } catch (error) {
    handleError(error);
    return false; // Return false if an error occurred
  }
};

export const createEventCheckIn = async ({
  eventId,
  userId,
}: CreateEventCheckInParams): Promise<boolean> => {
  try {
    await connectToDatabase();

    // Check if the user is already checked in for the event
    const existingCheckIn = await EventCheckIn.findOne({
      event: eventId,
      "checkedInUsers.userId": userId,
    });

    // If the user is already checked in, return false
    if (existingCheckIn) return true;

    // Otherwise, add the new check-in entry
    const result = await EventCheckIn.findOneAndUpdate(
      { event: eventId },
      { $push: { checkedInUsers: { userId, checkInTime: new Date() } } },
      { new: true, upsert: true }
    );

    // Return true if the operation was successful, otherwise false
    return !!result;
  } catch (error) {
    handleError(error);
    return false; // Return false if an error occurred
  }
};

export const getCheckInsByEvent = async (eventId: string) => {
  try {
    await connectToDatabase();
    const checkIns = await EventCheckIn.findOne({ event: eventId }).populate(
      "checkedInUsers.userId"
    );
    return JSON.parse(JSON.stringify(checkIns));
  } catch (error) {
    handleError(error);
  }
};

export async function getCheckInsByEventId({
  searchString,
  eventId,
}: {
  searchString?: string;
  eventId: string;
}) {
  try {
    await connectToDatabase();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const checkIns = await EventCheckIn.aggregate([
      {
        $match: { event: eventObjectId },
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $unwind: "$eventDetails",
      },
      {
        $unwind: "$checkedInUsers",
      },
      {
        $lookup: {
          from: "users",
          localField: "checkedInUsers.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          eventId: "$eventDetails._id",
          eventTitle: "$eventDetails.title",
          eventDate: "$eventDetails.date", // assuming `date` exists in the event schema
          checkedInUser: {
            userId: "$user._id",
            fullName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
            checkInTime: "$checkedInUsers.checkInTime",
          },
        },
      },
      {
        $match: {
          "checkedInUser.fullName": { $regex: RegExp(searchString || "", "i") },
        },
      },
    ]);

    return JSON.parse(JSON.stringify(checkIns));
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    throw error;
  }
}
