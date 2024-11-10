"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import {
  addCommentToEvent,
  getCommentsByEvent,
} from "@/lib/actions/comment.actions";

type Comment = {
  userId: string;
  text: string;
  timestamp: Date;
};

const Comments = ({ id, userId }: { id: string; userId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const { user } = useUser();
  useEffect(() => {
    // Fetch and sort comments when the component loads
    const fetchComments = async () => {
      const eventComments = await getCommentsByEvent(id);
      // console.log(eventComments);
      if (eventComments) {
        const sortedComments = eventComments.comments
          .map((c: any) => ({
            userId: c.userName,
            text: c.comment,
            timestamp: new Date(c.commentTimeStamp),
          }))
          .sort(
            (a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime()
          ); // Sort by timestamp, latest first

        setComments(sortedComments);
      }
    };
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (newComment.trim() && user) {
      const success = await addCommentToEvent({
        eventId: id,
        userId,
        userName: user.username || "Anonymous",
        comment: newComment,
      });
      if (success) {
        const newCommentObj: Comment = {
          userId: user.username || "Anonymous",
          text: newComment,
          timestamp: new Date(),
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
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

  return (
    <div className="w-full p-4 mt-6 bg-white rounded-lg shadow-md">
      <h2 className="font-semibold text-gray-800">Comments</h2>

      {/* Comment Form */}
      <div className="mt-4 flex items-center space-x-2">
        <Input
          placeholder="Add a comment..."
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="input-field"
        />
        <Button onClick={handleAddComment} className="button w-52">
          Post
        </Button>
      </div>

      {/* Comments List */}
      <ul className="mt-4 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <li key={index} className="flex items-center gap-2">
              <p>{comment.userId}</p>
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-full shadow-sm w-full">
                <p className="text-gray-700">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(comment.timestamp)}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </ul>
    </div>
  );
};

export default Comments;
