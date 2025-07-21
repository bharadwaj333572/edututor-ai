interface QuizConfig {
  subject: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questionCount: number
  questionTypes: string[]
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  topic: string
  questionType: string
}

// Question templates organized by subject and topic
const questionTemplates = {
  Mathematics: {
    Algebra: {
      beginner: [
        {
          question: "What is the value of x in the equation: 2x + 5 = 13?",
          options: ["x = 4", "x = 6", "x = 8", "x = 9"],
          correctAnswer: 0,
          explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
        },
        {
          question: "Simplify: 3x + 2x",
          options: ["5x", "6x", "5x²", "6x²"],
          correctAnswer: 0,
          explanation: "When adding like terms, add the coefficients: 3x + 2x = (3 + 2)x = 5x",
        },
      ],
      intermediate: [
        {
          question: "Factor the expression: x² + 5x + 6",
          options: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x - 2)(x - 3)", "(x + 4)(x + 2)"],
          correctAnswer: 0,
          explanation:
            "To factor x² + 5x + 6, find two numbers that multiply to 6 and add to 5: 2 and 3. So x² + 5x + 6 = (x + 2)(x + 3)",
        },
      ],
      advanced: [
        {
          question: "Solve the quadratic equation: x² - 4x - 5 = 0",
          options: ["x = 5, x = -1", "x = 4, x = 1", "x = -5, x = 1", "x = 5, x = 1"],
          correctAnswer: 0,
          explanation: "Using factoring: x² - 4x - 5 = (x - 5)(x + 1) = 0, so x = 5 or x = -1",
        },
      ],
    },
    Geometry: {
      beginner: [
        {
          question: "What is the area of a rectangle with length 8 and width 5?",
          options: ["40", "26", "13", "35"],
          correctAnswer: 0,
          explanation: "Area of rectangle = length × width = 8 × 5 = 40 square units",
        },
      ],
      intermediate: [
        {
          question: "What is the circumference of a circle with radius 7? (Use π ≈ 3.14)",
          options: ["43.96", "21.98", "153.86", "49"],
          correctAnswer: 0,
          explanation: "Circumference = 2πr = 2 × 3.14 × 7 = 43.96",
        },
      ],
      advanced: [
        {
          question: "In a right triangle, if one leg is 3 and the hypotenuse is 5, what is the other leg?",
          options: ["4", "8", "2", "6"],
          correctAnswer: 0,
          explanation: "Using Pythagorean theorem: a² + b² = c², so 3² + b² = 5², 9 + b² = 25, b² = 16, b = 4",
        },
      ],
    },
    Calculus: {
      beginner: [
        {
          question: "What is the derivative of f(x) = x²?",
          options: ["2x", "x", "x²", "2"],
          correctAnswer: 0,
          explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x",
        },
      ],
      intermediate: [
        {
          question: "What is the derivative of f(x) = 3x³ + 2x?",
          options: ["9x² + 2", "3x² + 2", "9x² + 2x", "x³ + x"],
          correctAnswer: 0,
          explanation: "d/dx(3x³ + 2x) = 3(3x²) + 2(1) = 9x² + 2",
        },
      ],
      advanced: [
        {
          question: "What is ∫(2x + 1)dx?",
          options: ["x² + x + C", "2x² + x + C", "x² + 1 + C", "2x + C"],
          correctAnswer: 0,
          explanation: "∫(2x + 1)dx = ∫2x dx + ∫1 dx = x² + x + C",
        },
      ],
    },
  },
  Physics: {
    Mechanics: {
      beginner: [
        {
          question: "What is the formula for velocity?",
          options: ["v = d/t", "v = d × t", "v = t/d", "v = d + t"],
          correctAnswer: 0,
          explanation: "Velocity is distance divided by time: v = d/t",
        },
      ],
      intermediate: [
        {
          question: "If a car accelerates at 2 m/s² for 5 seconds, what is its change in velocity?",
          options: ["10 m/s", "2.5 m/s", "7 m/s", "3 m/s"],
          correctAnswer: 0,
          explanation: "Change in velocity = acceleration × time = 2 m/s² × 5 s = 10 m/s",
        },
      ],
      advanced: [
        {
          question:
            "A ball is thrown upward with initial velocity 20 m/s. What is its velocity after 2 seconds? (g = 10 m/s²)",
          options: ["0 m/s", "10 m/s", "-10 m/s", "20 m/s"],
          correctAnswer: 0,
          explanation: "v = v₀ - gt = 20 - 10(2) = 20 - 20 = 0 m/s",
        },
      ],
    },
    Thermodynamics: {
      beginner: [
        {
          question: "What happens to the volume of a gas when temperature increases at constant pressure?",
          options: ["Volume increases", "Volume decreases", "Volume stays the same", "Volume becomes zero"],
          correctAnswer: 0,
          explanation:
            "According to Charles's Law, volume is directly proportional to temperature at constant pressure",
        },
      ],
    },
  },
  Chemistry: {
    "Atomic Structure": {
      beginner: [
        {
          question: "What is the charge of a proton?",
          options: ["+1", "-1", "0", "+2"],
          correctAnswer: 0,
          explanation: "Protons have a positive charge of +1 elementary charge",
        },
      ],
      intermediate: [
        {
          question: "How many electrons can the second electron shell hold?",
          options: ["8", "2", "18", "32"],
          correctAnswer: 0,
          explanation: "The second electron shell (n=2) can hold a maximum of 8 electrons",
        },
      ],
    },
  },
  Biology: {
    "Cell Biology": {
      beginner: [
        {
          question: "What is the powerhouse of the cell?",
          options: ["Mitochondria", "Nucleus", "Ribosome", "Cytoplasm"],
          correctAnswer: 0,
          explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP (energy)",
        },
      ],
      intermediate: [
        {
          question: "What process do plants use to make their own food?",
          options: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"],
          correctAnswer: 0,
          explanation:
            "Photosynthesis is the process where plants convert sunlight, CO₂, and water into glucose and oxygen",
        },
      ],
    },
  },
  "Computer Science": {
    Programming: {
      beginner: [
        {
          question: "What does 'HTML' stand for?",
          options: [
            "HyperText Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language",
          ],
          correctAnswer: 0,
          explanation: "HTML stands for HyperText Markup Language, used to create web pages",
        },
      ],
      intermediate: [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
          correctAnswer: 0,
          explanation:
            "Binary search has O(log n) time complexity because it eliminates half the search space in each step",
        },
      ],
    },
  },
}

