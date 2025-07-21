"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import { aiQuizGenerator } from "@/lib/ai-quiz-generator"
import { mockCourses } from "@/lib/mock-data"
import type { User, Course, Quiz, QuizAttempt } from "@/lib/types"
import { Brain, Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Home } from "lucide-react"

type QuizStep = "setup" | "generating" | "quiz" | "results"

export default function QuizPage() {
  const [user, setUser] = useState<User | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [step, setStep] = useState<QuizStep>("setup")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }
    setUser(currentUser)

    // Load course
    if (courseId) {
      const foundCourse = mockCourses.find((c) => c.id === courseId)
      if (foundCourse) {
        setCourse(foundCourse)
      }
    }
  }, [router, courseId])

  // Timer effect
  useEffect(() => {
    if (step === "quiz" && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && step === "quiz") {
      handleSubmitQuiz()
    }
  }, [timeRemaining, step])

  const handleGenerateQuiz = async () => {
    if (!selectedTopic || !selectedDifficulty || !user) return

    setIsGenerating(true)
    setStep("generating")
    setGenerationProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 20
      })
    }, 300)

    try {
      // Get recommended difficulty from diagnostic if available
      const diagnosticResult = StorageService.getStudentDiagnosticResult(user.id)
      const difficulty = diagnosticResult?.recommendedDifficulty || selectedDifficulty

      const questions = await aiQuizGenerator.generateQuiz({
        topic: selectedTopic,
        difficulty,
        questionCount: 5,
      })

      const newQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        courseId: courseId || "",
        topic: selectedTopic,
        difficulty,
        questions,
        timeLimit: 300, // 5 minutes
        createdAt: new Date(),
      }

      setQuiz(newQuiz)
      setTimeRemaining(newQuiz.timeLimit)
      setQuizStartTime(new Date())
      setGenerationProgress(100)

      setTimeout(() => {
        setStep("quiz")
        setIsGenerating(false)
      }, 1000)
    } catch (error) {
      console.error("Error generating quiz:", error)
      setIsGenerating(false)
      setStep("setup")
    }

    clearInterval(progressInterval)
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    if (!quiz || !user || !quizStartTime) return

    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const timeSpent = Math.round((Date.now() - quizStartTime.getTime()) / 1000)

    // Save quiz attempt
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId: quiz.id,
      studentId: user.id,
      answers,
      score,
      completedAt: new Date(),
      timeSpent,
    }

    StorageService.saveQuizAttempt(attempt)
    setStep("results")
  }

  const calculateResults = () => {
    if (!quiz) return { score: 0, correct: 0, total: 0 }

    let correct = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++
      }
    })

    return {
      score: Math.round((correct / quiz.questions.length) * 100),
      correct,
      total: quiz.questions.length,
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const resetQuiz = () => {
    setStep("setup")
    setQuiz(null)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeRemaining(0)
    setQuizStartTime(null)
    setSelectedTopic("")
    setSelectedDifficulty("beginner")
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Setup Step
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => router.push("/student")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-xl font-bold">Quiz Generator</h1>
                  <p className="text-sm text-gray-600">{course?.name || "Select Course"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-blue-600" />
                  Create Your Personalized Quiz
                </CardTitle>
                <CardDescription>
                  Select a topic and difficulty level to generate an AI-powered quiz tailored to your learning needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Selection */}
                <div>
                  <Label className="text-base font-medium">Select Topic</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a topic to study" />
                    </SelectTrigger>
                    <SelectContent>
                      {course?.topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <Label className="text-base font-medium">Difficulty Level</Label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") => setSelectedDifficulty(value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Beginner - Foundation concepts
                        </div>
                      </SelectItem>
                      <SelectItem value="intermediate">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          Intermediate - Applied knowledge
                        </div>
                      </SelectItem>
                      <SelectItem value="advanced">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Advanced - Complex problems
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quiz Preview */}
                {selectedTopic && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Quiz Preview</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Topic: {selectedTopic}</p>
                      <p>• Difficulty: {selectedDifficulty}</p>
                      <p>• Questions: 5 multiple choice</p>
                      <p>• Time limit: 5 minutes</p>
                      <p>• AI-generated questions with instant feedback</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerateQuiz}
                  disabled={!selectedTopic || !selectedDifficulty}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Generating Step
  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">Generating Your Quiz</h2>
            <p className="text-gray-600 mb-4">
              AI is creating personalized {selectedTopic} questions at {selectedDifficulty} level...
            </p>
            <Progress value={generationProgress} className="w-full mb-2" />
            <p className="text-sm text-gray-500">{Math.round(generationProgress)}% complete</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Step
  if (step === "quiz" && quiz) {
    const currentQ = quiz.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="font-semibold">{quiz.topic} Quiz</h1>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </p>
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
                <Badge variant="outline">{quiz.difficulty}</Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
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

                <div className="flex items-center justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentQuestion === quiz.questions.length - 1 ? (
                    <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                      Submit Quiz
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
          </div>
        </div>
      </div>
    )
  }

  // Results Step
  if (step === "results" && quiz) {
    const results = calculateResults()

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <CardDescription>
                {quiz.topic} - {quiz.difficulty} level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{results.score}%</div>
                <p className="text-gray-600 mb-4">
                  {results.correct} out of {results.total} questions correct
                </p>
                <Badge
                  className={`text-lg px-4 py-2 ${
                    results.score >= 70 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {results.score >= 70 ? "Pass" : "Needs Improvement"}
                </Badge>
              </div>

              {/* Question Review */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Question Review</h3>
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => {
                    const userAnswer = answers[question.id]
                    const isCorrect = userAnswer === question.correctAnswer

                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">
                              Question {index + 1}: {question.question}
                            </p>
                            <div className="text-sm space-y-1">
                              <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                                Your answer: {userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}
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
              </div>

              {/* Recommendations */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="text-sm space-y-1">
                  {results.score >= 70 ? (
                    <>
                      <li>• Great job! You have a solid understanding of {quiz.topic}</li>
                      <li>• Consider trying a more advanced difficulty level</li>
                      <li>• Explore related topics to broaden your knowledge</li>
                    </>
                  ) : (
                    <>
                      <li>• Review the explanations above to understand the concepts better</li>
                      <li>• Practice more questions on {quiz.topic}</li>
                      <li>• Consider studying the fundamentals before retaking</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button onClick={() => router.push("/student")}>
                  <Home className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
