import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = Router();

// --- 1. LOAD MODELS (Student & Faculty) ---
let Student: any;
try {
  const mod = require("../models/Student");
  Student = mod && (mod.default || mod.Student || mod);
} catch { /* ignore */ }
if (!Student) Student = (mongoose.models as any).Student;

let Faculty: any;
try {
  const mod = require("../models/Faculty");
  Faculty = mod && (mod.default || mod.Faculty || mod);
} catch { /* ignore */ }
if (!Faculty) Faculty = (mongoose.models as any).Faculty;

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// --- 2. LOGIN ROUTE ---
router.post("/login", async (req: Request, res: Response) => {
  try {
    const loginId = req.body.rollNumber || req.body.rollNo || req.body.employeeId; 
    const password = req.body.password;

    if (!loginId || !password) return res.status(400).json({ message: "Missing credentials" });

    console.log(`Checking Login for: ${loginId}`);

    // ==========================================
    // 1. CHECK STUDENT (Priority)
    // ==========================================
    let studentUser = await Student.findOne({
      $or: [{ rollNo: loginId }, { rollNumber: loginId }],
    });

    if (studentUser) {
      console.log("✅ Found Student document");
      
      // FIX: Check if comparePassword exists (Hashed) OR direct compare (Plain)
      let isMatch = false;
      if (typeof studentUser.comparePassword === 'function') {
         isMatch = await studentUser.comparePassword(password);
      } else {
         isMatch = studentUser.password === password;
      }

      if (!isMatch) {
        console.log("❌ Student Password Mismatch");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate Token
      const token = jwt.sign(
        { id: studentUser._id.toString(), role: "student" }, 
        JWT_SECRET, 
        { expiresIn: "7d" }
      );
      
      const out = studentUser.toObject();
      delete out.password;
      return res.json({ token, user: { ...out, role: "student" } });
    }

    // ==========================================
    // 2. CHECK FACULTY (If not Student)
    // ==========================================
    if (Faculty) {
      let facultyUser = await Faculty.findOne({
         $or: [{ employeeId: loginId }, { email: loginId }] 
      });

      if (facultyUser) {
        console.log("✅ Found Faculty document");
        
        // Faculty usually uses plain text in our demo seed
        if (facultyUser.password !== password) { 
             console.log("❌ Faculty Password Mismatch");
             return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: facultyUser._id.toString(), role: "faculty" }, 
          JWT_SECRET, 
          { expiresIn: "7d" }
        );

        const out = facultyUser.toObject();
        delete out.password;
        return res.json({ token, user: { ...out, role: "faculty" } });
      }
    }

    console.log("❌ User not found in Student or Faculty tables");
    return res.status(401).json({ message: "User not found" });

  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 3. ME ROUTE ---
router.get("/me", async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
    
    const token = auth.split(" ")[1];
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = payload?.id;
    const role = payload?.role || "student"; 

    if (!userId) return res.status(401).json({ message: "Invalid token data" });

    let user: any;

    if (role === "faculty") {
      user = await Faculty.findById(userId).lean();
    } else {
      user = await Student.findById(userId).lean();
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    
    delete user.password;
    res.json({ ...user, role }); 

  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;