import { type NextRequest, NextResponse } from "next/server";
import { enhancedQuizGenerator } from "@/lib/enhanced-quiz-generator";

export async function POST(request: NextRequest) {
  try {
    const { subject, gradeLevel, topics } = await request.json();

    // Validate required fields
    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Subject is required and must be a string." }, { status: 400 });
    }
    if (!gradeLevel || typeof gradeLevel !== "string") {
      return NextResponse.json({ error: "Grade level is required and must be a string." }, { status: 400 });
    }
    if (!Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: "Topics must be a non-empty array." }, { status: 400 });
    }

    // Simulate loading for UX
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Generate diagnostic test
    const questions = enhancedQuizGenerator.generateDiagnosticTest(subject, gradeLevel, topics);

    // Prepare metadata
    const metadata = {
      subject,
      gradeLevel,
      topicsAssessed: topics,
      generatedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      assessmentType: "Comprehensive Diagnostic",
      generator: "Enhanced Diagnostic Algorithm v1.5",
      uniqueConcepts: [...new Set(questions.map((q) => q.concept))].length,
    };

    // Return response
    return NextResponse.json({
      success: true,
      questions,
      metadata,
    });

  } catch (error) {
    console.error("Error generating diagnostic test:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while generating the diagnostic test." },
      { status: 500 }
    );
  }
}
