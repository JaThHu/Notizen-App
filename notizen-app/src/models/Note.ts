import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface INote extends Document {
  title: string;
  content: string;
  author: IUser["_id"];
  completed: boolean;
  likes: IUser["_id"][];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Titel ist erforderlich"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Inhalt ist erforderlich"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
