import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/utils/mongodb";
import Note from "@/models/Note";
import mongoose from "mongoose";

// PATCH /api/notes/[id]/like - Eine Notiz liken oder Unlike
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

    await connectToDatabase();

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Notiz nicht gefunden" },
        { status: 404 }
      );
    }

    const userId = session.user.id;

    // Prüfen, ob der Benutzer die Notiz bereits geliked hat
    const isLiked = note.likes.includes(userId);

    let updatedNote;

    if (isLiked) {
      // Unlike - Benutzer aus der Likes-Liste entfernen
      updatedNote = await Note.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("author", "name email image");
    } else {
      // Like - Benutzer zur Likes-Liste hinzufügen
      updatedNote = await Note.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      ).populate("author", "name email image");
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Fehler beim Liken/Unliken der Notiz:", error);
    return NextResponse.json(
      { error: "Fehler beim Liken/Unliken der Notiz" },
      { status: 500 }
    );
  }
}
