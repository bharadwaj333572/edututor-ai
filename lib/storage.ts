// lib/storage.ts

export interface QuizAttempt {
  id: string
  studentId: string
  courseId: string
  topic: string
  difficulty: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  completedAt: Date
  questions: any[] // Replace 'any' with a more specific type if you have one
}

export interface DiagnosticResult {
  studentId: string
  // Add other properties of DiagnosticResult here
}

// Add more comprehensive mock data for different student profiles
const generateMockHistory = (studentId: string): QuizAttempt[] => {
  const baseAttempts: QuizAttempt[] = [
    // Alice Johnson - High Performer
    ...(studentId === "1"
      ? [
          {
            id: "attempt_1_1",
            studentId: "1",
            courseId: "1",
            topic: "Linear Equations",
            difficulty: "intermediate",
            score: 90,
            totalQuestions: 5,
            correctAnswers: 4,
            timeSpent: 180,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            questions: [],
          },
          {
            id: "attempt_1_2",
            studentId: "1",
            courseId: "1",
            topic: "Quadratic Equations",
            difficulty: "advanced",
            score: 85,
            totalQuestions: 5,
            correctAnswers: 4,
            timeSpent: 240,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            questions: [],
          },
        ]
      : []),

    // Bob Smith - Average Performer
    ...(studentId === "2"
      ? [
          {
            id: "attempt_2_1",
            studentId: "2",
            courseId: "2",
            topic: "Kinematics",
            difficulty: "beginner",
            score: 70,
            totalQuestions: 5,
            correctAnswers: 3,
            timeSpent: 200,
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            questions: [],
          },
          {
            id: "attempt_2_2",
            studentId: "2",
            courseId: "4",
            topic: "Cell Biology",
            difficulty: "intermediate",
            score: 65,
            totalQuestions: 5,
            correctAnswers: 3,
            timeSpent: 220,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            questions: [],
          },
        ]
      : []),

    // Emma Chen - New Student (no history yet)
    ...(studentId === "3" ? [] : []),

    // Marcus Rodriguez - Struggling Student
    ...(studentId === "4"
      ? [
          {
            id: "attempt_4_1",
            studentId: "4",
            courseId: "1",
            topic: "Linear Equations",
            difficulty: "beginner",
            score: 45,
            totalQuestions: 5,
            correctAnswers: 2,
            timeSpent: 280,
            completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            questions: [],
          },
        ]
      : []),
  ]

  return baseAttempts
}

export const mockQuizHistory = {
  "1": generateMockHistory("1"),
  "2": generateMockHistory("2"),
  "3": generateMockHistory("3"),
  "4": generateMockHistory("4"),
}

export const mockDiagnosticResults: { [key: string]: DiagnosticResult } = {
  "1": { studentId: "1" /* Add other properties here */ },
  "2": { studentId: "2" /* Add other properties here */ },
  "3": { studentId: "3" /* Add other properties here */ },
  "4": { studentId: "4" /* Add other properties here */ },
}

export class StorageService {
  private static DIAGNOSTIC_RESULTS_KEY = "diagnosticResults"
  private static QUIZ_ATTEMPTS_KEY = "quizAttempts"

  private static getQuizAttempts(): QuizAttempt[] {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(this.QUIZ_ATTEMPTS_KEY)
      return data ? JSON.parse(data) : []
    }
    return []
  }

  static getStudentDiagnosticResult(studentId: string): DiagnosticResult | null {
    // First check localStorage
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(this.DIAGNOSTIC_RESULTS_KEY)
      const results = data ? JSON.parse(data) : []
      const stored = results.find((r: DiagnosticResult) => r.studentId === studentId)
      if (stored) return stored
    }

    // Fall back to mock data for demo accounts
    return mockDiagnosticResults[studentId] || null
  }

  static getStudentQuizAttempts(studentId: string): QuizAttempt[] {
    // Get from localStorage first
    const stored = this.getQuizAttempts().filter((attempt) => attempt.studentId === studentId)

    // Add mock history for demo accounts
    const mockAttempts = mockQuizHistory[studentId] || []

    return [...stored, ...mockAttempts]
  }

  /**
   * Return every DiagnosticResult available for the educator dashboard.
   * Combines locally-stored diagnostics (created during runtime) with the
   * predefined mockDiagnosticResults used for demo accounts.
   */
  static getDiagnosticResults(): DiagnosticResult[] {
    let storedResults: DiagnosticResult[] = []

    // Attempt to load results saved in the browser
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(this.DIAGNOSTIC_RESULTS_KEY)
      storedResults = data ? JSON.parse(data) : []
    }

    // Merge with mock results, giving precedence to any stored versions
    const merged = [
      ...storedResults,
      ...Object.values(mockDiagnosticResults).filter(
        (mock) => !storedResults.some((r) => r.studentId === mock.studentId),
      ),
    ]

    return merged
  }
}
