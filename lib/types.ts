export interface User {
  id: string
  name: string
  email: string
  role: "student" | "educator"
  avatar?: string
}

export interface Course {
  id: string
  name: string
  subject: string
  description: string
  topics: string[]
  enrolledStudents?: number
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export interface Quiz {
  id: string
  courseId: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questions: Question[]
  timeLimit: number
  createdAt: Date
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  answers: { [questionId: string]: number }
  score: number
  completedAt: Date
  timeSpent: number
}

export interface DiagnosticResult {
  studentId: string
  overallScore: number
  topicScores: { [topic: string]: number }
  recommendedDifficulty: "beginner" | "intermediate" | "advanced"
  weakAreas: string[]
  strongAreas: string[]
  completedAt: Date
}
