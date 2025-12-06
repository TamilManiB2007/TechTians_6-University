import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // Roll No maari Teacher ku ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true }, // Eg: CSE, ECE
  designation: { type: String, default: "Assistant Professor" },
  subjectsHandled: [{ type: String }], // Enna subjects edukuraanga
}, { timestamps: true });

export const Faculty = mongoose.model("Faculty", facultySchema);