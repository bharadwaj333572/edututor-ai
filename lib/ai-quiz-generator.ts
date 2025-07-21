import type { Question } from "./types"

interface QuizGenerationRequest {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questionCount: number
}

// Local AI-powered quiz generation using rule-based system with variations
export class LocalAIQuizGenerator {
  private questionTemplates = {
    "Linear Equations": {
      beginner: [
        {
          template: "Solve for x: {a}x + {b} = {c}",
          generateOptions: (a: number, b: number, c: number) => {
            const correct = (c - b) / a
            return [`x = ${correct}`, `x = ${correct + 1}`, `x = ${correct - 1}`, `x = ${correct + 2}`]
          },
          explanation: (a: number, b: number, c: number) => {
            const correct = (c - b) / a
            return `Subtract ${b} from both sides: ${a}x = ${c - b}, then divide by ${a}: x = ${correct}`
          },
        },
      ],
    },
    "Quadratic Equations": {
      beginner: [
        {
          template: "What is the discriminant of {a}x² + {b}x + {c} = 0?",
          generateOptions: (a: number, b: number, c: number) => {
            const discriminant = b * b - 4 * a * c
            return [`${discriminant}`, `${discriminant + 4}`, `${discriminant - 4}`, `${discriminant + 8}`]
          },
          explanation: (a: number, b: number, c: number) => {
            const discriminant = b * b - 4 * a * c
            return `Discriminant = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`
          },
        },
      ],
    },
  }

  async generateQuiz(request: QuizGenerationRequest, studentId?: string): Promise<Question[]> {
    const { topic, difficulty: requestedDifficulty, questionCount } = request

    // Get student's diagnostic result for adaptive generation
    let adaptiveDifficulty = requestedDifficulty
    if (studentId && typeof window !== "undefined") {
      const { StorageService } = await import("./storage")
      const diagnostic = StorageService.getStudentDiagnosticResult(studentId)

      if (diagnostic) {
        // Adjust difficulty based on student's performance in this topic
        const topicScore = diagnostic.topicScores[topic]
        if (topicScore !== undefined) {
          if (topicScore >= 85 && requestedDifficulty === "intermediate") {
            adaptiveDifficulty = "advanced"
          } else if (topicScore < 60 && requestedDifficulty === "intermediate") {
            adaptiveDifficulty = "beginner"
          }
        }
      }
    }

    // Generate questions with adaptive difficulty
    const questions = await this.generateQuestionsWithAI(topic, adaptiveDifficulty, questionCount)

    // For high performers, add bonus complexity
    if (adaptiveDifficulty === "advanced") {
      questions.forEach((q) => {
        q.explanation +=
          " This advanced concept builds on fundamental principles and requires deeper analytical thinking."
      })
    }

    // For struggling students, add encouraging explanations
    if (adaptiveDifficulty === "beginner") {
      questions.forEach((q) => {
        q.explanation = "Let's break this down step by step: " + q.explanation + " Remember, practice makes perfect!"
      })
    }

    return questions
  }

  private async generateQuestionsWithAI(topic: string, difficulty: string, count: number): Promise<Question[]> {
    const questions: Question[] = []

    // Simulate AI generation with intelligent templates
    for (let i = 0; i < count; i++) {
      const question = await this.generateSingleQuestion(topic, difficulty, i)
      questions.push(question)
    }

    return questions
  }

  private async generateSingleQuestion(topic: string, difficulty: string, index: number): Promise<Question> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const questionId = `gen_${Date.now()}_${index}`

