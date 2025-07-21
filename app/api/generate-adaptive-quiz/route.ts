import { type NextRequest, NextResponse } from "next/server"
import { watsonxService } from "@/lib/watsonx-service"
import { pineconeService } from "@/lib/pinecone-service"

export async function POST(request: NextRequest) {
  try {
    const { studentId, topic, difficulty, questionCount, courseContext } = await request.json()

    // Get student insights from Pinecone
    const insights = await pineconeService.getStudentInsights(studentId)

    // Get previous performance data
    const previousPerformance = insights ? Object.values(insights.topicScores || {}) : []

    // Generate adaptive quiz using Watsonx
    const questions = await watsonxService.generateQuiz({
      topic,
      difficulty: (insights?.difficultyLevel as any) || difficulty,
      questionCount,
      studentLevel: insights?.difficultyLevel || "intermediate",
      previousPerformance,
      courseContext,
    })

    return NextResponse.json({
      success: true,
      questions,
      adaptiveInfo: {
        recommendedDifficulty: insights?.difficultyLevel || difficulty,
        focusAreas: insights?.weakAreas || [],
        studentStrengths: insights?.strongAreas || [],
      },
    })
  } catch (error) {
    console.error("Error generating adaptive quiz:", error)
    return NextResponse.json({ error: "Failed to generate adaptive quiz" }, { status: 500 })
  }
}
