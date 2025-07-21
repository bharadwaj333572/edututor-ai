import { type NextRequest, NextResponse } from "next/server"
import { pineconeService } from "@/lib/pinecone-service"

export async function POST(request: NextRequest) {
  try {
    const { studentId, results, answers, questions } = await request.json()

    // Create performance vector for Pinecone
    const performanceVector = {
      id: `diagnostic_${studentId}_${Date.now()}`,
      values: [
        results.overallScore / 100,
        ...Object.values(results.topicScores).map((score: any) => score / 100),
        results.strengths.length / 10,
        results.weaknesses.length / 10,
      ],
      metadata: {
        studentId,
        type: "diagnostic",
        overallScore: results.overallScore,
        recommendedLevel: results.recommendedLevel,
        timestamp: new Date().toISOString(),
        topics: Object.keys(results.topicScores),
        strengths: results.strengths,
        weaknesses: results.weaknesses,
      },
    }

    // Store in Pinecone
    await pineconeService.storeStudentPerformance(performanceVector)

    return NextResponse.json({
      success: true,
      message: "Diagnostic results stored successfully",
    })
  } catch (error) {
    console.error("Error storing diagnostic results:", error)
    return NextResponse.json({ error: "Failed to store diagnostic results" }, { status: 500 })
  }
}
