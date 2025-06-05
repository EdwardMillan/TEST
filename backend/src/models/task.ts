import { InferSchemaType, Schema, model } from "mongoose";

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  isChecked: { type: Boolean, default: false },
  dateCreated: { type: Date, required: true },
  assignee: { type: Schema.Types.ObjectId, ref: "User", required: false }, // 👈 Add this line
});

type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("Task", taskSchema);
