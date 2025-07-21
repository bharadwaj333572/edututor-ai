"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import { diagnosticQuestions } from "@/lib/mock-data"
import type { DiagnosticResult, User } from "@/lib/types"
import { Brain, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

export default function DiagnosticTest() {
  const [user, setUser] = useState<User | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({})
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isCompleted) {
      handleSubmit()
    }
  }, [timeRemaining, isCompleted])

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    if (!user) return

    // Calculate results
    let correctAnswers = 0
    const topicScores: { [topic: string]: { correct: number; total: number } } = {}

    diagnosticQuestions.forEach((question) => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      if (isCorrect) correctAnswers++

      if (!topicScores[question.topic]) {
        topicScores[question.topic] = { correct: 0, total: 0 }
      }
      topicScores[question.topic].total++
      if (isCorrect) topicScores[question.topic].correct++
    })

    const overallScore = Math.round((correctAnswers / diagnosticQuestions.length) * 100)

    // Calculate topic percentages
    const topicPercentages: { [topic: string]: number } = {}
    Object.entries(topicScores).forEach(([topic, scores]) => {
      topicPercentages[topic] = Math.round((scores.correct / scores.total) * 100)
    })

    // Determine strong and weak areas
    const strongAreas = Object.entries(topicPercentages)
      .filter(([_, score]) => score >= 80)
      .map(([topic, _]) => topic)

    const weakAreas = Object.entries(topicPercentages)
      .filter(([_, score]) => score < 60)
      .map(([topic, _]) => topic)

    // Determine recommended difficulty
    let recommendedDifficulty: "beginner" | "intermediate" | "advanced" = "intermediate"
    if (overallScore >= 80) {
      recommendedDifficulty = "advanced"
    } else if (overallScore < 50) {
      recommendedDifficulty = "beginner"
    }

    const diagnosticResult: DiagnosticResult = {
      studentId: user.id,
      overallScore,
      topicScores: topicPercentages,
      recommendedDifficulty,
      strongAreas,
      weakAreas,
      completedAt: new Date(),
    }

    // Save result
    StorageService.saveDiagnosticResult(diagnosticResult)
    setResult(diagnosticResult)
    setIsCompleted(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const progress = ((currentQuestion + 1) / diagnosticQuestions.length) * 100

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (isCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Diagnostic Test Complete!</CardTitle>
              <CardDescription>Here's your personalized learning profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{result.overallScore}%</div>
                <p className="text-gray-600">Overall Score</p>
                <Badge className="mt-2" variant={result.overallScore >= 70 ? "default" : "secondary"}>
                  Recommended Level: {result.recommendedDifficulty}
                </Badge>
              </div>

              {/* Topic Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Topic Performance</h3>
                <div className="space-y-3">
                  {Object.entries(result.topicScores).map(([topic, score]) => (
                    <div key={topic}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{topic}</span>
                        <span className="text-sm font-bold">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Strong Areas */}
              {result.strongAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3">Your Strengths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.strongAreas.map((area) => (
                      <div key={area} className="flex items-center p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Areas to Improve */}
              {result.weakAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-3">Areas for Improvement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.weakAreas.map((area) => (
                      <div key={area} className="flex items-center p-2 bg-orange-50 rounded-lg">
                        <Brain className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Personalized Recommendations</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Start with {result.recommendedDifficulty} level quizzes</li>
                  <li>• Focus on improving: {result.weakAreas.join(", ") || "Continue building on your strengths"}</li>
                  <li>
                    • Leverage your strengths in:{" "}
                    {result.strongAreas.join(", ") || "Keep practicing to identify your strengths"}
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={() => router.push("/student")} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = diagnosticQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Diagnostic Test</h1>
                <p className="text-sm text-gray-600">Personalized Learning Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  timeRemaining < 60 ? "bg-red-100 text-red-700 timer-warning" : "bg-gray-100 text-gray-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <Badge variant="outline">
                {currentQuestion + 1} of {diagnosticQuestions.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                <Badge variant="secondary">{currentQ.topic}</Badge>
              </div>
              <CardDescription className="text-base leading-relaxed">{currentQ.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.id]?.toString()}
                onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
              >
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentQuestion === diagnosticQuestions.length - 1 ? (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    Complete Test
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center text-blue-800">
                <Brain className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  This diagnostic test helps us understand your current knowledge level and create a personalized
                  learning path for you.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
