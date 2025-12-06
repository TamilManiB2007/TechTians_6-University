import { Router, Request, Response } from "express";
import { Student } from "../models/Student"; // Check path

const router = Router();

// 1. GET ALL STUDENTS (For Faculty Dashboard)
router.get("/", async (req: Request, res: Response) => {
  try {
    const students = await Student.find().select("-password").sort({ rollNumber: 1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. SUBMIT QUIZ SCORE (Save to DB)
router.post("/submit-quiz", async (req: Request, res: Response) => {
  try {
    const { studentId, title, score, totalMarks } = req.body;

    if (!studentId || !title) {
      return res.status(400).json({ message: "Missing details" });
    }

    // Push new assessment result into the student's record
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $push: {
          assessments: {
            title,
            score,
            totalMarks,
            date: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Score saved", assessments: updatedStudent.assessments });
  } catch (err) {
    console.error("Submit Quiz Error:", err);
    res.status(500).json({ message: "Error saving score" });
  }
});

export default router;