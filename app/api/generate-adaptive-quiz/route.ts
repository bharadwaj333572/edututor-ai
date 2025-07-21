import { type NextRequest, NextResponse } from "next/server";
import { watsonxService } from "@/lib/watsonx-service";
import { pineconeService } from "@/lib/pinecone-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, topic, difficulty, questionCount, courseContext } = body;

    // Validate input
    if (!studentId || !topic || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: "Missing required fields in the request body." },
        { status: 400 }
      );
    }

    // 1. Get student insights from Pinecone vector DB
    const insights = await pineconeService.getStudentInsights(studentId);

    // 2. Extract performance data for adaptive quiz generation
    const previousPerformance = insights?.topicScores
      ? Object.values(insights.topicScores)
      : [];

    const recommendedDifficulty = insights?.difficultyLevel || difficulty;
    const studentLevel = insights?.difficultyLevel || "intermediate";

    // 3. Generate adaptive quiz using Watsonx
    const questions = await watsonxService.generateQuiz({
      topic,
      difficulty: recommendedDifficulty,
      questionCount,
      studentLevel,
      previousPerformance,
      courseContext: courseContext || "", // fallback if not provided
    });

    return NextResponse.json({
      success: true,
      questions,
      adaptiveInfo: {
        recommendedDifficulty,
        focusAreas: insights?.weakAreas || [],
        studentStrengths: insights?.strongAreas || [],
      },
    });
  } catch (error) {
    console.error("[Adaptive Quiz Error]", error);
    return NextResponse.json(
      { error: "Failed to generate adaptive quiz. Please try again." },
      { status: 500 }
    );
  }
}

    
