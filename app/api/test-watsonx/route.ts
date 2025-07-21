import { type NextRequest, NextResponse } from "next/server"
import { watsonxService } from "@/lib/watsonx-service"

export async function GET(request: NextRequest) {
  try {
    // Test the Watsonx service with a simple quiz generation
    const testQuestions = await watsonxService.generateQuiz({
      topic: "Basic Mathematics",
      difficulty: "beginner",
      questionCount: 2,
      studentLevel: "beginner",
      courseContext: "Test generation",
    })

    return NextResponse.json({
      success: true,
      message: "Watsonx integration working successfully!",
      questionsGenerated: testQuestions.length,
      sampleQuestion: testQuestions[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Watsonx test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Watsonx",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
