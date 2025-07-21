import { type NextRequest, NextResponse } from "next/server"
import { enhancedQuizGenerator } from "@/lib/enhanced-quiz-generator"

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    if (!config.subject || !config.topic) {
      return NextResponse.json({ error: "Subject and topic are required" }, { status: 400 })
    }

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const questions = enhancedQuizGenerator.generateQuiz(config)

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        config,
        generatedAt: new Date().toISOString(),
        estimatedTime: config.timeLimit,
        generator: "Enhanced Algorithm v2.0",
        totalConcepts: questions.length,
        uniqueTopics: [...new Set(questions.map((q) => q.concept))].length,
      },
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
