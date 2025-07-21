import { type NextRequest, NextResponse } from "next/server";
import { enhancedQuizGenerator } from "@/lib/enhanced-quiz-generator";

export async function POST(request: NextRequest) {
  try {
    const config = await request.json() as {
      subject?: string;
      topic?: string;
      difficulty?: string;
      questionCount?: number;
      timeLimit?: number;
      [key: string]: any;
    };

    // Step 1: Validate required input fields
    if (!config.subject?.trim() || !config.topic?.trim()) {
      return NextResponse.json(
        { error: "Both 'subject' and 'topic' fields are required." },
        { status: 400 }
      );
    }

    // Step 2: Simulate loading time for UX effect
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Step 3: Generate quiz using the enhanced algorithm
    const questions = enhancedQuizGenerator.generateQuiz(config);

    // Step 4: Build metadata for response
    const metadata = {
      config,
      generatedAt: new Date().toISOString(),
      estimatedTime: config.timeLimit ?? "Not specified",
      generator: "Enhanced Algorithm v2.0",
      totalConcepts: questions.length,
      uniqueTopics: [...new Set(questions.map((q) => q.concept))].length,
    };

    return NextResponse.json({
      success: true,
      questions,
      metadata,
    });

  } catch (error) {
    console.error("[Quiz Generation Error]", error);
    return NextResponse.json(
      { error: "An internal error occurred while generating the quiz." },
      { status: 500 }
    );
  }
}
