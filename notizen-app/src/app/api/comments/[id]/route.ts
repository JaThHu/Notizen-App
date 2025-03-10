import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/utils/mongodb";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

// DELETE /api/comments/[id] - Einen Kommentar löschen
export async function DELETE(
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
        { error: "Ungültige Kommentar-ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const comment = await Comment.findById(id);

    if (!comment) {
      return NextResponse.json(
        { error: "Kommentar nicht gefunden" },
        { status: 404 }
      );
    }

    // Überprüfen, ob der Benutzer der Autor des Kommentars ist
    if (comment.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Nicht berechtigt, diesen Kommentar zu löschen" },
        { status: 403 }
      );
    }

    await Comment.findByIdAndDelete(id);

    return NextResponse.json({ message: "Kommentar erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Kommentars:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Kommentars" },
      { status: 500 }
    );
  }
}
