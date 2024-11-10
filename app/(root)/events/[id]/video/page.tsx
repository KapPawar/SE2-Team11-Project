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
      <Comments id={id} userId={userId} />
    </section>
  );
};

export default VideoPage;
