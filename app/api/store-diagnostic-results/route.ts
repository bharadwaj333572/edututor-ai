import { type NextRequest, NextResponse } from "next/server";
import { pineconeService } from "@/lib/pinecone-service";

export async function POST(request: NextRequest) {
  try {
    const { studentId, results, answers, questions } = await request.json();

    // Basic validation
    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json({ error: "Missing or invalid studentId" }, { status: 400 });
    }

    if (!results || typeof results.overallScore !== "number" || !results.topicScores) {
      return NextResponse.json({ error: "Incomplete or invalid results object" }, { status: 400 });
    }

    // Normalize values safely
    const topicScores = results.topicScores || {};
    const scoreValues = Object.values(topicScores).map((score: any) =>
      typeof score === "number" ? score / 100 : 0
    );

    const performanceVector = {
      id: `diagnostic_${studentId}_${Date.now()}`,
      values: [
        results.overallScore / 100,
        ...scoreValues,
        (results.strengths?.length || 0) / 10,
        (results.weaknesses?.length || 0) / 10,
      ],
      metadata: {
        studentId,
        type: "diagnostic",
        overallScore: results.overallScore,
        recommendedLevel: results.recommendedLevel || "intermediate",
        timestamp: new Date().toISOString(),
        topics: Object.keys(topicScores),
        strengths: results.strengths || [],
        weaknesses: results.weaknesses || [],
        questionCount: questions?.length || 0,
        answerAccuracy: answers ? answers.filter((a: any) => a.correct).length / answers.length : null,
      },
    };

    // Store in Pinecone
    await pineconeService.storeStudentPerformance(performanceVector);

    return NextResponse.json({
      success: true,
      message: "Diagnostic results stored successfully",
    });
  } catch (error) {
    console.error("Error storing diagnostic results:", error);
    return NextResponse.json(
      { error: "Failed to store diagnostic results" },
      { status: 500 }
    );
  }
}
