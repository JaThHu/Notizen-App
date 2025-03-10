import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongodb";
import User from "@/models/User";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validierung der Eingaben
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ungültiges E-Mail-Format" },
        { status: 400 }
      );
    }

    // Passwortlänge überprüfen
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Das Passwort muss mindestens 6 Zeichen lang sein" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Überprüfen, ob die E-Mail bereits verwendet wird
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse wird bereits verwendet" },
        { status: 409 }
      );
    }

    // Passwort hashen
    const hashedPassword = await hash(password, 10);

    // Neuen Benutzer erstellen
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Passwort aus der Antwort entfernen
    const user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    return NextResponse.json(
      { error: "Fehler bei der Registrierung" },
      { status: 500 }
    );
  }
}
