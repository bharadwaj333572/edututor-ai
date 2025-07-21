import type { Course, User, Question } from "./types"

/* ---------- DEMO USERS ---------- */
export const mockUsers: User[] = [
  /* Student Demo Accounts */
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@student.edu",
    role: "student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@student.edu",
    role: "student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Emma Chen",
    email: "emma@student.edu",
    role: "student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Marcus Rodriguez",
    email: "marcus@student.edu",
    role: "student",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  /* Educator Demo Accounts */
  {
    id: "5",
    name: "Dr. Sarah Wilson",
    email: "sarah@teacher.edu",
    role: "educator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Prof. Michael Davis",
    email: "michael@teacher.edu",
    role: "educator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Dr. Lisa Thompson",
    email: "lisa@teacher.edu",
    role: "educator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

/* ---------- COURSE DATA ---------- */
export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Algebra Fundamentals",
    subject: "Mathematics",
    description: "Master the basics of algebraic expressions and equations",
    topics: ["Linear Equations", "Quadratic Equations", "Polynomials", "Factoring", "Graphing"],
    enrolledStudents: 28,
  },
  {
    id: "2",
    name: "Physics Mechanics",
    subject: "Physics",
    description: "Explore motion, forces, and energy in classical mechanics",
    topics: ["Kinematics", "Forces", "Energy", "Momentum", "Circular Motion"],
    enrolledStudents: 24,
  },
  {
    id: "3",
    name: "World History",
    subject: "History",
    description: "Journey through major historical events and civilizations",
    topics: ["Ancient Civilizations", "Medieval Period", "Renaissance", "Industrial Revolution", "Modern Era"],
    enrolledStudents: 32,
  },
  {
    id: "4",
    name: "Biology Basics",
    subject: "Biology",
    description: "Understanding life processes and biological systems",
    topics: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Human Biology"],
    enrolledStudents: 26,
  },
  {
    id: "5",
    name: "Geometry Essentials",
    subject: "Mathematics",
    description: "Explore shapes, angles, and spatial relationships",
    topics: ["Basic Shapes", "Angles", "Triangles", "Circles", "Area and Volume"],
    enrolledStudents: 22,
  },
]

/* ---------- QUESTION BANK ---------- */
export const questionBank: { [topic: string]: { [difficulty: string]: Question[] } } = {
  "Linear Equations": {
    beginner: [
      {
        id: "1",
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 6", "x = 8", "x = 9"],
        correctAnswer: 0,
        explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
        topic: "Linear Equations",
        difficulty: "beginner",
      },
      {
        id: "2",
        question: "What is the slope of the line y = 3x + 2?",
        options: ["2", "3", "5", "1"],
        correctAnswer: 1,
        explanation: "In the form y = mx + b, the coefficient of x (3) is the slope",
        topic: "Linear Equations",
        difficulty: "beginner",
      },
    ],
    intermediate: [
      {
        id: "3",
        question: "Solve the system: 2x + y = 7,  x − y = 2",
        options: ["x = 3, y = 1", "x = 2, y = 3", "x = 1, y = 5", "x = 4, y = −1"],
        correctAnswer: 0,
        explanation: "Add equations: 3x = 9, so x = 3. Substitute: 2(3) + y = 7 → y = 1",
        topic: "Linear Equations",
        difficulty: "intermediate",
      },
    ],
  },

  Kinematics: {
    beginner: [
      {
        id: "4",
        question: "A car travels 60 km in 2 hours. What is its average speed?",
        options: ["30 km/h", "60 km/h", "120 km/h", "15 km/h"],
        correctAnswer: 0,
        explanation: "Speed = Distance ÷ Time = 60 km ÷ 2 h = 30 km/h",
        topic: "Kinematics",
        difficulty: "beginner",
      },
    ],
  },

  "Cell Biology": {
    beginner: [
      {
        id: "5",
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
        correctAnswer: 1,
        explanation: "Mitochondria produce ATP, the energy currency of cells",
        topic: "Cell Biology",
        difficulty: "beginner",
      },
    ],
  },

  "Ancient Civilizations": {
    beginner: [
      {
        id: "6",
        question: "Which river was crucial to ancient Egyptian civilization?",
        options: ["Tigris", "Euphrates", "Nile", "Indus"],
        correctAnswer: 2,
        explanation: "The Nile River provided water, fertile soil, and transportation for ancient Egypt",
        topic: "Ancient Civilizations",
        difficulty: "beginner",
      },
    ],
  },
}

/* ---------- DIAGNOSTIC STRUCTURES ---------- */
export interface DiagnosticResult {
  studentId: string
  overallScore: number
  topicScores: { [topic: string]: number }
  recommendedDifficulty: "beginner" | "intermediate" | "advanced"
  strongAreas: string[]
  weakAreas: string[]
  completedAt: Date
}

export const mockDiagnosticResults: { [studentId: string]: DiagnosticResult } = {
  /* Alice Johnson — High Performer */
  "1": {
    studentId: "1",
    overallScore: 92,
    topicScores: {
      "Linear Equations": 95,
      "Quadratic Equations": 90,
      Geometry: 88,
      Statistics: 95,
      Trigonometry: 92,
    },
    recommendedDifficulty: "advanced",
    strongAreas: ["Linear Equations", "Statistics", "Trigonometry"],
    weakAreas: ["Geometry"],
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },

  /* Marcus Rodriguez — Struggling Student */
  "4": {
    studentId: "4",
    overallScore: 45,
    topicScores: {
      "Linear Equations": 40,
      "Quadratic Equations": 30,
      Geometry: 55,
      Statistics: 50,
      Trigonometry: 35,
    },
    recommendedDifficulty: "beginner",
    strongAreas: ["Geometry"],
    weakAreas: ["Quadratic Equations", "Trigonometry", "Linear Equations"],
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
}

/* ---------- CROSS-TOPIC DIAGNOSTIC QUESTIONS ---------- */
export const diagnosticQuestions: Question[] = [
  {
    id: "d1",
    question: "Solve 3x − 7 = 14",
    options: ["x = 7", "x = 5", "x = 21", "x = 3"],
    correctAnswer: 0,
    explanation: "Add 7 to both sides: 3x = 21 → divide by 3: x = 7",
    topic: "Linear Equations",
    difficulty: "beginner",
  },
  {
    id: "d2",
    question: "What is the area of a rectangle with length 8 and width 5?",
    options: ["13", "26", "40", "35"],
    correctAnswer: 2,
    explanation: "Area = length × width = 8 × 5 = 40",
    topic: "Basic Shapes",
    difficulty: "beginner",
  },
  {
    id: "d3",
    question: "Which organelle controls cell activities?",
    options: ["Mitochondria", "Nucleus", "Ribosome", "Vacuole"],
    correctAnswer: 1,
    explanation: "The nucleus contains DNA and directs cell activities",
    topic: "Cell Biology",
    difficulty: "beginner",
  },
  {
    id: "d4",
    question: "What force keeps planets in orbit around the Sun?",
    options: ["Magnetic force", "Electric force", "Gravitational force", "Nuclear force"],
    correctAnswer: 2,
    explanation: "Gravitational attraction between the Sun and planets provides centripetal force",
    topic: "Forces",
    difficulty: "beginner",
  },
  {
    id: "d5",
    question: "The Renaissance began in which country?",
    options: ["France", "England", "Italy", "Spain"],
    correctAnswer: 2,
    explanation: "The Renaissance began in Italy in the 14th century",
    topic: "Renaissance",
    difficulty: "beginner",
  },
]
