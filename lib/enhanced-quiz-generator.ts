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
  concept: string
  improvementAreas: string[]
  encouragement: string
  relatedTopics: string[]
}

interface QuestionTemplate {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  concept: string
  improvementAreas: string[]
  encouragement: string
  relatedTopics: string[]
}

// Comprehensive question database organized by subject and topic
const enhancedQuestionDatabase = {
  Mathematics: {
    Algebra: {
      beginner: [
        {
          question: "Solve for x: 3x + 7 = 22",
          options: ["x = 5", "x = 7", "x = 15", "x = 29"],
          correctAnswer: 0,
          explanation:
            "To solve 3x + 7 = 22: First, subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5. Always isolate the variable by performing inverse operations.",
          concept: "Linear Equations",
          improvementAreas: [
            "Practice isolating variables",
            "Review inverse operations",
            "Work on equation solving steps",
          ],
          encouragement:
            "Great effort! Linear equations are the foundation of algebra. Keep practicing and you'll master this concept! 🌟",
          relatedTopics: ["Variables", "Inverse Operations", "Equation Solving"],
        },
        {
          question: "What is the coefficient of x in the expression 5x + 3?",
          options: ["3", "5", "8", "x"],
          correctAnswer: 1,
          explanation:
            "The coefficient is the number that multiplies the variable. In 5x + 3, the number 5 is multiplying x, so 5 is the coefficient of x.",
          concept: "Coefficients and Terms",
          improvementAreas: [
            "Identify coefficients in expressions",
            "Understand algebraic terms",
            "Practice with variables",
          ],
          encouragement:
            "You're building strong algebra foundations! Understanding coefficients is key to success in algebra. Keep it up! 💪",
          relatedTopics: ["Variables", "Algebraic Expressions", "Terms"],
        },
        {
          question: "Simplify: 4x + 2x - x",
          options: ["5x", "6x", "7x", "4x"],
          correctAnswer: 0,
          explanation:
            "Combine like terms: 4x + 2x - x = (4 + 2 - 1)x = 5x. When combining like terms, add or subtract the coefficients and keep the variable part the same.",
          concept: "Combining Like Terms",
          improvementAreas: [
            "Practice combining like terms",
            "Review addition and subtraction of coefficients",
            "Work with algebraic expressions",
          ],
          encouragement:
            "Excellent work! Combining like terms is a crucial skill that you'll use throughout algebra. You're doing great! ⭐",
          relatedTopics: ["Like Terms", "Algebraic Expressions", "Simplification"],
        },
      ],
      intermediate: [
        {
          question: "Factor completely: x² + 8x + 15",
          options: ["(x + 3)(x + 5)", "(x + 1)(x + 15)", "(x - 3)(x - 5)", "(x + 2)(x + 7)"],
          correctAnswer: 0,
          explanation:
            "To factor x² + 8x + 15, find two numbers that multiply to 15 and add to 8. Those numbers are 3 and 5. So x² + 8x + 15 = (x + 3)(x + 5). Check: (x + 3)(x + 5) = x² + 5x + 3x + 15 = x² + 8x + 15 ✓",
          concept: "Factoring Quadratics",
          improvementAreas: [
            "Practice finding factor pairs",
            "Review FOIL method for checking",
            "Work on quadratic factoring patterns",
          ],
          encouragement:
            "Factoring can be tricky, but you're tackling it head-on! This skill opens doors to solving quadratic equations. Keep practicing! 🚀",
          relatedTopics: ["Quadratic Expressions", "FOIL Method", "Factor Pairs"],
        },
        {
          question: "Solve the system: 2x + y = 7 and x - y = 2",
          options: ["x = 3, y = 1", "x = 2, y = 3", "x = 1, y = 5", "x = 4, y = -1"],
          correctAnswer: 0,
          explanation:
            "Using elimination method: Add the equations: (2x + y) + (x - y) = 7 + 2, which gives 3x = 9, so x = 3. Substitute back: 2(3) + y = 7, so 6 + y = 7, therefore y = 1. Check: 2(3) + 1 = 7 ✓ and 3 - 1 = 2 ✓",
          concept: "Systems of Linear Equations",
          improvementAreas: ["Practice elimination method", "Review substitution method", "Work on checking solutions"],
          encouragement:
            "Systems of equations are powerful tools for solving real-world problems! You're developing advanced problem-solving skills. Amazing progress! 🎯",
          relatedTopics: ["Elimination Method", "Substitution Method", "Linear Equations"],
        },
      ],
      advanced: [
        {
          question: "Find the discriminant of 2x² - 5x + 3 = 0 and determine the nature of roots",
          options: [
            "Discriminant = 1, two real roots",
            "Discriminant = -1, no real roots",
            "Discriminant = 25, two real roots",
            "Discriminant = 49, two real roots",
          ],
          correctAnswer: 0,
          explanation:
            "For ax² + bx + c = 0, discriminant = b² - 4ac. Here: a = 2, b = -5, c = 3. Discriminant = (-5)² - 4(2)(3) = 25 - 24 = 1. Since discriminant > 0, there are two distinct real roots.",
          concept: "Quadratic Formula and Discriminant",
          improvementAreas: [
            "Practice discriminant calculations",
            "Review quadratic formula components",
            "Study nature of roots",
          ],
          encouragement:
            "The discriminant is a powerful tool for analyzing quadratics! You're mastering advanced algebraic concepts. Fantastic work! 🏆",
          relatedTopics: ["Quadratic Formula", "Nature of Roots", "Quadratic Equations"],
        },
      ],
    },
    Geometry: {
      beginner: [
        {
          question: "What is the area of a rectangle with length 12 cm and width 8 cm?",
          options: ["96 cm²", "40 cm²", "20 cm²", "48 cm²"],
          correctAnswer: 0,
          explanation:
            "Area of rectangle = length × width = 12 cm × 8 cm = 96 cm². Remember to include the square units (cm²) in your answer since area is measured in square units.",
          concept: "Area of Rectangles",
          improvementAreas: [
            "Practice area formulas",
            "Review units for area measurements",
            "Work with rectangle properties",
          ],
          encouragement:
            "Area calculations are fundamental in geometry! You're building essential skills for more complex shapes. Keep going! 📐",
          relatedTopics: ["Area Formulas", "Rectangle Properties", "Units of Measurement"],
        },
        {
          question: "In a triangle, if two angles are 45° and 60°, what is the third angle?",
          options: ["75°", "85°", "90°", "105°"],
          correctAnswer: 0,
          explanation:
            "The sum of angles in any triangle is always 180°. So: Third angle = 180° - 45° - 60° = 75°. This is a fundamental property of triangles that applies to all triangles.",
          concept: "Triangle Angle Sum",
          improvementAreas: [
            "Memorize triangle angle sum property",
            "Practice angle calculations",
            "Review triangle types",
          ],
          encouragement:
            "Understanding triangle properties is key to geometry success! You're grasping important concepts. Well done! 🔺",
          relatedTopics: ["Triangle Properties", "Angle Relationships", "Polygon Angles"],
        },
      ],
      intermediate: [
        {
          question: "Find the circumference of a circle with radius 7 cm (use π ≈ 3.14)",
          options: ["43.96 cm", "21.98 cm", "153.86 cm", "49 cm"],
          correctAnswer: 0,
          explanation:
            "Circumference = 2πr = 2 × 3.14 × 7 = 43.96 cm. The circumference is the distance around the circle. Remember the formula C = 2πr or C = πd (where d is diameter).",
          concept: "Circle Circumference",
          improvementAreas: [
            "Memorize circle formulas",
            "Practice with π calculations",
            "Review relationship between radius and diameter",
          ],
          encouragement:
            "Circles are everywhere in real life! Mastering circle formulas will help you solve many practical problems. Great job! ⭕",
          relatedTopics: ["Circle Properties", "Pi (π)", "Radius and Diameter"],
        },
      ],
      advanced: [
        {
          question: "In a right triangle, if one leg is 9 and the hypotenuse is 15, find the other leg",
          options: ["12", "6", "18", "24"],
          correctAnswer: 0,
          explanation:
            "Using Pythagorean theorem: a² + b² = c². Here: 9² + b² = 15², so 81 + b² = 225, therefore b² = 144, and b = 12. The Pythagorean theorem only works for right triangles.",
          concept: "Pythagorean Theorem",
          improvementAreas: [
            "Practice Pythagorean theorem",
            "Review right triangle properties",
            "Work on square root calculations",
          ],
          encouragement:
            "The Pythagorean theorem is one of the most famous mathematical relationships! You're mastering classical geometry. Excellent! 📏",
          relatedTopics: ["Right Triangles", "Square Roots", "Triangle Properties"],
        },
      ],
    },
    Calculus: {
      beginner: [
        {
          question: "What is the derivative of f(x) = 5x³?",
          options: ["15x²", "5x²", "15x³", "5x⁴"],
          correctAnswer: 0,
          explanation:
            "Using the power rule: d/dx(axⁿ) = n·ax^(n-1). For f(x) = 5x³: derivative = 3 × 5x^(3-1) = 15x². The power rule is fundamental for finding derivatives of polynomial functions.",
          concept: "Power Rule for Derivatives",
          improvementAreas: ["Practice power rule", "Review derivative notation", "Work with polynomial functions"],
          encouragement:
            "Derivatives are the foundation of calculus! You're learning one of mathematics' most powerful tools. Keep exploring! 📈",
          relatedTopics: ["Derivatives", "Power Rule", "Polynomial Functions"],
        },
      ],
      intermediate: [
        {
          question: "Find the derivative of f(x) = 3x² + 2x - 7",
          options: ["6x + 2", "3x + 2", "6x² + 2x", "6x - 7"],
          correctAnswer: 0,
          explanation:
            "Take the derivative term by term: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-7) = 0. So f'(x) = 6x + 2 + 0 = 6x + 2. Constants have zero derivative, and we can differentiate each term separately.",
          concept: "Derivative of Polynomials",
          improvementAreas: [
            "Practice term-by-term differentiation",
            "Review constant rule",
            "Work with polynomial derivatives",
          ],
          encouragement:
            "You're mastering polynomial differentiation! This skill is essential for optimization and rate problems. Fantastic progress! 🎓",
          relatedTopics: ["Polynomial Derivatives", "Sum Rule", "Constant Rule"],
        },
      ],
      advanced: [
        {
          question: "What is ∫(4x³ - 6x + 2)dx?",
          options: ["x⁴ - 3x² + 2x + C", "12x² - 6 + C", "4x⁴ - 6x² + 2x + C", "x⁴ - 3x² + C"],
          correctAnswer: 0,
          explanation:
            "Integrate term by term: ∫4x³dx = x⁴, ∫(-6x)dx = -3x², ∫2dx = 2x. Don't forget the constant of integration +C. So the answer is x⁴ - 3x² + 2x + C.",
          concept: "Integration of Polynomials",
          improvementAreas: [
            "Practice integration rules",
            "Remember constant of integration",
            "Review antiderivatives",
          ],
          encouragement:
            "Integration is the reverse of differentiation! You're mastering both sides of calculus. This opens doors to area and volume calculations! 🌟",
          relatedTopics: ["Antiderivatives", "Integration Rules", "Constant of Integration"],
        },
      ],
    },
  },
  Physics: {
    Mechanics: {
      beginner: [
        {
          question: "A car travels 120 km in 2 hours. What is its average speed?",
          options: ["60 km/h", "240 km/h", "122 km/h", "118 km/h"],
          correctAnswer: 0,
          explanation:
            "Average speed = total distance ÷ total time = 120 km ÷ 2 hours = 60 km/h. Speed tells us how fast something is moving and is always positive. Remember to include units in your answer!",
          concept: "Speed and Velocity",
          improvementAreas: ["Practice speed calculations", "Review distance-time relationships", "Work with units"],
          encouragement:
            "Understanding motion is fundamental to physics! You're grasping how we describe movement in the world around us. Great start! 🚗",
          relatedTopics: ["Distance", "Time", "Motion"],
        },
        {
          question: "What is the SI unit of force?",
          options: ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"],
          correctAnswer: 0,
          explanation:
            "The Newton (N) is the SI unit of force, named after Sir Isaac Newton. One Newton is the force needed to accelerate 1 kg of mass at 1 m/s². Understanding units is crucial in physics!",
          concept: "Units and Measurements",
          improvementAreas: ["Memorize SI units", "Review fundamental quantities", "Practice unit conversions"],
          encouragement:
            "Knowing the right units is like speaking the language of physics! You're building a strong foundation. Keep learning! 📏",
          relatedTopics: ["SI Units", "Force", "Mass and Acceleration"],
        },
      ],
      intermediate: [
        {
          question:
            "A ball is thrown upward with initial velocity 20 m/s. What is its velocity after 1 second? (g = 10 m/s²)",
          options: ["10 m/s", "30 m/s", "20 m/s", "0 m/s"],
          correctAnswer: 0,
          explanation:
            "Using v = u + at, where u = 20 m/s (initial velocity), a = -10 m/s² (acceleration due to gravity, negative because it opposes motion), t = 1 s. So v = 20 + (-10)(1) = 10 m/s upward.",
          concept: "Kinematics with Gravity",
          improvementAreas: [
            "Practice kinematic equations",
            "Understand gravity's effect",
            "Work with vector directions",
          ],
          encouragement:
            "Projectile motion is everywhere - from sports to space missions! You're learning to predict how objects move. Awesome! 🚀",
          relatedTopics: ["Kinematic Equations", "Gravity", "Projectile Motion"],
        },
      ],
      advanced: [
        {
          question: "A 5 kg object accelerates at 3 m/s². What net force acts on it?",
          options: ["15 N", "8 N", "2 N", "1.67 N"],
          correctAnswer: 0,
          explanation:
            "Using Newton's second law: F = ma = 5 kg × 3 m/s² = 15 N. This fundamental law relates force, mass, and acceleration. The direction of force is the same as the direction of acceleration.",
          concept: "Newton's Second Law",
          improvementAreas: [
            "Practice F = ma calculations",
            "Review Newton's laws",
            "Understand force-acceleration relationship",
          ],
          encouragement:
            "Newton's laws govern everything from walking to rocket launches! You're mastering the fundamental principles of motion. Brilliant! ⚡",
          relatedTopics: ["Newton's Laws", "Force", "Mass and Acceleration"],
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
            "According to Charles's Law, volume is directly proportional to temperature at constant pressure (V ∝ T). As temperature increases, gas molecules move faster and need more space, so volume increases.",
          concept: "Charles's Law",
          improvementAreas: [
            "Study gas laws",
            "Review temperature-volume relationships",
            "Practice with proportional reasoning",
          ],
          encouragement:
            "Gas laws help us understand everything from weather to engines! You're exploring how matter behaves. Fantastic! 🌡️",
          relatedTopics: ["Gas Laws", "Temperature", "Pressure and Volume"],
        },
      ],
    },
  },
  Chemistry: {
    "Atomic Structure": {
      beginner: [
        {
          question: "How many protons does a carbon atom have?",
          options: ["6", "12", "14", "8"],
          correctAnswer: 0,
          explanation:
            "Carbon has atomic number 6, which means it has 6 protons. The atomic number defines the element - all carbon atoms have exactly 6 protons. This is what makes carbon unique from all other elements!",
          concept: "Atomic Number and Protons",
          improvementAreas: [
            "Memorize common atomic numbers",
            "Review periodic table organization",
            "Study proton-electron relationships",
          ],
          encouragement:
            "Understanding atoms is like learning the alphabet of chemistry! You're discovering the building blocks of everything around us. Amazing! ⚛️",
          relatedTopics: ["Periodic Table", "Atomic Number", "Elements"],
        },
        {
          question: "What is the charge of an electron?",
          options: ["-1", "+1", "0", "-2"],
          correctAnswer: 0,
          explanation:
            "Electrons have a charge of -1 (negative one elementary charge). This negative charge balances the positive charge of protons in neutral atoms. Electrons are much smaller than protons but equally important!",
          concept: "Electron Properties",
          improvementAreas: [
            "Review subatomic particle properties",
            "Study charge relationships",
            "Practice with ions and neutral atoms",
          ],
          encouragement:
            "Electrons are amazing! They're responsible for chemical bonding and electricity. You're learning about the particles that make chemistry possible! ⚡",
          relatedTopics: ["Subatomic Particles", "Electric Charge", "Atomic Structure"],
        },
      ],
      intermediate: [
        {
          question: "How many electrons can the third electron shell (n=3) hold?",
          options: ["18", "8", "2", "32"],
          correctAnswer: 0,
          explanation:
            "The maximum number of electrons in shell n is 2n². For the third shell (n=3): 2(3)² = 2(9) = 18 electrons. This shell has s, p, and d subshells that can hold 2, 6, and 10 electrons respectively.",
          concept: "Electron Shell Capacity",
          improvementAreas: ["Practice 2n² formula", "Review electron shell structure", "Study subshell organization"],
          encouragement:
            "Electron shells are like apartments for electrons! Understanding their organization helps predict chemical behavior. You're doing great! 🏠",
          relatedTopics: ["Electron Configuration", "Subshells", "Quantum Numbers"],
        },
      ],
    },
    "Chemical Bonding": {
      beginner: [
        {
          question: "What type of bond forms between sodium (Na) and chlorine (Cl) in table salt?",
          options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
          correctAnswer: 0,
          explanation:
            "Sodium loses an electron to become Na⁺, and chlorine gains an electron to become Cl⁻. The electrostatic attraction between these oppositely charged ions forms an ionic bond. This happens between metals and nonmetals.",
          concept: "Ionic Bonding",
          improvementAreas: [
            "Study electron transfer",
            "Review metal vs nonmetal properties",
            "Practice identifying bond types",
          ],
          encouragement:
            "Chemical bonds hold our world together! From the salt on your food to the water you drink - you're learning how atoms connect. Wonderful! 🧂",
          relatedTopics: ["Electron Transfer", "Ions", "Metals and Nonmetals"],
        },
      ],
    },
  },
  Biology: {
    "Cell Biology": {
      beginner: [
        {
          question: "Which organelle is known as the 'powerhouse of the cell'?",
          options: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic reticulum"],
          correctAnswer: 0,
          explanation:
            "Mitochondria are called the 'powerhouse' because they produce ATP (adenosine triphosphate), the energy currency of cells. They convert glucose and oxygen into usable energy through cellular respiration.",
          concept: "Cellular Energy Production",
          improvementAreas: ["Study organelle functions", "Review cellular respiration", "Learn about ATP"],
          encouragement:
            "Cells are like tiny cities with specialized workers! Understanding how they work helps us understand all of life. You're exploring the foundation of biology! 🔬",
          relatedTopics: ["Organelles", "Cellular Respiration", "ATP"],
        },
        {
          question: "What process do plants use to convert sunlight into chemical energy?",
          options: ["Photosynthesis", "Cellular respiration", "Fermentation", "Transpiration"],
          correctAnswer: 0,
          explanation:
            "Photosynthesis converts light energy into chemical energy (glucose) using carbon dioxide and water. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process also produces the oxygen we breathe!",
          concept: "Photosynthesis",
          improvementAreas: [
            "Study photosynthesis equation",
            "Review light-dependent reactions",
            "Learn about chloroplasts",
          ],
          encouragement:
            "Photosynthesis is one of the most important processes on Earth! Plants feed the world and give us oxygen. You're learning about life itself! 🌱",
          relatedTopics: ["Chloroplasts", "Light Energy", "Glucose Production"],
        },
      ],
      intermediate: [
        {
          question: "During which phase of mitosis do chromosomes align at the cell's equator?",
          options: ["Metaphase", "Prophase", "Anaphase", "Telophase"],
          correctAnswer: 0,
          explanation:
            "During metaphase, chromosomes line up at the cell's equator (metaphase plate). This ensures each daughter cell gets exactly the same genetic material. Think 'M' for metaphase and 'Middle' for the middle of the cell!",
          concept: "Mitosis Phases",
          improvementAreas: ["Memorize mitosis phases", "Study chromosome behavior", "Review cell division importance"],
          encouragement:
            "Cell division is how you grew from a single cell to who you are today! Understanding mitosis reveals the miracle of growth and healing. Incredible! 🧬",
          relatedTopics: ["Cell Division", "Chromosomes", "Genetic Material"],
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
            "Hyperlink Text Markup Language",
          ],
          correctAnswer: 0,
          explanation:
            "HTML stands for HyperText Markup Language. It's the standard language for creating web pages. 'HyperText' refers to links between pages, and 'Markup' means it uses tags to structure content.",
          concept: "Web Technologies",
          improvementAreas: ["Study HTML basics", "Learn about web development", "Practice with markup languages"],
          encouragement:
            "HTML is the backbone of the internet! Every website you visit uses HTML. You're learning the language of the web! 🌐",
          relatedTopics: ["Web Development", "Markup Languages", "Internet Technologies"],
        },
        {
          question: "In programming, what is a 'variable'?",
          options: ["A container that stores data", "A type of loop", "A programming language", "An error in code"],
          correctAnswer: 0,
          explanation:
            "A variable is like a labeled box that stores data in computer memory. You can put different values in it and change them as needed. Variables are fundamental to all programming languages!",
          concept: "Programming Fundamentals",
          improvementAreas: ["Practice declaring variables", "Study data types", "Learn variable naming conventions"],
          encouragement:
            "Variables are like the building blocks of programming! Once you master them, you can create amazing programs. You're on your way! 💻",
          relatedTopics: ["Data Types", "Memory", "Programming Concepts"],
        },
      ],
      intermediate: [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
          correctAnswer: 0,
          explanation:
            "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step. With each comparison, the search space is cut in half, making it very efficient for large datasets.",
          concept: "Algorithm Complexity",
          improvementAreas: ["Study Big O notation", "Practice algorithm analysis", "Review search algorithms"],
          encouragement:
            "Understanding algorithm efficiency is crucial for writing fast programs! You're thinking like a computer scientist. Excellent! 🚀",
          relatedTopics: ["Big O Notation", "Search Algorithms", "Algorithm Analysis"],
        },
      ],
    },
  },
}

