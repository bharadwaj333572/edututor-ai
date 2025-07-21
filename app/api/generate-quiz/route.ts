import { type NextRequest, NextResponse } from "next/server";
import { aiQuizGenerator } from "@/lib/ai-quiz-generator";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, questionCount } = await request.json();

    // Input validation
    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Invalid or missing topic." }, { status: 400 });
    }

    if (!difficulty || typeof difficulty !== "string") {
      return NextResponse.json({ error: "Invalid or missing difficulty." }, { status: 400 });
    }

    const count = Number(questionCount) > 0 ? Number(questionCount) : 5;

    // Simulate processing delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const questions = await aiQuizGenerator.generateQuiz({
      topic,
      difficulty,
      questionCount: count,
    });

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        topic,
        difficulty,
        questionCount: questions.length,
        generatedAt: new Date().toISOString(),
        engine: "AI Quiz Generator v1.0",
        uniqueConcepts: [...new Set(questions.map(q => q.concept || topic))].length,
      },
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the quiz." },
      { status: 500 }
    );
  }
}
