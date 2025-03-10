import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name ist erforderlich"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "E-Mail ist erforderlich"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false, // Passwort wird standardmäßig nicht abgerufen
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prüfen ob das Modell bereits existiert, um Überschreibungen zu vermeiden
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
