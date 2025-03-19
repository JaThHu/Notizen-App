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
  loading: boolean;
  onAddComment: (noteId: string, text: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  noteId,
  comments,
  loading,
  onAddComment,
  onDeleteComment,
}) => {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      await onAddComment(noteId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Kommentars:", error);
      setError(
        "Fehler beim Hinzufügen des Kommentars. Bitte versuche es erneut."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Kommentare</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col space-y-2">
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
        <p className="text-gray-600 mb-4">
          Bitte melde dich an, um Kommentare zu hinterlassen.
        </p>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Noch keine Kommentare vorhanden.</p>
          <p className="text-gray-500 text-sm">
            Sei der Erste, der einen Kommentar hinterlässt!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="flex items-start space-x-3">
                {comment.author.image && (
                  <img
                    src={comment.author.image}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-black">
                    {comment.author.name}
                  </p>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </p>
                </div>
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
