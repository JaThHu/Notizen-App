"use client";

import React, { useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";

interface CreateNoteFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung
    if (!title.trim()) {
      setError("Bitte gib einen Titel ein");
      return;
    }

    if (!content.trim()) {
      setError("Bitte gib einen Inhalt ein");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(title, content);
      // Formular zurücksetzen
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Fehler beim Erstellen der Notiz. Bitte versuche es erneut.");
      console.error("Fehler beim Erstellen der Notiz:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">
        Neue Notiz erstellen
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Titel"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel der Notiz"
          fullWidth
          disabled={isSubmitting}
        />

        <TextArea
          label="Inhalt"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Inhalt der Notiz"
          rows={5}
          fullWidth
          disabled={isSubmitting}
        />

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wird erstellt..." : "Notiz erstellen"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateNoteForm;