    // Topic-specific question generation
    switch (topic) {
      case "Linear Equations":
        return this.generateLinearEquationQuestion(questionId, difficulty)
      case "Quadratic Equations":
        return this.generateQuadraticQuestion(questionId, difficulty)
      case "Kinematics":
        return this.generateKinematicsQuestion(questionId, difficulty)
      case "Cell Biology":
        return this.generateCellBiologyQuestion(questionId, difficulty)
      case "Forces":
        return this.generateForcesQuestion(questionId, difficulty)
      default:
        return this.generateGenericQuestion(questionId, topic, difficulty)
    }
  }

  private generateLinearEquationQuestion(id: string, difficulty: string): Question {
    const a = Math.floor(Math.random() * 5) + 2
    const b = Math.floor(Math.random() * 10) + 1
    const x = Math.floor(Math.random() * 10) + 1
    const c = a * x + b

    return {
      id,
      question: `Solve for x: ${a}x + ${b} = ${c}`,
      options: [`x = ${x}`, `x = ${x + 1}`, `x = ${x - 1}`, `x = ${x + 2}`],
      correctAnswer: 0,
      explanation: `Subtract ${b} from both sides: ${a}x = ${c - b}, then divide by ${a}: x = ${x}`,
      topic: "Linear Equations",
      difficulty: difficulty as any,
    }
  }

  private generateQuadraticQuestion(id: string, difficulty: string): Question {
    const a = Math.floor(Math.random() * 3) + 1
    const b = Math.floor(Math.random() * 6) + 2
    const c = Math.floor(Math.random() * 5) + 1
    const discriminant = b * b - 4 * a * c

    return {
      id,
      question: `What is the discriminant of ${a}x² + ${b}x + ${c} = 0?`,
      options: [`${discriminant}`, `${discriminant + 4}`, `${discriminant - 4}`, `${discriminant + 8}`],
      correctAnswer: 0,
      explanation: `Discriminant = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
      topic: "Quadratic Equations",
      difficulty: difficulty as any,
    }
  }

  private generateKinematicsQuestion(id: string, difficulty: string): Question {
    const distance = Math.floor(Math.random() * 100) + 50
    const time = Math.floor(Math.random() * 5) + 2
    const speed = distance / time

    return {
      id,
      question: `A car travels ${distance} km in ${time} hours. What is its average speed?`,
      options: [`${speed} km/h`, `${speed + 10} km/h`, `${speed - 5} km/h`, `${speed * 2} km/h`],
      correctAnswer: 0,
      explanation: `Speed = Distance ÷ Time = ${distance} km ÷ ${time} h = ${speed} km/h`,
      topic: "Kinematics",
      difficulty: difficulty as any,
    }
  }

  private generateCellBiologyQuestion(id: string, difficulty: string): Question {
    const questions = [
      {
        question: "Which organelle is responsible for protein synthesis?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        correctAnswer: 2,
        explanation: "Ribosomes are the cellular structures responsible for protein synthesis",
      },
      {
        question: "What is the function of the cell membrane?",
        options: ["Energy production", "Protein synthesis", "Controls what enters/exits cell", "Stores DNA"],
        correctAnswer: 2,
        explanation: "The cell membrane controls what substances can enter and exit the cell",
      },
    ]

    const selected = questions[Math.floor(Math.random() * questions.length)]
    return {
      id,
      ...selected,
      topic: "Cell Biology",
      difficulty: difficulty as any,
    }
  }

  private generateForcesQuestion(id: string, difficulty: string): Question {
    const mass = Math.floor(Math.random() * 10) + 5
    const acceleration = Math.floor(Math.random() * 5) + 2
    const force = mass * acceleration

    return {
      id,
      question: `What force is needed to accelerate a ${mass} kg object at ${acceleration} m/s²?`,
      options: [`${force} N`, `${force + 5} N`, `${force - 3} N`, `${force * 2} N`],
      correctAnswer: 0,
      explanation: `Force = mass × acceleration = ${mass} kg × ${acceleration} m/s² = ${force} N`,
      topic: "Forces",
      difficulty: difficulty as any,
    }
  }

  private generateGenericQuestion(id: string, topic: string, difficulty: string): Question {
    return {
      id,
      question: `What is a key concept in ${topic}?`,
      options: [
        `Fundamental principle of ${topic}`,
        `Alternative concept A`,
        `Alternative concept B`,
        `Alternative concept C`,
      ],
      correctAnswer: 0,
      explanation: `This question tests understanding of ${topic} fundamentals`,
      topic,
      difficulty: difficulty as any,
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

export const aiQuizGenerator = new LocalAIQuizGenerator()
