import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/utils/mongodb";
import Comment from "@/models/Comment";
import Note from "@/models/Note";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";

// POST /api/comments - Neuen Kommentar erstellen
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { text, noteId } = await req.json();

    if (!text || !noteId) {
      return NextResponse.json(
        { error: "Text und Notiz-ID sind erforderlich" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { error: "Ungültige Notiz-ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Überprüfen, ob die Notiz existiert
    const note = await Note.findById(noteId);

    if (!note) {
      return NextResponse.json(
        { error: "Notiz nicht gefunden" },
        { status: 404 }
      );
    }

    const newComment = await Comment.create({
      text,
      author: session.user.id,
      note: noteId,
    });

    // Kommentar mit Autor-Informationen zurückgeben
    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "name email image"
    );

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Detaillierter Fehler beim Erstellen des Kommentars:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Fehler beim Erstellen des Kommentars",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Kommentar löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const commentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { error: "Ungültige Kommentar-ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Kommentar finden und überprüfen, ob der Benutzer der Autor ist
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: "Kommentar nicht gefunden" },
        { status: 404 }
      );
    }

    // Debug-Ausgabe für die IDs
    console.log("Vergleich der IDs:", {
      commentAuthorId: comment.author.toString(),
      sessionUserId: session.user.id.toString(),
      commentAuthor: comment.author,
      sessionUser: session.user,
    });

    // Überprüfen, ob der Benutzer der Autor ist
    const commentAuthorId = comment.author.toString();
    const sessionUserId = session.user.id.toString();

    if (commentAuthorId !== sessionUserId) {
      return NextResponse.json(
        { error: "Nicht berechtigt, diesen Kommentar zu löschen" },
        { status: 403 }
      );
    }

    // Kommentar löschen
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ message: "Kommentar erfolgreich gelöscht" });
  } catch (error) {
    console.error("Detaillierter Fehler beim Löschen des Kommentars:", error);

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
