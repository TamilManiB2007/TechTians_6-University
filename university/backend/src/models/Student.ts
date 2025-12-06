import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cgpa: { type: Number },
  attendance: { type: Number },
  subjects: [{
    name: String,
    grade: String
  }],
  // --- NEW FIELD: Stores Exam Results ---
  assessments: [{
    title: String,
    score: Number,
    totalMarks: Number,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Student = mongoose.model("Student", studentSchema);