export class LocalQuizGenerator {
  generateQuiz(config: QuizConfig): Question[] {
    const questions: Question[] = []
    const subjectTemplates = questionTemplates[config.subject as keyof typeof questionTemplates]

    if (!subjectTemplates) {
      return this.generateFallbackQuestions(config)
    }

    const topicTemplates = subjectTemplates[config.topic as keyof typeof subjectTemplates]

    if (!topicTemplates) {
      return this.generateFallbackQuestions(config)
    }

    const difficultyQuestions = topicTemplates[config.difficulty]

    if (!difficultyQuestions || difficultyQuestions.length === 0) {
      return this.generateFallbackQuestions(config)
    }

    // Generate questions by cycling through available templates
    for (let i = 0; i < config.questionCount; i++) {
      const templateIndex = i % difficultyQuestions.length
      const template = difficultyQuestions[templateIndex]

      questions.push({
        id: `q_${Date.now()}_${i}`,
        question: template.question,
        options: [...template.options], // Create a copy
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        difficulty: config.difficulty,
        topic: config.topic,
        questionType: config.questionTypes[0] || "Multiple Choice",
      })
    }

    // If we need more questions than templates, generate variations
    if (questions.length < config.questionCount) {
      const additionalQuestions = this.generateVariations(config, questions.length)
      questions.push(...additionalQuestions)
    }

    return questions.slice(0, config.questionCount)
  }

  generateDiagnosticTest(subject: string, gradeLevel: string, topics: string[]): Question[] {
    const questions: Question[] = []
    const difficulties: Array<"beginner" | "intermediate" | "advanced"> = ["beginner", "intermediate", "advanced"]

    topics.forEach((topic) => {
      difficulties.forEach((difficulty) => {
        const config: QuizConfig = {
          subject,
          topic,
          difficulty,
          questionCount: 2,
          questionTypes: ["Multiple Choice"],
        }

        const topicQuestions = this.generateQuiz(config)
        questions.push(...topicQuestions)
      })
    })

    return questions.slice(0, 15) // Limit to 15 questions
  }

  private generateFallbackQuestions(config: QuizConfig): Question[] {
    const questions: Question[] = []

    for (let i = 0; i < config.questionCount; i++) {
      questions.push({
        id: `fallback_${Date.now()}_${i}`,
        question: `${config.topic} Question ${i + 1}: What is a fundamental concept in ${config.topic}?`,
        options: [
          `Key concept in ${config.topic}`,
          "Alternative answer A",
          "Alternative answer B",
          "Alternative answer C",
        ],
        correctAnswer: 0,
        explanation: `This question tests your understanding of basic ${config.topic} concepts at the ${config.difficulty} level.`,
        difficulty: config.difficulty,
        topic: config.topic,
        questionType: config.questionTypes[0] || "Multiple Choice",
      })
    }

    return questions
  }

  private generateVariations(config: QuizConfig, startIndex: number): Question[] {
    const questions: Question[] = []
    const remaining = config.questionCount - startIndex

    for (let i = 0; i < remaining; i++) {
      questions.push({
        id: `variation_${Date.now()}_${i}`,
        question: `${config.topic} Practice Question: Which of the following best describes ${config.topic}?`,
        options: [
          `Correct description of ${config.topic}`,
          "Incorrect option A",
          "Incorrect option B",
          "Incorrect option C",
        ],
        correctAnswer: 0,
        explanation: `This question helps reinforce your understanding of ${config.topic} concepts.`,
        difficulty: config.difficulty,
        topic: config.topic,
        questionType: config.questionTypes[0] || "Multiple Choice",
      })
    }

    return questions
  }
}

export const quizGenerator = new LocalQuizGenerator()
