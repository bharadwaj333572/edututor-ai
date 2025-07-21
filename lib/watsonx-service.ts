interface WatsonxConfig {
  apiKey: string
  projectId: string
  baseUrl: string
}

interface QuizGenerationRequest {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questionCount: number
  studentLevel: string
  previousPerformance?: number[]
  courseContext?: string
}

interface GeneratedQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  topic: string
  bloomsTaxonomy: string
}

interface DiagnosticTestRequest {
  subject: string
  gradeLevel: string
  topics: string[]
}

export class WatsonxService {
  private config: WatsonxConfig
  private accessToken: string | null = null
  private tokenExpiry = 0

  constructor(config: WatsonxConfig) {
    this.config = config
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          // Correct grant-type per IBM Cloud docs
          grant_type: "urn:ibm:params:oauth:grant-type:apikey",
          apikey: this.config.apiKey,
        }),
      })

      if (!response.ok) {
        const errTxt = await response.text()
        throw new Error(`Failed to get access token: ${response.status} ${response.statusText} – ${errTxt}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000

      return this.accessToken
    } catch (error) {
      console.error("Error getting IBM Cloud access token:", error)
      throw error
    }
  }

  async generateQuiz(request: QuizGenerationRequest): Promise<GeneratedQuestion[]> {
    try {
      const accessToken = await this.getAccessToken()
      const prompt = this.buildQuizPrompt(request)
      const url = `${this.config.baseUrl}/v1/text/generation?version=2023-05-29`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          model_id: "ibm/granite-13b-chat-v2",
          input: prompt,
          parameters: {
            decoding_method: "greedy",
            max_new_tokens: 2000,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1,
          },
          project_id: this.config.projectId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Watsonx API error:", response.status, errorText)
        throw new Error(`Watsonx API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        return this.parseQuizResponse(data.results[0].generated_text, request)
      } else {
        throw new Error("No results returned from Watsonx API")
      }
    } catch (error) {
      console.error("Error generating quiz with Watsonx:", error)
      // Fallback to sample questions if API fails
      return this.getFallbackQuestions(request)
    }
  }

  async generateDiagnosticTest(request: DiagnosticTestRequest): Promise<GeneratedQuestion[]> {
    const prompt = `Generate a comprehensive diagnostic test for ${request.subject} at ${request.gradeLevel} level.
    
Topics to assess: ${request.topics.join(", ")}

Create 15 questions that progressively increase in difficulty to assess student's current knowledge level.
Include questions from basic recall to advanced application and analysis.

Format each question as JSON with the following structure:
{
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation",
  "difficulty": "easy|medium|hard",
  "topic": "specific topic",
  "bloomsTaxonomy": "remember|understand|apply|analyze|evaluate|create"
}

Return only valid JSON array of questions.`

    try {
      const accessToken = await this.getAccessToken()
      const url = `${this.config.baseUrl}/v1/text/generation?version=2023-05-29`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          model_id: "ibm/granite-13b-chat-v2",
          input: prompt,
          parameters: {
            decoding_method: "greedy",
            max_new_tokens: 3000,
            temperature: 0.5,
            top_p: 0.9,
          },
          project_id: this.config.projectId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Watsonx API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        return this.parseQuizResponse(data.results[0].generated_text, {
          topic: request.subject,
          difficulty: "intermediate",
          questionCount: 15,
          studentLevel: request.gradeLevel,
        })
      } else {
        return this.getFallbackDiagnosticQuestions(request)
      }
    } catch (error) {
      console.error("Error generating diagnostic test:", error)
      return this.getFallbackDiagnosticQuestions(request)
    }
  }

  async analyzeStudentResponse(question: string, studentAnswer: string, correctAnswer: string): Promise<string> {
    const prompt = `Analyze this student's response and provide personalized feedback:

Question: ${question}
Student Answer: ${studentAnswer}
Correct Answer: ${correctAnswer}

Provide constructive feedback that:
1. Explains why the answer is correct/incorrect
2. Identifies the underlying concept
3. Suggests specific areas for improvement
4. Encourages continued learning

Keep the feedback encouraging and educational.`

    try {
      const accessToken = await this.getAccessToken()
      const url = `${this.config.baseUrl}/v1/text/generation?version=2023-05-29`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          model_id: "ibm/granite-13b-chat-v2",
          input: prompt,
          parameters: {
            decoding_method: "greedy",
            max_new_tokens: 500,
            temperature: 0.6,
          },
          project_id: this.config.projectId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Watsonx API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        return data.results[0].generated_text.trim()
      } else {
        return "Great effort! Keep practicing to improve your understanding of this concept."
      }
    } catch (error) {
      console.error("Error analyzing student response:", error)
      return "Great effort! Keep practicing to improve your understanding of this concept."
    }
  }

  private buildQuizPrompt(request: QuizGenerationRequest): string {
    return `Generate ${request.questionCount} multiple-choice questions for ${request.topic} at ${request.difficulty} level.

Student Context:
- Level: ${request.studentLevel}
- Previous Performance: ${request.previousPerformance?.join(", ") || "No previous data"}
- Course Context: ${request.courseContext || "General"}

Requirements:
- Each question should have 4 options (A, B, C, D)
- Include detailed explanations for correct answers
- Vary difficulty appropriately
- Focus on conceptual understanding
- Include real-world applications where relevant

Format each question as JSON:
{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation",
  "difficulty": "${request.difficulty}",
  "topic": "${request.topic}",
  "bloomsTaxonomy": "cognitive level"
}

Return only a valid JSON array of questions.`
  }

  private parseQuizResponse(response: string, request: QuizGenerationRequest): GeneratedQuestion[] {
    try {
      // Clean the response and extract JSON
      const cleanResponse = response.trim()

      // Try to find JSON array in the response
      const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0])
        return questions.map((q: any, index: number) => ({
          id: `${Date.now()}_${index}`,
          question: q.question || `Sample question ${index + 1}`,
          options: q.options || ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: q.correctAnswer || 0,
          explanation: q.explanation || "This is the correct answer.",
          difficulty: q.difficulty || request.difficulty,
          topic: q.topic || request.topic,
          bloomsTaxonomy: q.bloomsTaxonomy || "understand",
        }))
      }

      // If no JSON found, try to parse individual questions
      const lines = cleanResponse.split("\n").filter((line) => line.trim())
      const questions: GeneratedQuestion[] = []

      for (let i = 0; i < Math.min(request.questionCount, 5); i++) {
        questions.push({
          id: `parsed_${Date.now()}_${i}`,
          question: `Generated question about ${request.topic}: What is an important concept in ${request.topic}?`,
          options: [
            `Correct concept in ${request.topic}`,
            "Incorrect option A",
            "Incorrect option B",
            "Incorrect option C",
          ],
          correctAnswer: 0,
          explanation: `This concept is fundamental to understanding ${request.topic}.`,
          difficulty: request.difficulty,
          topic: request.topic,
          bloomsTaxonomy: "understand",
        })
      }

      return questions
    } catch (error) {
      console.error("Error parsing quiz response:", error)
      return this.getFallbackQuestions(request)
    }
  }

  private getFallbackQuestions(request: QuizGenerationRequest): GeneratedQuestion[] {
    const fallbackQuestions: GeneratedQuestion[] = []

    for (let i = 0; i < request.questionCount; i++) {
      fallbackQuestions.push({
        id: `fallback_${Date.now()}_${i}`,
        question: `${request.topic} Question ${i + 1}: What is a key concept in ${request.topic}?`,
        options: [
          `Fundamental concept in ${request.topic}`,
          "Alternative concept A",
          "Alternative concept B",
          "Alternative concept C",
        ],
        correctAnswer: 0,
        explanation: `This represents a core principle in ${request.topic} that students should understand.`,
        difficulty: request.difficulty,
        topic: request.topic,
        bloomsTaxonomy: "understand",
      })
    }

    return fallbackQuestions
  }

  private getFallbackDiagnosticQuestions(request: DiagnosticTestRequest): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = []

    request.topics.forEach((topic, topicIndex) => {
      const difficulties = ["easy", "medium", "hard"]
      difficulties.forEach((difficulty, diffIndex) => {
        questions.push({
          id: `diagnostic_${Date.now()}_${topicIndex}_${diffIndex}`,
          question: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${topic} question: What is ${difficulty === "easy" ? "a basic" : difficulty === "medium" ? "an intermediate" : "an advanced"} concept in ${topic}?`,
          options: [
            `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} concept in ${topic}`,
            "Incorrect option A",
            "Incorrect option B",
            "Incorrect option C",
          ],
          correctAnswer: 0,
          explanation: `This ${difficulty} concept is important for understanding ${topic}.`,
          difficulty,
          topic,
          bloomsTaxonomy: difficulty === "easy" ? "remember" : difficulty === "medium" ? "understand" : "apply",
        })
      })
    })

    return questions.slice(0, 15)
  }
}

// Export singleton instance
const watsonxServiceInstance = new WatsonxService({
  apiKey: process.env.WATSONX_API_KEY || "",
  projectId: process.env.WATSONX_PROJECT_ID || "",
  baseUrl: process.env.WATSONX_BASE_URL || "https://us-south.ml.cloud.ibm.com",
})

export default watsonxServiceInstance
