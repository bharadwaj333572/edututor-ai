"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { EduTutorLogo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Share2,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

interface QuizConfig {
  subject: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questionCount: number
  questionTypes: string[]
  timeLimit: number
}

interface GeneratedQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  topic: string
  questionType: string
  concept: string
  improvementAreas: string[]
  encouragement: string
  relatedTopics: string[]
}

interface QuizSession {
  id: string
  config: QuizConfig
  questions: GeneratedQuestion[]
  answers: { [key: string]: number }
  startTime: Date
  currentQuestion: number
  isCompleted: boolean
}

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]

const TOPICS_BY_SUBJECT: { [key: string]: string[] } = {
  Mathematics: ["Algebra", "Geometry", "Calculus", "Statistics", "Trigonometry"],
  Physics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"],
  Chemistry: ["Atomic Structure", "Chemical Bonding", "Thermochemistry"],
  Biology: ["Cell Biology", "Genetics", "Evolution", "Ecology"],
  "Computer Science": ["Programming", "Data Structures", "Algorithms", "Databases"],
}

const QUESTION_TYPES = ["Multiple Choice", "True/False", "Short Answer"]

export default function EnhancedQuizGenerator() {
  const [step, setStep] = useState<"config" | "generating" | "quiz" | "results">("config")
  const [config, setConfig] = useState<QuizConfig>({
    subject: "",
    topic: "",
    difficulty: "intermediate",
    questionCount: 10,
    questionTypes: ["Multiple Choice"],
    timeLimit: 20,
  })
  const [session, setSession] = useState<QuizSession | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Timer effect
  useEffect(() => {
    if (step === "quiz" && timeRemaining > 0 && session && !session.isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && step === "quiz" && session && !session.isCompleted) {
      handleSubmitQuiz()
    }
  }, [timeRemaining, step, session])

  const handleGenerateQuiz = async () => {
    if (!config.subject || !config.topic) return

    setIsGenerating(true)
    setStep("generating")
    setGenerationProgress(0)

    // Enhanced progress simulation
    const progressSteps = [
      { progress: 20, message: "Analyzing topic complexity..." },
      { progress: 40, message: "Selecting appropriate concepts..." },
      { progress: 60, message: "Generating questions..." },
      { progress: 80, message: "Creating detailed explanations..." },
      { progress: 95, message: "Preparing personalized feedback..." },
    ]

    let currentStep = 0
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setGenerationProgress(progressSteps[currentStep].progress)
        currentStep++
      } else {
        clearInterval(progressInterval)
      }
    }, 300)

    try {
      const response = await fetch("/api/generate-custom-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        const data = await response.json()
        const newSession: QuizSession = {
          id: `quiz_${Date.now()}`,
          config,
          questions: data.questions,
          answers: {},
          startTime: new Date(),
          currentQuestion: 0,
          isCompleted: false,
        }

        setSession(newSession)
        setTimeRemaining(config.timeLimit * 60)
        setGenerationProgress(100)

        setTimeout(() => {
          setStep("quiz")
          setIsGenerating(false)
        }, 1000)
      } else {
        throw new Error("Failed to generate quiz")
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      setIsGenerating(false)
      setStep("config")
    }

    clearInterval(progressInterval)
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (!session) return

    setSession((prev) => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [questionId]: answerIndex,
      },
    }))
  }

  const handleNextQuestion = () => {
    if (!session || session.currentQuestion >= session.questions.length - 1) return

    setSession((prev) => ({
      ...prev!,
      currentQuestion: prev!.currentQuestion + 1,
    }))
  }

  const handlePreviousQuestion = () => {
    if (!session || session.currentQuestion <= 0) return

    setSession((prev) => ({
      ...prev!,
      currentQuestion: prev!.currentQuestion - 1,
    }))
  }

  const handleSubmitQuiz = () => {
    if (!session) return

    setSession((prev) => ({
      ...prev!,
      isCompleted: true,
    }))
    setStep("results")
  }

  const calculateResults = () => {
    if (!session) return { score: 0, correct: 0, total: 0, percentage: 0, conceptsLearned: [], areasToImprove: [] }

    let correct = 0
    const conceptsLearned: string[] = []
    const areasToImprove: string[] = []

    session.questions.forEach((question) => {
      const isCorrect = session.answers[question.id] === question.correctAnswer
      if (isCorrect) {
        correct++
        conceptsLearned.push(question.concept)
      } else {
        areasToImprove.push(...question.improvementAreas)
      }
    })

    const total = session.questions.length
    const percentage = Math.round((correct / total) * 100)

    return {
      score: correct,
      correct,
      total,
      percentage,
      conceptsLearned: [...new Set(conceptsLearned)],
      areasToImprove: [...new Set(areasToImprove)],
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const resetQuiz = () => {
    setStep("config")
    setSession(null)
    setIsGenerating(false)
    setGenerationProgress(0)
    setTimeRemaining(0)
  }

  if (step === "config") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/student" className="flex items-center space-x-2">
              <EduTutorLogo className="h-8 w-8" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTutor AI
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="outline">
                <Link href="/student">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-fit">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Enhanced Quiz Generator
                </CardTitle>
                <CardDescription className="text-lg">
                  Create personalized quizzes with detailed explanations and improvement guidance
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Subject Selection */}
                  <div>
                    <Label htmlFor="subject" className="text-base font-medium">
                      Subject *
                    </Label>
                    <Select
                      value={config.subject}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, subject: value, topic: "" }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose your subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topic Selection */}
                  <div>
                    <Label htmlFor="topic" className="text-base font-medium">
                      Topic *
                    </Label>
                    <Select
                      value={config.topic}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, topic: value }))}
                      disabled={!config.subject}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {config.subject &&
                          TOPICS_BY_SUBJECT[config.subject]?.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Difficulty Level */}
                  <div>
                    <Label className="text-base font-medium">Difficulty Level</Label>
                    <Select
                      value={config.difficulty}
                      onValueChange={(value: any) => setConfig((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Beginner - Foundation concepts</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="intermediate">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>Intermediate - Applied knowledge</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="advanced">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Advanced - Complex problems</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Types */}
                  <div>
                    <Label className="text-base font-medium">Question Type</Label>
                    <Select
                      value={config.questionTypes[0]}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, questionTypes: [value] }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <Label className="text-base font-medium">Number of Questions: {config.questionCount}</Label>
                  <Slider
                    value={[config.questionCount]}
                    onValueChange={(value) => setConfig((prev) => ({ ...prev, questionCount: value[0] }))}
                    max={20}
                    min={5}
                    step={1}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5 questions</span>
                    <span>20 questions</span>
                  </div>
                </div>

                {/* Time Limit */}
                <div>
                  <Label className="text-base font-medium">Time Limit: {config.timeLimit} minutes</Label>
                  <Slider
                    value={[config.timeLimit]}
                    onValueChange={(value) => setConfig((prev) => ({ ...prev, timeLimit: value[0] }))}
                    max={60}
                    min={5}
                    step={5}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* Enhanced Quiz Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Your Personalized Quiz Preview
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Subject:</span>
                      <p className="font-medium">{config.subject || "Not selected"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Topic:</span>
                      <p className="font-medium">{config.topic || "Not selected"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Questions:</span>
                      <p className="font-medium">{config.questionCount}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Time:</span>
                      <p className="font-medium">{config.timeLimit} min</p>
                    </div>
                  </div>

                  {config.subject && config.topic && (
                    <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <Lightbulb className="h-4 w-4 inline mr-1" />
                        This quiz will include detailed explanations, personalized feedback, and specific improvement
                        suggestions for {config.topic} concepts.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerateQuiz}
                  disabled={!config.subject || !config.topic}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Generate Enhanced Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-fit animate-pulse">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Creating Your Personalized Quiz</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generating {config.questionCount} expertly crafted questions about {config.topic} with detailed
              explanations and improvement guidance...
            </p>
            <Progress value={generationProgress} className="w-full mb-4" />
            <p className="text-sm text-gray-500">{Math.round(generationProgress)}% complete</p>

            <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <span>Analyzing {config.topic} complexity...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span>Selecting key concepts...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span>Creating detailed explanations...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                <span>Preparing personalized feedback...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "quiz" && session) {
    const currentQ = session.questions[session.currentQuestion]
    const progress = ((session.currentQuestion + 1) / session.questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EduTutorLogo className="h-6 w-6" />
              <div>
                <span className="font-semibold">
                  {config.subject} - {config.topic}
                </span>
                <div className="text-sm text-gray-600 dark:text-gray-400">Concept: {currentQ.concept}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <Badge variant="outline">
                Question {session.currentQuestion + 1} of {session.questions.length}
              </Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {session.currentQuestion + 1}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        currentQ.difficulty === "beginner"
                          ? "secondary"
                          : currentQ.difficulty === "intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {currentQ.difficulty}
                    </Badge>
                    <Badge variant="outline">{currentQ.concept}</Badge>
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">{currentQ.question}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={session.answers[currentQ.id]?.toString()}
                  onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
                >
                  {currentQ.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex items-center justify-between mt-8">
                  <Button variant="outline" onClick={handlePreviousQuestion} disabled={session.currentQuestion === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    {session.currentQuestion === session.questions.length - 1 ? (
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
                </div>
              </CardContent>
            </Card>

            {/* Related Topics Hint */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Related Topics:</span>
                  <span className="text-sm">{currentQ.relatedTopics.join(", ")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "results" && session) {
    const results = calculateResults()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <EduTutorLogo className="h-6 w-6" />
              <span className="font-semibold">Quiz Results & Learning Insights</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Quiz
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-fit">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
                <CardDescription className="text-lg">
                  {config.subject} - {config.topic}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {results.percentage}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {results.correct} out of {results.total} questions correct
                  </p>
                  <Badge
                    className={`px-4 py-2 text-lg ${
                      results.percentage >= 80
                        ? "bg-green-600 hover:bg-green-700"
                        : results.percentage >= 60
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {results.percentage >= 80
                      ? "Excellent Work! 🌟"
                      : results.percentage >= 60
                        ? "Good Progress! 👍"
                        : "Keep Learning! 💪"}
                  </Badge>
                </div>

                {/* Learning Insights */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-green-800 dark:text-green-200">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Concepts You've Mastered
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results.conceptsLearned.length > 0 ? (
                        <div className="space-y-2">
                          {results.conceptsLearned.map((concept, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{concept}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Keep practicing to master more concepts! Every attempt is progress. 🌱
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-blue-800 dark:text-blue-200">
                        <Target className="h-5 w-5 mr-2" />
                        Areas for Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results.areasToImprove.length > 0 ? (
                        <div className="space-y-2">
                          {results.areasToImprove.slice(0, 5).map((area, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Lightbulb className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">{area}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Amazing! You've shown strong understanding across all areas. 🎯
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{session.questions.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.correct}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{results.conceptsLearned.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Concepts Mastered</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{config.timeLimit}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time Allocated</div>
                  </div>
                </div>

                {/* Detailed Question Review */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Detailed Review & Learning Insights
                  </h3>
                  {session.questions.map((question, index) => {
                    const userAnswer = session.answers[question.id]
                    const isCorrect = userAnswer === question.correctAnswer

                    return (
                      <Card
                        key={question.id}
                        className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-3 mb-4">
                            {isCorrect ? (
                              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg">Question {index + 1}</h4>
                                <Badge variant="outline">{question.concept}</Badge>
                              </div>
                              <p className="text-gray-800 dark:text-gray-200 mb-3">{question.question}</p>

                              <div className="space-y-2 text-sm mb-4">
                                <p className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                                  Your answer:{" "}
                                  {userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}
                                </p>
                                {!isCorrect && (
                                  <p className="text-green-600 font-medium">
                                    Correct answer: {question.options[question.correctAnswer]}
                                  </p>
                                )}
                              </div>

                              {/* Detailed Explanation */}
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                                <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                                  <Lightbulb className="h-4 w-4 mr-2" />
                                  Explanation
                                </h5>
                                <p className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</p>
                              </div>

                              {/* Personalized Feedback */}
                              {!isCorrect && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                                  <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center">
                                    <Target className="h-4 w-4 mr-2" />
                                    Areas to Focus On
                                  </h5>
                                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                                    {question.improvementAreas.map((area, areaIndex) => (
                                      <li key={areaIndex} className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                                        <span>{area}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Encouragement */}
                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center">
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Keep Going!
                                </h5>
                                <p className="text-sm text-green-800 dark:text-green-200">{question.encouragement}</p>

                                {question.relatedTopics.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                                      Related topics to explore:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {question.relatedTopics.map((topic, topicIndex) => (
                                        <Badge key={topicIndex} variant="outline" className="text-xs">
                                          {topic}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Next Steps */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Your Learning Journey Continues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Recommended Next Steps:</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Practice more {config.topic} problems</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Review concepts you found challenging</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>
                              Try a{" "}
                              {config.difficulty === "beginner"
                                ? "intermediate"
                                : config.difficulty === "intermediate"
                                  ? "advanced"
                                  : "different topic"}{" "}
                              level quiz
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Study Tips:</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Focus on understanding, not memorizing</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Practice regularly for better retention</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Don't hesitate to ask for help when needed</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Generate New Quiz
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return null
}
