import { type NextRequest, NextResponse } from "next/server";
import { watsonxService } from "@/lib/watsonx-service";

export async function GET(request: NextRequest) {
  try {
    // Test Watsonx integration with sample quiz generation
    const testQuestions = await watsonxService.generateQuiz({
      topic: "Basic Mathematics",
      difficulty: "beginner",
      questionCount: 2,
      studentLevel: "beginner",
      courseContext: "This test checks Watsonx service availability.",
    });

    // Ensure valid quiz questions were generated
    if (!Array.isArray(testQuestions) || testQuestions.length === 0) {
      throw new Error("Watsonx did not return any quiz questions.");
    }

    return NextResponse.json({
      success: true,
      message: "Watsonx integration is functioning correctly.",
      totalQuestionsGenerated: testQuestions.length,
      sampleQuestionPreview: testQuestions[0],
      generatedAt: new Date().toISOString(),
      service: "watsonxService",
      testContext: "Integration diagnostic",
    });
  } catch (error) {
    console.error("Watsonx diagnostic error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch quiz from Watsonx.",
        error: error instanceof Error ? error.message : "Unknown failure occurred.",
        timestamp: new Date().toISOString(),
        resolutionSteps: [
          "Check Watsonx API credentials",
          "Validate request format",
          "Ensure internet/API access",
        ],
      },
      { status: 500 }
    );
  }
}
