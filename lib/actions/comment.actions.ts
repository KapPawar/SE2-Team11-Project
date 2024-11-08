"use server";

import { connectToDatabase } from "../mongodb/database";
import EventComments from "../mongodb/database/models/comment.model";
import { handleError } from "../utils";

interface AddCommentParams {
  eventId: string;
  userId: string;
  userName: string;
  comment: string;
}

export const addCommentToEvent = async ({
  eventId,
  userId,
  userName,
  comment,
}: AddCommentParams): Promise<boolean> => {
  try {
    await connectToDatabase();

    // Add the new comment entry
    const result = await EventComments.findOneAndUpdate(
      { event: eventId },
      {
        $push: {
          comments: { userId, userName, comment, commentTimeStamp: new Date() },
        },
      },
      { new: true, upsert: true }
    );

    // Return true if the operation was successful, otherwise false
    return !!result;
  } catch (error) {
    handleError(error);
    return false; // Return false if an error occurred
  }
};

export const getCommentsByEvent = async (eventId: string) => {
  try {
    await connectToDatabase();
    const eventComments = await EventComments.findOne({
      event: eventId,
    }).populate("comments.userId");
    return JSON.parse(JSON.stringify(eventComments));
  } catch (error) {
    handleError(error);
  }
};
