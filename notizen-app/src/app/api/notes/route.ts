import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/utils/mongodb";
import Note from "@/models/Note";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/notes - Alle Notizen abrufen
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    await connectToDatabase();

    const notes = await Note.find()
      .populate("author", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Fehler beim Abrufen der Notizen:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Notizen" },
      { status: 500 }
    );
  }
}

// POST /api/notes - Neue Notiz erstellen
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titel und Inhalt sind erforderlich" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newNote = await Note.create({
      title,
      content,
      author: session.user.id,
      completed: false,
      likes: [],
    });

    // Notiz mit Autor-Informationen zurückgeben
    const populatedNote = await Note.findById(newNote._id).populate(
      "author",
      "name email image"
    );

    return NextResponse.json(populatedNote, { status: 201 });
  } catch (error) {
    console.error("Detaillierter Fehler beim Erstellen der Notiz:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Fehler beim Erstellen der Notiz",
      },
      { status: 500 }
    );
  }
}
