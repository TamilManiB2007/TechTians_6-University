import mongoose from "mongoose";
import dotenv from "dotenv";
import { Student } from "./models/Student";
import { Faculty } from "./models/Faculty"; // Import Faculty

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

// --- 1. SEED STUDENTS ---
const seedStudents = async () => {
  const rollNo = "TT21CS001";
  
  // Check if student exists
  const existing = await Student.findOne({
    $or: [{ rollNo }, { rollNumber: rollNo }],
  });

  if (!existing) {
    await Student.create({
      rollNumber: rollNo,
      name: "Tamil Mani",
      department: "Computer Science",
      email: "tamil@college.edu",
      password: "password123", // Student Password
      cgpa: 8.5,
      attendance: 92,
      section: "A",
      batch: "2021-2025",
      subjects: [
        { name: "Algorithms", grade: "A" },
        { name: "Data Structures", grade: "A+" },
        { name: "Operating Systems", grade: "B+" },
      ],
    });
    console.log("✅ Student Created: TT21CS001");
  } else {
    console.log("ℹ️  Student TT21CS001 already exists");
  }
};

// --- 2. SEED FACULTY (TEACHERS) ---
const seedFaculty = async () => {
  
  // Teacher 1: Dr. Anbu Selvan (HOD)
  const empId1 = "FAC001";
  const existing1 = await Faculty.findOne({ employeeId: empId1 });

  if (!existing1) {
    await Faculty.create({
      employeeId: empId1,
      name: "Dr. Anbu Selvan",
      email: "anbu@college.edu",
      password: "password123", // Teacher Password
      department: "CSE",
      designation: "HOD",
      subjectsHandled: ["Data Structures", "Operating Systems"],
    });
    console.log("✅ Teacher 1 Created: FAC001 (Dr. Anbu)");
  } else {
    console.log("ℹ️  Teacher FAC001 already exists");
  }

  // Teacher 2: Prof. Priya (Assistant Prof)
  const empId2 = "FAC002";
  const existing2 = await Faculty.findOne({ employeeId: empId2 });

  if (!existing2) {
    await Faculty.create({
      employeeId: empId2,
      name: "Prof. Priya",
      email: "priya@college.edu",
      password: "password123", // Teacher Password
      department: "ECE",
      designation: "Assistant Professor",
      subjectsHandled: ["Microprocessors", "Digital Electronics"],
    });
    console.log("✅ Teacher 2 Created: FAC002 (Prof. Priya)");
  } else {
    console.log("ℹ️  Teacher FAC002 already exists");
  }
};

// --- 3. MAIN RUN FUNCTION ---
const run = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(MONGO_URI);
    console.log("🔌 Connected to MongoDB for Seeding");

    await seedStudents(); // Run Student Seed
    await seedFaculty();  // Run Faculty Seed

    console.log("🌱 Seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

run();