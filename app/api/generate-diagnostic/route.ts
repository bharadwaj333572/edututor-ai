import { type NextRequest, NextResponse } from "next/server"
import { enhancedQuizGenerator } from "@/lib/enhanced-quiz-generator"

export async function POST(request: NextRequest) {
  try {
    const { subject, gradeLevel, topics } = await request.json()

    if (!subject || !gradeLevel || !topics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1800))

    const questions = enhancedQuizGenerator.generateDiagnosticTest(subject, gradeLevel, topics)

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        subject,
        gradeLevel,
        topicsAssessed: topics,
        generatedAt: new Date().toISOString(),
        generator: "Enhanced Diagnostic Algorithm",
        assessmentType: "Comprehensive Diagnostic",
      },
    })
  } catch (error) {
    console.error("Error generating diagnostic test:", error)
    return NextResponse.json({ error: "Failed to generate diagnostic test" }, { status: 500 })
  }
}
