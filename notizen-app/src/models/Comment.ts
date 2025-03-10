import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { INote } from "./Note";

export interface IComment extends Document {
  text: string;
  author: IUser["_id"];
  note: INote["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Kommentartext ist erforderlich"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
