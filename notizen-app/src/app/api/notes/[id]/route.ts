import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/utils/mongodb";
import Note from "@/models/Note";
import Comment from "@/models/Comment";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/notes/[id] - Eine bestimmte Notiz abrufen
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Ungültige Notiz-ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const note = await Note.findById(id).populate("author", "name email image");

    if (!note) {
      return NextResponse.json(
        { error: "Notiz nicht gefunden" },
        { status: 404 }
      );
    }

    // Kommentare zur Notiz abrufen
    const comments = await Comment.find({ note: id })
      .populate("author", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ note, comments });
  } catch (error) {
    console.error("Fehler beim Abrufen der Notiz:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Notiz" },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Eine Notiz löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const noteId = params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { error: "Ungültige Notiz-ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Notiz finden und überprüfen, ob der Benutzer der Autor ist
    const note = await Note.findById(noteId);

    if (!note) {
      return NextResponse.json(
        { error: "Notiz nicht gefunden" },
        { status: 404 }
      );
    }

    // Überprüfen, ob der Benutzer der Autor ist
    if (note.author.toString() !== session.user.id.toString()) {
      return NextResponse.json(
        { error: "Nicht berechtigt, diese Notiz zu löschen" },
        { status: 403 }
      );
    }

    // Notiz löschen
    await Note.findByIdAndDelete(noteId);

    // Zugehörige Kommentare löschen
    await Comment.deleteMany({ note: noteId });

    return NextResponse.json({ message: "Notiz erfolgreich gelöscht" });
  } catch (error) {
    console.error("Detaillierter Fehler beim Löschen der Notiz:", error);

    // Detailliertere Fehlerinformationen zurückgeben
    const errorMessage =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    const errorDetails = {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    };

    return NextResponse.json(errorDetails, { status: 500 });
  }
}

// PATCH /api/notes/[id] - Eine Notiz aktualisieren
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Ungültige Notiz-ID" },
        { status: 400 }
      );
    }

    const { title, content, completed } = await req.json();

    await connectToDatabase();

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Notiz nicht gefunden" },
        { status: 404 }
      );
    }

    // Wenn Titel oder Inhalt aktualisiert werden, muss der Benutzer der Autor sein
    if (
      (title !== undefined || content !== undefined) &&
      note.author.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Nicht berechtigt, diese Notiz zu bearbeiten" },
        { status: 403 }
      );
    }

    // Aktualisierbare Felder
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (completed !== undefined) updateData.completed = completed;

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("author", "name email image");

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Notiz:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Notiz" },
      { status: 500 }
    );
  }
}
