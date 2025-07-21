import { type NextRequest, NextResponse } from "next/server"
import { aiQuizGenerator } from "@/lib/ai-quiz-generator"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, questionCount } = await request.json()

    if (!topic || !difficulty) {
      return NextResponse.json({ error: "Topic and difficulty are required" }, { status: 400 })
    }

    const questions = await aiQuizGenerator.generateQuiz({
      topic,
      difficulty,
      questionCount: questionCount || 5,
    })

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        topic,
        difficulty,
        questionCount: questions.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
