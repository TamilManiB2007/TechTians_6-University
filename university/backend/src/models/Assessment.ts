
import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Internal Assessment 1"
  department: { type: String, required: true }, // e.g., "CSE"
  forYear: { type: String, required: true }, // e.g., "IV"
  totalMarks: { type: Number, required: true },
  createdBy: { type: String, required: true }, // Faculty ID (FAC001)
  questions: [
    {
      q: { type: String, required: true },
      options: [{ type: String }],
      answer: { type: Number, required: true } // Index of correct option (0, 1, 2, 3)
    }
  ]
}, { timestamps: true });

export const Assessment = mongoose.model("Assessment", assessmentSchema);