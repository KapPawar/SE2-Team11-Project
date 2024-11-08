import Comments from "@/components/shared/Comments";
import { getCommentsByEvent } from "@/lib/actions/comment.actions";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import React, { useState } from "react";

type VideoEventProps = {
  params: {
    id: string;
  };
};

const VideoPage = async ({ params: { id } }: VideoEventProps) => {
  const event = await getEventById(id);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const comments = await getCommentsByEvent(id);

  return (
    <section className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="relative w-full aspect-video overflow-hidden bg-gray-200 rounded-lg shadow-lg">
        <video controls preload="none" className="w-full h-full rounded-lg">
          <source src={event.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Comments Section */}
      <Comments id={id} userId={userId} />
      {/* Comment Form */}
      {/* <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Post
          </button>
        </div> */}

      {/* Comments List */}
      {/* <ul className="mt-4 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-gray-700">{comment}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </ul> */}
    </section>
  );
};

export default VideoPage;
