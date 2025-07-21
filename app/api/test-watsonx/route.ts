import { type NextRequest, NextResponse } from "next/server";
import { watsonxService } from "@/lib/watsonx-service";

export async function GET(request: NextRequest) {
  try {
    // Run a basic test to validate Watsonx integration
    const testQuestions = await watsonxService.generateQuiz({
      topic: "Basic Mathematics",
      difficulty: "beginner",
      questionCount: 2,
      studentLevel: "beginner",
      courseContext: "Watsonx diagnostic test",
    });

    // Validate the output
    if (!testQuestions || !Array.isArray(testQuestions) || testQuestions.length === 0) {
      throw new Error("Watsonx returned no questions");
    }

    return NextResponse.json({
      success: true,
      message: "✅ Watsonx integration working successfully!",
      questionsGenerated: testQuestions.length,
      sampleQuestion: testQuestions[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Watsonx test error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect or generate quiz from Watsonx",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        suggestion: "Ensure API keys, network, and Watsonx service configs are correctly set.",
      },
      { status: 500 }
    );
  }
}
