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

interface NoteProps {
  _id: string;
  title: string;
  content: string;
  author: Author;
  completed: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onToggleLike: (id: string) => void;
  onViewComments: (id: string) => void;
}

const NoteCard: React.FC<NoteProps> = ({
  _id,
  title,
  content,
  author,
  completed,
  likes,
  createdAt,
  updatedAt,
  onDelete,
  onToggleComplete,
  onToggleLike,
  onViewComments,
}) => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  const isAuthor = session?.user?.id === author._id;

  // Verbesserter Vergleich zur Überprüfung des Like-Status
  const userId = session?.user?.id;
  const isLiked = userId
    ? likes.some((id) => id.toString() === userId.toString())
    : false;

  console.log("User ID:", userId);
  console.log("Likes:", likes);
  console.log("Is Liked:", isLiked);

  const likeCount = likes.length;

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: de,
  });

  return (
    <div
      className={`bg-white rounded-lg shadow p-5 mb-4 border-l-4 ${
        completed ? "border-green-500" : "border-blue-500"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`text-lg font-semibold text-black ${
            completed ? "line-through text-black" : ""
          }`}
        >
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleComplete(_id, !completed)}
            className={`p-1 rounded ${
              completed ? "text-green-600" : "text-black"
            }`}
            title={
              completed ? "Als unerledigt markieren" : "Als erledigt markieren"
            }
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={() => onToggleLike(_id)}
            className={`p-1 rounded ${isLiked ? "text-red-600" : "text-black"}`}
            title={isLiked ? "Like entfernen" : "Liken"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          {isAuthor && (
            <button
              onClick={() => onDelete(_id)}
              className="p-1 rounded text-black hover:text-red-600"
              title="Löschen"
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
      </div>

      <div className="mt-2">
        <p className={`text-black ${isExpanded ? "" : "line-clamp-3"}`}>
          {content}
        </p>
        {content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm mt-1"
          >
            {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
          </button>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-black">
        <div>
          <span>
            Von {author.name} • {formattedDate}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewComments(_id)}
          >
            Kommentare
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
