import { useState, useEffect } from "react"; // useEffect add pannirukken
import { Layout } from "@/components/Layout";
import {
  Users,
  PlusCircle,
  Search,
  GraduationCap,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Use Vite env
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:4000";

interface FacultyPortalProps {
  faculty: any;
  onLogout: () => void;
}

const FacultyPortal = ({ faculty, onLogout }: FacultyPortalProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "exams">("overview");
  
  // States for Real Data
  const [students, setStudents] = useState<any[]>([]); // Empty array initially
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Exam Form States
  const [examTitle, setExamTitle] = useState("");
  const [examMarks, setExamMarks] = useState("");
  const [examYear, setExamYear] = useState("IV");
  const [loadingExam, setLoadingExam] = useState(false);

  // --- NEW: Fetch Students from Backend ---
  useEffect(() => {
    // Only fetch when "students" tab is active
    if (activeTab === "students") {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`${API_BASE}/api/students`); // Namma create panna puthu route
      if (res.ok) {
        const data = await res.json();
        setStudents(data); // Update state with DB records
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Network error", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle Create Exam
  const handleCreateExam = async () => {
    if (!examTitle || !examMarks) return alert("Please fill all details");

    setLoadingExam(true);
    try {
      const payload = {
        title: examTitle,
        totalMarks: Number(examMarks),
        department: faculty.department,
        forYear: examYear,
        createdBy: faculty.employeeId,
      };

      const res = await fetch(`${API_BASE}/api/assessments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`✅ Exam "${examTitle}" created successfully!`);
        setExamTitle("");
        setExamMarks("");
      } else {
        alert("❌ Failed to create exam.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    } finally {
      setLoadingExam(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          {/* HEADER */}
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                Welcome, {faculty.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {faculty.designation} | {faculty.department} Department
              </p>
              <p className="text-xs text-muted-foreground">ID: {faculty.employeeId}</p>
            </div>
            <Button variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Dashboard", icon: <Users className="w-4 h-4" /> },
              { id: "students", label: "My Students", icon: <Search className="w-4 h-4" /> },
              { id: "exams", label: "Exam Center", icon: <PlusCircle className="w-4 h-4" /> },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>

          {/* --- CONTENT --- */}

          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Students Handled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                     {/* Show dynamic count if available, else static for now */}
                     {students.length > 0 ? students.length : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Updated just now</p>
                </CardContent>
              </Card>
              {/* Other cards remain same... */}
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Subjects Assigned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{faculty.subjectsHandled?.length || 0}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {faculty.subjectsHandled?.map((sub: string, i: number) => (
                      <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {sub}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                    <ClipboardList className="w-3 h-3" /> Pending tasks
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 2. STUDENTS LIST (REAL DATA) */}
          {activeTab === "students" && (
            <Card>
              <CardHeader>
                <CardTitle>Class List</CardTitle>
                <div className="flex gap-2 pt-2">
                  <Input placeholder="Search students..." className="max-w-sm" />
                  <Button variant="outline">Search</Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingStudents ? (
                  <p className="text-muted-foreground text-sm">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No students found in database.</p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {students.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {s.name ? s.name.charAt(0) : "S"}
                          </div>
                          <div>
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {/* Display Roll Number safely */}
                              {s.rollNumber || s.rollNo} | {s.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <span className={`px-2 py-1 rounded text-xs ${Number(s.cgpa) >= 8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             CGPA: {s.cgpa}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 3. EXAM CENTER */}
          {activeTab === "exams" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-primary" />
                    Create New Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exam Title</label>
                    <Input
                      placeholder="e.g., Internal Assessment 1"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Marks</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={examMarks}
                      onChange={(e) => setExamMarks(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign To (Year)</label>
                    <select 
                      className="w-full p-2 rounded-md border bg-background"
                      value={examYear}
                      onChange={(e) => setExamYear(e.target.value)}
                    >
                      <option value="IV">Year IV</option>
                      <option value="III">Year III</option>
                      <option value="II">Year II</option>
                      <option value="I">Year I</option>
                    </select>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleCreateExam}
                    disabled={loadingExam}
                  >
                    {loadingExam ? "Publishing..." : "Publish Exam"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">System Ready</p>
                        <p className="text-xs text-muted-foreground">You can create exams now.</p>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FacultyPortal;