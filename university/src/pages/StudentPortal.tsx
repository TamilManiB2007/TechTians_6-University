import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion"; // <--- ANIMATION LIBRARY
import {
  User,
  Lock,
  Trophy,
  Youtube,
  Code,
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FacultyPortal from "./FacultyPortal"; 

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:4000";

// --- AI RESOURCES (Your Logic) ---
const RESOURCE_DB: any = {
  dsa: {
    videos: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    practice: "https://leetcode.com/problemset/all/",
    platform: "LeetCode",
    tips: "Focus on Arrays, Linked Lists and Recursion first."
  },
  os: {
    videos: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O",
    practice: "https://www.geeksforgeeks.org/operating-systems/",
    platform: "GeeksForGeeks",
    tips: "Understand Scheduling algorithms and Deadlock thoroughly."
  },
  dbms: {
    videos: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2C",
    practice: "https://sqlzoo.net/wiki/SQL_Tutorial",
    platform: "SQLZoo",
    tips: "Master SQL Joins and Normalization concepts."
  },
  cn: {
    videos: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78n8qMbjpHn_",
    practice: "https://www.sanfoundry.com/computer-networks-questions-answers-exams-class-tests/",
    platform: "Sanfoundry",
    tips: "Memorize OSI Layers and IP Subnetting."
  },
  oops: {
    videos: "https://www.youtube.com/playlist?list=PLS1QulWo1RIbfTjQvTdj8Y6yyq4R7g-Al",
    practice: "https://www.hackerrank.com/domains/java",
    platform: "HackerRank",
    tips: "Clear concepts of Polymorphism and Inheritance."
  },
  web: {
    videos: "https://www.youtube.com/playlist?list=PLu0W_9lII9agx66oZnT6IyhcMIbUMNMdt",
    practice: "https://www.freecodecamp.org/learn/front-end-development-libraries/",
    platform: "FreeCodeCamp",
    tips: "Build small projects to understand Components and Hooks."
  },
  maths: {
    videos: "https://www.youtube.com/playlist?list=PLU6SqdYcYsfJ27695Gr6yOprq1Yq586C_",
    practice: "https://www.javatpoint.com/discrete-mathematics-tutorial",
    platform: "JavaTPoint",
    tips: "Practice Graph Theory and Logic problems."
  },
  default: {
    videos: "https://www.youtube.com/results?search_query=engineering+basics",
    practice: "https://www.indiabix.com/",
    platform: "IndiaBix",
    tips: "Review the core concepts again."
  }
};

const StudentPortal = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("tt6_token"));
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [realExams, setRealExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "quizzes" | "assessments" | "competitions">("overview");
  const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  const [quizResult, setQuizResult] = useState<any | null>(null); 

  // --- FETCH PROFILE ---
  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setStudent(data);
    } catch {
      localStorage.removeItem("tt6_token");
      setToken(null);
      setStudent(null);
    }
  };

  useEffect(() => {
    if (token && !student) fetchProfile(token);
  }, [token]);

  // --- FETCH REAL EXAMS ---
  useEffect(() => {
    if (activeTab === "quizzes" && student) {
      fetchRealExams();
    }
  }, [activeTab, student]);

  const fetchRealExams = async () => {
    setLoadingExams(true);
    try {
      const dept = "CSE"; 
      const year = "IV";  
      const res = await fetch(`${API_BASE}/api/assessments/student?dept=${dept}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setRealExams(data);
      }
    } catch (err) {
      console.error("Failed to fetch exams");
    } finally {
      setLoadingExams(false);
    }
  };

  // --- LOGIN ---
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });
      if (!res.ok) {
        alert("Login failed!");
        setLoading(false);
        return;
      }
      const { token: t } = await res.json();
      localStorage.setItem("tt6_token", t);
      setToken(t);
      await fetchProfile(t);
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tt6_token");
    setToken(null);
    setStudent(null);
    setRollNumber("");
    setPassword("");
  };

  // --- QUIZ LOGIC + DB SAVE ---
  const startQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
    setAnswers({});
    setQuizResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitQuiz = async () => {
    if (!currentQuiz) return;
    let correct = 0;
    currentQuiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.answer) correct++;
    });
    
    const percentage = Math.round((correct / currentQuiz.questions.length) * 100);
    const score = Math.round((correct / currentQuiz.questions.length) * currentQuiz.totalMarks);

    // AI Logic
    let feedback = null;
    if (percentage < 60) {
      const t = currentQuiz.title.toLowerCase();
      let subjectKey = "default";
      if (t.includes("dsa")) subjectKey = "dsa";
      else if (t.includes("os")) subjectKey = "os";
      else if (t.includes("dbms") || t.includes("sql")) subjectKey = "dbms";
      else if (t.includes("cn")) subjectKey = "cn";
      else if (t.includes("java") || t.includes("oop")) subjectKey = "oops";
      else if (t.includes("web")) subjectKey = "web";
      else if (t.includes("math")) subjectKey = "maths";

      feedback = RESOURCE_DB[subjectKey];
    }

    // --- SAVE TO DATABASE ---
    if (student && student._id) {
        try {
            await fetch(`${API_BASE}/api/students/submit-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: student._id,
                    title: currentQuiz.title,
                    score,
                    totalMarks: currentQuiz.totalMarks
                })
            });
            // Reload profile to update "Assessments" tab
            fetchProfile(token!);
        } catch(err) {
            console.error("Failed to save score");
        }
    }

    setQuizResult({
      score,
      total: currentQuiz.totalMarks,
      percentage,
      feedback 
    });
  };

  // --- RENDER ---
  if (!token || !student) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">University Portal</CardTitle>
                <p className="text-muted-foreground">Student Login</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Roll Number (TT21CS001)" className="pl-10" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button className="w-full btn-university" onClick={handleLogin} disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (student.role === "faculty") {
    return <FacultyPortal faculty={student} onLogout={handleLogout} />;
  }

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold">Welcome, {student.name}</h1>
              <p className="text-muted-foreground">{student.rollNumber} | {student.department}</p>
            </div>
            <Button onClick={handleLogout}>Logout</Button>
          </motion.div>

          <div className="flex gap-2 mb-6">
            {["overview", "quizzes", "competitions"].map((t) => (
              <Button key={t} variant={activeTab === t ? "default" : "outline"} onClick={() => setActiveTab(t as any)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="bg-accent/10">
                <CardHeader><CardTitle>CGPA</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-primary">{student.cgpa || "8.5"}</div></CardContent>
              </Card>
              <Card className="bg-accent/10">
                <CardHeader><CardTitle>Attendance</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-primary">{student.attendance || "92"}%</div></CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              {activeTab === "overview" && (
                <Card>
                  <CardHeader><CardTitle>My Subjects</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {student.subjects?.map((s: any, i: number) => (
                      <div key={i} className="flex justify-between p-3 border rounded">
                        <span>{s.name}</span>
                        <span className="font-bold text-primary">{s.grade}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {activeTab === "quizzes" && (
                <Card>
                  <CardHeader><CardTitle>Exam Center</CardTitle></CardHeader>
                  <CardContent>
                    {currentQuiz ? (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold">{currentQuiz.title}</h3>
                        {!quizResult ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {currentQuiz.questions.map((q: any, i: number) => (
                              <div key={i} className="p-4 bg-muted rounded-lg mb-4">
                                <p className="font-medium mb-2">{i + 1}. {q.q}</p>
                                <div className="space-y-2">
                                  {q.options.map((opt: string, idx: number) => (
                                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`q-${i}`} 
                                        checked={answers[i] === idx} 
                                        onChange={() => setAnswers({...answers, [i]: idx})}
                                      />
                                      {opt}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setCurrentQuiz(null)}>Cancel</Button>
                              <Button onClick={submitQuiz}>Submit Answers</Button>
                            </div>
                          </motion.div>
                        ) : (
                          // --- AI RESULT CARD (ANIMATED) ---
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="animate-in fade-in zoom-in duration-300"
                          >
                            <div className={`p-6 rounded-lg text-center ${quizResult.percentage >= 60 ? "bg-green-100 text-green-900" : "bg-red-50 text-red-900"}`}>
                              <h2 className="text-2xl font-bold mb-2">Score: {quizResult.score} / {quizResult.total}</h2>
                              <p className="text-lg">{quizResult.percentage >= 60 ? "🎉 Excellent Work! Keep it up." : "⚠️ You need improvement."}</p>
                            </div>

                            {/* Show AI Recommendations if Score is Low */}
                            {quizResult.feedback && (
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 border-t pt-4"
                              >
                                <h4 className="text-lg font-bold flex items-center gap-2 mb-3">
                                  <AlertCircle className="text-blue-600" />
                                  AI Study Recommendations
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <a href={quizResult.feedback.videos} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 border rounded hover:bg-accent/10 transition">
                                    <Youtube className="text-red-600 h-8 w-8" />
                                    <div>
                                      <div className="font-bold">Watch Video Lectures</div>
                                      <div className="text-xs text-muted-foreground">Click to watch expert tutorials</div>
                                    </div>
                                  </a>
                                  <a href={quizResult.feedback.practice} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 border rounded hover:bg-accent/10 transition">
                                    <Code className="text-green-600 h-8 w-8" />
                                    <div>
                                      <div className="font-bold">Practice on {quizResult.feedback.platform}</div>
                                      <div className="text-xs text-muted-foreground">Solve problems to improve</div>
                                    </div>
                                  </a>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm flex items-center gap-2">
                                  <BookOpen className="h-4 w-4"/>
                                  <strong>Tip:</strong> {quizResult.feedback.tips}
                                </div>
                              </motion.div>
                            )}

                            <Button className="mt-6 w-full" onClick={() => setCurrentQuiz(null)}>Back to Exams</Button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {loadingExams ? <p>Loading exams...</p> : realExams.length === 0 ? <p>No active exams found.</p> : (
                          realExams.map((exam) => (
                            <motion.div 
                              key={exam._id} 
                              whileHover={{ scale: 1.02 }}
                              className="flex justify-between items-center p-4 border rounded hover:bg-accent/5 transition-all"
                            >
                              <div>
                                <h4 className="font-bold">{exam.title}</h4>
                                <p className="text-sm text-muted-foreground">{exam.questions.length} Questions • {exam.totalMarks} Marks</p>
                              </div>
                              <Button onClick={() => startQuiz(exam)}>Start Exam</Button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* COMPETITIONS TAB */}
              {activeTab === "competitions" && (
                <Card>
                  <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center p-3 border rounded mb-2">
                        <div>
                          <div className="font-bold">Google Code Jam</div>
                          <div className="text-xs">Upcoming</div>
                        </div>
                        <Button variant="secondary" size="sm"><Trophy className="w-4 h-4 mr-1"/> Join</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentPortal;