"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CreateNoteForm from "@/components/CreateNoteForm";
import NoteCard from "@/components/NoteCard";
import CommentSection from "@/components/CommentSection";
import Button from "@/components/Button";

interface Author {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  author: Author;
  completed: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  text: string;
  author: Author;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Notizen laden
  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes();
    }
  }, [status]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Notizen");
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError("Fehler beim Laden der Notizen. Bitte versuche es erneut.");
      console.error("Fehler beim Laden der Notizen:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server-Fehler:", data);
        throw new Error(data.error || "Fehler beim Erstellen der Notiz");
      }

      setNotes((prevNotes) => [data, ...prevNotes]);
    } catch (err) {
      console.error("Detaillierter Fehler beim Erstellen der Notiz:", err);
      setError(
        err instanceof Error ? err.message : "Fehler beim Erstellen der Notiz"
      );
      throw err;
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Möchtest du diese Notiz wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server-Fehler Details:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(
          data.error ||
            `Fehler beim Löschen der Notiz (Status: ${response.status})`
        );
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));

      // Wenn die gelöschte Notiz ausgewählt war, Auswahl zurücksetzen
      if (selectedNote === id) {
        setSelectedNote(null);
        setComments([]);
      }
    } catch (err) {
      console.error("Detaillierter Fehler beim Löschen der Notiz:", err);
      setError(
        err instanceof Error ? err.message : "Fehler beim Löschen der Notiz"
      );
      throw err;
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren der Notiz");
      }

      const updatedNote = await response.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Notiz:", err);
      alert("Fehler beim Aktualisieren der Notiz. Bitte versuche es erneut.");
    }
  };

  const handleToggleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}/like`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Liken der Notiz");
      }

      const updatedNote = await response.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
    } catch (err) {
      console.error("Fehler beim Liken der Notiz:", err);
      alert("Fehler beim Liken der Notiz. Bitte versuche es erneut.");
    }
  };

  const handleViewComments = async (id: string) => {
    setSelectedNote(id);
    setLoadingComments(true);

    try {
      const response = await fetch(`/api/notes/${id}`);

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Kommentare");
      }

      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      console.error("Fehler beim Laden der Kommentare:", err);
      alert("Fehler beim Laden der Kommentare. Bitte versuche es erneut.");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (noteId: string, text: string) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId, text }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server-Fehler:", data);
        throw new Error(data.error || "Fehler beim Hinzufügen des Kommentars");
      }

      setComments((prevComments) => [data, ...prevComments]);
    } catch (err) {
      console.error(
        "Detaillierter Fehler beim Hinzufügen des Kommentars:",
        err
      );
      setError(
        err instanceof Error
          ? err.message
          : "Fehler beim Hinzufügen des Kommentars"
      );
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Möchtest du diesen Kommentar wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server-Fehler Details:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(
          data.error ||
            `Fehler beim Löschen des Kommentars (Status: ${response.status})`
        );
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Detaillierter Fehler beim Löschen des Kommentars:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Fehler beim Löschen des Kommentars"
      );
      throw err;
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-8">Wird geladen...</div>;
  }

  if (status === "unauthenticated") {
    return null; // Wird zur Anmeldeseite weitergeleitet
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>
        )}

        <CreateNoteForm onSubmit={handleCreateNote} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Deine Notizen</h2>

          {notes.length === 0 ? (
            <p className="text-gray-500">
              Noch keine Notizen vorhanden. Erstelle deine erste Notiz!
            </p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  {...note}
                  onDelete={handleDeleteNote}
                  onToggleComplete={handleToggleComplete}
                  onToggleLike={handleToggleLike}
                  onViewComments={handleViewComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-1">
        {selectedNote ? (
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Kommentare</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedNote(null);
                  setComments([]);
                }}
              >
                Schließen
              </Button>
            </div>

            {loadingComments ? (
              <p className="text-center py-4">Kommentare werden geladen...</p>
            ) : (
              <CommentSection
                noteId={selectedNote}
                comments={comments}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
              />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Kommentare</h2>
            <p className="text-gray-500">
              Wähle eine Notiz aus, um Kommentare anzuzeigen oder hinzuzufügen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
