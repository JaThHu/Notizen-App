import mongoose from "mongoose";

// Globale Variable für die Datenbankverbindung
let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  // Sicherstellen, dass die MongoDB-URI verfügbar ist
  if (!process.env.MONGODB_URI) {
    throw new Error("Bitte definieren Sie die MONGODB_URI Umgebungsvariable");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = conn;
    console.log("MongoDB-Verbindung hergestellt");
    return conn;
  } catch (error) {
    console.error("MongoDB-Verbindungsfehler:", error);
    throw error;
  }
}
