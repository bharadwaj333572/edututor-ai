"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

interface QuizData {
  id: string
  courseName: string
  topic: string
  questions: Question[]
  timeLimit: number
}

export default function QuizPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Simulate AI quiz generation
    const generateQuiz = async () => {
      setIsGenerating(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const courseNames: { [key: string]: string } = {
        "1": "Advanced Mathematics",
        "2": "Physics Fundamentals",
        "3": "Computer Science",
      }

      const sampleQuestions: Question[] = [
        {
          id: "1",
          question: "What is the derivative of x² + 3x + 2?",
          options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
          correctAnswer: 0,
          explanation: "The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0.",
          difficulty: "medium",
        },
        {
          id: "2",
          question: "Which of the following is a fundamental theorem of calculus?",
          options: [
            "The limit of a function exists",
            "The integral and derivative are inverse operations",
            "All functions are continuous",
            "Polynomials have finite derivatives",
          ],
          correctAnswer: 1,
          explanation:
            "The Fundamental Theorem of Calculus establishes the relationship between differentiation and integration.",
          difficulty: "hard",
        },
        {
          id: "3",
          question: "What is the integral of 2x?",
          options: ["x²", "x² + C", "2", "2x + C"],
          correctAnswer: 1,
          explanation: "The integral of 2x is x² + C, where C is the constant of integration.",
          difficulty: "easy",
        },
      ]

      setQuiz({
        id: courseId,
        courseName: courseNames[courseId] || "Unknown Course",
        topic: "Calculus Fundamentals",
        questions: sampleQuestions,
        timeLimit: 15 * 60, // 15 minutes
      })

      setTimeRemaining(15 * 60)
      setIsGenerating(false)
    }

    generateQuiz()
  }, [courseId])

  useEffect(() => {
    if (timeRemaining > 0 && !showResults && !isGenerating) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmitQuiz()
    }
  }, [timeRemaining, showResults, isGenerating])

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let correct = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Generating Your Personalized Quiz</h2>
            <p className="text-gray-600 mb-4">
              AI is analyzing your learning progress and creating tailored questions...
            </p>
            <Progress value={66} className="w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return <div>Loading...</div>
  }

  if (showResults) {
    const score = calculateScore()
    const correctAnswers = quiz.questions.filter((q) => answers[q.id] === q.correctAnswer).length

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/student" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <CardDescription>
                {quiz.courseName} - {quiz.topic}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
                <p className="text-gray-600">
                  {correctAnswers} out of {quiz.questions.length} questions correct
                </p>
                <Badge
                  variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
                  className={`mt-2 ${score >= 80 ? "bg-green-600" : ""}`}
                >
                  {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Practicing!"}
                </Badge>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            Question {index + 1}: {question.question}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p className={`${isCorrect ? "text-green-600" : "text-red-600"}`}>
                              Your answer: {question.options[userAnswer] || "Not answered"}
                            </p>
                            {!isCorrect && (
                              <p className="text-green-600">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 text-center">
                <Button asChild>
                  <Link href="/student">Return to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/student" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
            </div>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold">{quiz.courseName}</h1>
              <Badge variant="secondary">{quiz.topic}</Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                <Badge
                  variant={
                    currentQ.difficulty === "easy"
                      ? "secondary"
                      : currentQ.difficulty === "medium"
                        ? "default"
                        : "destructive"
                  }
                >
                  {currentQ.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-base">{currentQ.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.id]?.toString()}
                onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
