import { Router, Request, Response } from "express";
import { Assessment } from "../models/Assessment";

const router = Router();

// --- SMART QUESTION BANK (Expanded for Engineering) ---
const QUESTION_BANK: any = {
  dsa: [
    { q: "What is the time complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: 1 },
    { q: "Which data structure is LIFO?", options: ["Queue", "Stack", "Array", "Tree"], answer: 1 },
    { q: "Worst case complexity of QuickSort?", options: ["O(n log n)", "O(n^2)", "O(n)", "O(1)"], answer: 1 },
    { q: "Best DS for recursion?", options: ["Stack", "Queue", "List", "Graph"], answer: 0 },
    { q: "BFS uses which data structure?", options: ["Stack", "Queue", "Heap", "Tree"], answer: 1 },
    { q: "Which is a Linear Data Structure?", options: ["Tree", "Graph", "Array", "BST"], answer: 2 },
    { q: "Searching in Hashing takes?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: 2 },
    { q: "Full form of BST?", options: ["Basic Search Tree", "Binary Search Tree", "Best Sort Tree", "None"], answer: 1 },
    { q: "How to detect cycle in Linked List?", options: ["Two Pointers", "Merge Sort", "Binary Search", "DFS"], answer: 0 },
    { q: "Elements in Array are stored in?", options: ["Random memory", "Sequential memory", "Linked memory", "None"], answer: 1 },
  ],
  os: [
    { q: "Core of Linux is?", options: ["Shell", "Kernel", "Terminal", "Command"], answer: 1 },
    { q: "What is a Deadlock?", options: ["Process success", "System Halt", "Process Waiting Indefinitely", "None"], answer: 2 },
    { q: "FIFO is a?", options: ["Scheduling Algo", "Memory Block", "File System", "None"], answer: 0 },
    { q: "Virtual Memory is?", options: ["RAM", "Illusion of large memory", "Hard Disk", "Cache"], answer: 1 },
    { q: "Smallest unit of storage?", options: ["Bit", "Byte", "File", "Folder"], answer: 0 },
    { q: "Which is not an OS?", options: ["Windows", "Linux", "Oracle", "Android"], answer: 2 },
    { q: "Context switching happens in?", options: ["User mode", "Kernel mode", "Disk", "Monitor"], answer: 1 },
    { q: "Semaphore is used for?", options: ["Synchronization", "Deadlock", "Scheduling", "Paging"], answer: 0 },
    { q: "Page fault occurs when?", options: ["Page present", "Page not in RAM", "Page corrupted", "None"], answer: 1 },
    { q: "Round Robin is used in?", options: ["Time Sharing", "Batch Processing", "Real time", "None"], answer: 0 },
  ],
  dbms: [
    { q: "What does SQL stand for?", options: ["Structured Question List", "Structured Query Language", "Simple Query Language", "None"], answer: 1 },
    { q: "Which is a DDL command?", options: ["SELECT", "INSERT", "CREATE", "UPDATE"], answer: 2 },
    { q: "Columns in a table are called?", options: ["Rows", "Tuples", "Attributes", "Degree"], answer: 2 },
    { q: "Primary Key must be?", options: ["Unique & Not Null", "Unique & Null", "Duplicate", "None"], answer: 0 },
    { q: "Which Normal Form removes Transitive Dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 2 },
    { q: "ACID properties stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Atomicity, Class, ID, Data", "All, Clear, In, Done", "None"], answer: 0 },
    { q: "Example of NoSQL DB?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], answer: 2 },
    { q: "Foreign Key creates relationship between?", options: ["Two Tables", "Two Rows", "Two Databases", "None"], answer: 0 },
    { q: "What is a View?", options: ["Real Table", "Virtual Table", "Index", "Graph"], answer: 1 },
    { q: "Command to remove table completely?", options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"], answer: 2 },
  ],
  cn: [
    { q: "How many layers in OSI Model?", options: ["5", "6", "7", "4"], answer: 2 },
    { q: "IP address is?", options: ["Mac Address", "Logical Address", "Physical Address", "None"], answer: 1 },
    { q: "HTTP runs on port?", options: ["21", "25", "80", "443"], answer: 2 },
    { q: "Protocol for sending email?", options: ["HTTP", "FTP", "SMTP", "POP3"], answer: 2 },
    { q: "Which layer provides End-to-End delivery?", options: ["Network", "Transport", "Data Link", "Session"], answer: 1 },
    { q: "IPv4 address size is?", options: ["32 bit", "64 bit", "128 bit", "16 bit"], answer: 0 },
    { q: "Which topology uses a central hub?", options: ["Bus", "Ring", "Star", "Mesh"], answer: 2 },
    { q: "Ping uses which protocol?", options: ["TCP", "UDP", "ICMP", "ARP"], answer: 2 },
    { q: "DNS translates?", options: ["IP to MAC", "Domain name to IP", "File to Binary", "None"], answer: 1 },
    { q: "Secure version of HTTP?", options: ["HTTPs", "S-HTTP", "SSH", "SSL"], answer: 0 },
  ],
  oops: [
    { q: "Which is not an OOP concept?", options: ["Polymorphism", "Encapsulation", "Inheritance", "Compilation"], answer: 3 },
    { q: "Wrapping data and methods together?", options: ["Abstraction", "Encapsulation", "Polymorphism", "Inheritance"], answer: 1 },
    { q: "Function Overloading is?", options: ["Runtime Polymorphism", "Compile time Polymorphism", "Inheritance", "None"], answer: 1 },
    { q: "Private members are accessible?", options: ["Everywhere", "Within Class", "Within Package", "Subclass"], answer: 1 },
    { q: "Constructor name is same as?", options: ["Object", "Method", "Class", "Package"], answer: 2 },
    { q: "Which keyword creates an object?", options: ["class", "new", "this", "create"], answer: 1 },
    { q: "Inheritance represents?", options: ["HAS-A", "IS-A", "USES-A", "None"], answer: 1 },
    { q: "Multiple inheritance is supported in Java via?", options: ["Classes", "Interfaces", "Packages", "Methods"], answer: 1 },
    { q: "Static method belongs to?", options: ["Object", "Class", "Method", "Thread"], answer: 1 },
    { q: "super() keyword calls?", options: ["Current Constructor", "Parent Constructor", "Static Method", "None"], answer: 1 },
  ],
  web: [
    { q: "React is a?", options: ["Framework", "Library", "Language", "Database"], answer: 1 },
    { q: "HTML tag for largest heading?", options: ["<h6>", "<head>", "<h1>", "<header>"], answer: 2 },
    { q: "Which is used for styling?", options: ["HTML", "CSS", "JS", "XML"], answer: 1 },
    { q: "DOM stands for?", options: ["Data Object Model", "Document Object Model", "Disk OS Model", "None"], answer: 1 },
    { q: "Hook to manage state in React?", options: ["useEffect", "useState", "useRef", "useContext"], answer: 1 },
    { q: "MERN stack 'M' stands for?", options: ["MySQL", "MariaDB", "MongoDB", "Mongoose"], answer: 2 },
    { q: "Default port for React?", options: ["3000", "8080", "5000", "4200"], answer: 0 },
    { q: "Which method sends data to server?", options: ["GET", "POST", "DELETE", "HEAD"], answer: 1 },
    { q: "Tag to link JS file?", options: ["<link>", "<script>", "<js>", "<href>"], answer: 1 },
    { q: "JSX stands for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON Xylophone", "None"], answer: 0 },
  ],
  maths: [ 
    { q: "A set with no elements is?", options: ["Null Set", "Singleton", "Finite", "Infinite"], answer: 0 },
    { q: "Power set of {1,2} has how many elements?", options: ["2", "3", "4", "5"], answer: 2 },
    { q: "Logic gate for multiplication?", options: ["OR", "AND", "NOT", "XOR"], answer: 1 },
    { q: "Which is a tautology?", options: ["p OR ~p", "p AND ~p", "p -> q", "None"], answer: 0 },
    { q: "Graph with no cycles?", options: ["Tree", "Cyclic", "Complete", "Bipartite"], answer: 0 },
    { q: "Degree of a vertex is?", options: ["Edges connected", "Vertices connected", "Loops", "None"], answer: 0 },
    { q: "Walk with no repeated edges?", options: ["Path", "Trail", "Circuit", "Cycle"], answer: 1 },
    { q: "Number of edges in Complete Graph K3?", options: ["2", "3", "4", "1"], answer: 1 },
    { q: "p -> q is false when?", options: ["p=T, q=F", "p=T, q=T", "p=F, q=T", "p=F, q=F"], answer: 0 },
    { q: "Set of Integers is?", options: ["Finite", "Countable Infinite", "Uncountable", "None"], answer: 1 },
  ],
  default: [
    { q: "Engineering is applied?", options: ["Science", "Maths", "History", "Arts"], answer: 0 },
    { q: "CPU stands for?", options: ["Central Process Unit", "Control Process Unit", "Central Processing Unit", "None"], answer: 2 },
    { q: "RAM is?", options: ["Volatile", "Non-Volatile", "Permanent", "Slow"], answer: 0 },
    { q: "Binary for 5 is?", options: ["100", "101", "110", "111"], answer: 1 },
    { q: "1 Byte = ?", options: ["4 bits", "8 bits", "16 bits", "32 bits"], answer: 1 },
  ]
};

// 1. Create a New Assessment (Smart Generate)
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, department, forYear, totalMarks, createdBy } = req.body;
    
    // AI Logic: Detect Subject from Title
    let selectedQuestions = QUESTION_BANK.default;
    const t = title.toLowerCase();

    // Check keywords to select question bank
    if (t.includes("dsa") || t.includes("algo") || t.includes("structure")) selectedQuestions = QUESTION_BANK.dsa;
    else if (t.includes("os") || t.includes("operating")) selectedQuestions = QUESTION_BANK.os;
    else if (t.includes("dbms") || t.includes("data base") || t.includes("sql")) selectedQuestions = QUESTION_BANK.dbms;
    else if (t.includes("cn") || t.includes("network")) selectedQuestions = QUESTION_BANK.cn;
    else if (t.includes("java") || t.includes("oop") || t.includes("c++")) selectedQuestions = QUESTION_BANK.oops;
    else if (t.includes("web") || t.includes("react") || t.includes("js") || t.includes("html")) selectedQuestions = QUESTION_BANK.web;
    else if (t.includes("math") || t.includes("discrete")) selectedQuestions = QUESTION_BANK.maths;

    const newAssessment = await Assessment.create({
      title,
      department,
      forYear,
      totalMarks,
      createdBy,
      questions: selectedQuestions // Automatically inserts 10 relevant questions
    });

    res.status(201).json(newAssessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating exam" });
  }
});

// 2. Get Assessments for Student
router.get("/student", async (req: Request, res: Response) => {
  try {
    const { dept, year } = req.query;
    // Return all exams for the department (Simpler for demo)
    const exams = await Assessment.find({ department: dept });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching exams" });
  }
});

export default router;