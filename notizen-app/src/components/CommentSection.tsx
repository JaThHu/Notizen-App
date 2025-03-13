"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface Author {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface Comment {
  _id: string;
  text: string;
  author: Author;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  noteId: string;
  comments: Comment[];
  onAddComment: (noteId: string, text: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  noteId,
  comments,
  onAddComment,
  onDeleteComment,
}) => {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      await onAddComment(noteId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Kommentars:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6 ">
          <div className="flex flex-col space-y-2 text-black">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Schreibe einen Kommentar..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? "Wird gesendet..." : "Kommentar senden"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-black mb-4">
          Bitte melde dich an, um Kommentare zu hinterlassen.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-black">
          Noch keine Kommentare. Sei der Erste, der einen Kommentar hinterlässt!
        </p>
      ) : (
        <div className="space-y-4 text-black">
          {comments.map((comment) => (
            <div key={comment._id} className="flex justify-between items-start">
              <div>
                <p className="font-medium">{comment.author.name}</p>
                <p>{comment.text}</p>
                <p className="text-sm text-black">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: de,
                  })}
                </p>
              </div>
              {session?.user?.email === comment.author.email && (
                <button
                  onClick={() => onDeleteComment(comment._id)}
                  className="text-black hover:text-red-600"
                  title="Kommentar löschen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