export class EnhancedQuizGenerator {
  generateQuiz(config: QuizConfig): Question[] {
    const questions: Question[] = []
    const subjectData = enhancedQuestionDatabase[config.subject as keyof typeof enhancedQuestionDatabase]

    if (!subjectData) {
      return this.generateFallbackQuestions(config)
    }

    const topicData = subjectData[config.topic as keyof typeof subjectData]

    if (!topicData) {
      return this.generateFallbackQuestions(config)
    }

    const difficultyQuestions = topicData[config.difficulty] as QuestionTemplate[]

    if (!difficultyQuestions || difficultyQuestions.length === 0) {
      return this.generateFallbackQuestions(config)
    }

    // Generate questions with variety
    for (let i = 0; i < config.questionCount; i++) {
      const templateIndex = i % difficultyQuestions.length
      const template = difficultyQuestions[templateIndex]

      // Add some variation to prevent exact duplicates
      const questionVariation = this.addQuestionVariation(template, i)

      questions.push({
        id: `q_${Date.now()}_${i}`,
        question: questionVariation.question,
        options: [...questionVariation.options],
        correctAnswer: questionVariation.correctAnswer,
        explanation: questionVariation.explanation,
        difficulty: config.difficulty,
        topic: config.topic,
        questionType: config.questionTypes[0] || "Multiple Choice",
        concept: questionVariation.concept,
        improvementAreas: [...questionVariation.improvementAreas],
        encouragement: questionVariation.encouragement,
        relatedTopics: [...questionVariation.relatedTopics],
      })
    }

    // If we need more questions than available templates, generate variations
    if (questions.length < config.questionCount) {
      const additionalQuestions = this.generateAdditionalVariations(config, difficultyQuestions, questions.length)
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
          questionCount: 1,
          questionTypes: ["Multiple Choice"],
        }

        const topicQuestions = this.generateQuiz(config)
        questions.push(...topicQuestions)
      })
    })

    return questions.slice(0, 15)
  }

  private addQuestionVariation(template: QuestionTemplate, index: number): QuestionTemplate {
    // For now, return the template as-is, but this could be enhanced
    // to create slight variations in wording while maintaining accuracy
    return template
  }

  private generateAdditionalVariations(
    config: QuizConfig,
    templates: QuestionTemplate[],
    startIndex: number,
  ): Question[] {
    const questions: Question[] = []
    const remaining = config.questionCount - startIndex

    for (let i = 0; i < remaining; i++) {
      const templateIndex = (startIndex + i) % templates.length
      const template = templates[templateIndex]

      questions.push({
        id: `variation_${Date.now()}_${i}`,
        question: `${template.question} (Practice variation)`,
        options: [...template.options],
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        difficulty: config.difficulty,
        topic: config.topic,
        questionType: config.questionTypes[0] || "Multiple Choice",
        concept: template.concept,
        improvementAreas: [...template.improvementAreas],
        encouragement: template.encouragement,
        relatedTopics: [...template.relatedTopics],
      })
    }

    return questions
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
        explanation: `This question tests your understanding of basic ${config.topic} concepts at the ${config.difficulty} level. Focus on understanding the fundamental principles of this topic.`,
        difficulty: config.difficulty,
        topic: config.topic,
        questionType: config.questionTypes[0] || "Multiple Choice",
        concept: `${config.topic} Fundamentals`,
        improvementAreas: [
          `Study ${config.topic} basics`,
          `Review ${config.difficulty} level concepts`,
          `Practice more problems`,
        ],
        encouragement: `Keep practicing ${config.topic}! Every expert was once a beginner. You're making great progress! 🌟`,
        relatedTopics: [`${config.topic} Basics`, "Fundamental Concepts", "Practice Problems"],
      })
    }

    return questions
  }

  // Method to get personalized feedback for wrong answers
  getPersonalizedFeedback(
    question: Question,
    userAnswer: number,
  ): {
    explanation: string
    improvementAreas: string[]
    encouragement: string
    nextSteps: string[]
  } {
    const isCorrect = userAnswer === question.correctAnswer

    if (isCorrect) {
      return {
        explanation: `Excellent! ${question.explanation}`,
        improvementAreas: [],
        encouragement: `Perfect! You've mastered this ${question.concept} concept. ${question.encouragement}`,
        nextSteps: [
          `Continue practicing ${question.topic}`,
          `Try more advanced problems`,
          `Explore related topics: ${question.relatedTopics.join(", ")}`,
        ],
      }
    }

    return {
      explanation: `Not quite right. ${question.explanation}`,
      improvementAreas: question.improvementAreas,
      encouragement: `Don't worry! Making mistakes is part of learning. ${question.encouragement}`,
      nextSteps: [
        `Review the concept: ${question.concept}`,
        `Practice similar problems`,
        `Study these areas: ${question.improvementAreas.join(", ")}`,
        `Ask for help if needed - everyone learns differently!`,
      ],
    }
  }
}

export const enhancedQuizGenerator = new EnhancedQuizGenerator()
