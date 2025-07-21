"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { mockUsers, mockDiagnosticResults } from "@/lib/mock-data"
import type { User, DiagnosticResult } from "@/lib/types"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react"

export default function AdaptiveDemoPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [aliceData, setAliceData] = useState<DiagnosticResult | null>(null)
  const [marcusData, setMarcusData] = useState<DiagnosticResult | null>(null)

  useEffect(() => {
    // Load diagnostic data for both students
    setAliceData(mockDiagnosticResults["1"]) // Alice
    setMarcusData(mockDiagnosticResults["4"]) // Marcus

    const user = AuthService.getCurrentUser()
    setCurrentUser(user)
  }, [])

  const switchToStudent = (studentId: string) => {
    const student = mockUsers.find((u) => u.id === studentId && u.role === "student")
    if (student) {
      AuthService.login(student.email, "password")
      setCurrentUser(student)
    }
  }

  const getAdaptiveRecommendations = (diagnostic: DiagnosticResult) => {
    const isHighPerformer = diagnostic.overallScore >= 80
    const isStruggling = diagnostic.overallScore < 60

    if (isHighPerformer) {
      return {
        quizDifficulty: "Advanced",
        timeLimit: "Standard (5 min)",
        questionTypes: "Complex problem-solving, multi-step equations",
        encouragement: "Challenge yourself with advanced concepts!",
        nextSteps: [
          "Try advanced difficulty quizzes",
          "Explore cross-topic connections",
          "Consider peer tutoring opportunities",
        ],
        color: "green",
      }
    } else if (isStruggling) {
      return {
        quizDifficulty: "Beginner",
        timeLimit: "Extended (8 min)",
        questionTypes: "Step-by-step guidance, foundational concepts",
        encouragement: "Take your time - every step forward counts!",
        nextSteps: ["Focus on fundamental concepts", "Use extended time limits", "Review explanations carefully"],
        color: "orange",
      }
    } else {
      return {
        quizDifficulty: "Intermediate",
        timeLimit: "Standard (5 min)",
        questionTypes: "Balanced mix of concepts and applications",
        encouragement: "You're making steady progress!",
        nextSteps: ["Continue with intermediate level", "Strengthen weak areas", "Build on existing knowledge"],
        color: "blue",
      }
    }
  }

  const StudentProfile = ({ student, diagnostic }: { student: User; diagnostic: DiagnosticResult }) => {
    const recommendations = getAdaptiveRecommendations(diagnostic)
    const isCurrentUser = currentUser?.id === student.id

    return (
      <Card
        className={`transition-all duration-300 ${isCurrentUser ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  diagnostic.overallScore >= 80
                    ? "bg-green-500"
                    : diagnostic.overallScore < 60
                      ? "bg-orange-500"
                      : "bg-blue-500"
                }`}
              >
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <CardDescription>{student.email}</CardDescription>
              </div>
            </div>
            {isCurrentUser && <Badge className="bg-blue-600">Current User</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Performance Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${
                  diagnostic.overallScore >= 80
                    ? "text-green-600"
                    : diagnostic.overallScore < 60
                      ? "text-orange-600"
                      : "text-blue-600"
                }`}
              >
                {diagnostic.overallScore}%
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{diagnostic.strongAreas.length}</div>
              <p className="text-sm text-gray-600">Strong Areas</p>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {diagnostic.overallScore >= 80 ? (
              <>
                <TrendingUp className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-600">High Performer</Badge>
              </>
            ) : diagnostic.overallScore < 60 ? (
              <>
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <Badge className="bg-orange-600">Needs Support</Badge>
              </>
            ) : (
              <>
                <Target className="h-5 w-5 text-blue-600" />
                <Badge className="bg-blue-600">Average Performer</Badge>
              </>
            )}
          </div>

          {/* Adaptive Features */}
          <div className={`p-4 rounded-lg border-2 border-${recommendations.color}-200 bg-${recommendations.color}-50`}>
            <h4 className={`font-semibold text-${recommendations.color}-900 mb-2 flex items-center`}>
              <Brain className="h-4 w-4 mr-2" />
              Adaptive Learning Features
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Quiz Difficulty:</span>
                <span className={`text-${recommendations.color}-700`}>{recommendations.quizDifficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time Limit:</span>
                <span className={`text-${recommendations.color}-700`}>{recommendations.timeLimit}</span>
              </div>
              <div>
                <span className="font-medium">Question Style:</span>
                <p className={`text-${recommendations.color}-700 mt-1`}>{recommendations.questionTypes}</p>
              </div>
            </div>
          </div>

          {/* Encouragement Message */}
          <div className={`p-3 rounded-lg bg-${recommendations.color}-100 border border-${recommendations.color}-200`}>
            <p className={`text-${recommendations.color}-800 font-medium text-center`}>
              {recommendations.encouragement}
            </p>
          </div>

          {/* Strong & Weak Areas */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <h5 className="font-medium text-green-700 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Strong Areas ({diagnostic.strongAreas.length})
              </h5>
              <div className="flex flex-wrap gap-1">
                {diagnostic.strongAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs border-green-300 text-green-700">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-orange-700 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Areas to Improve ({diagnostic.weakAreas.length})
              </h5>
              <div className="flex flex-wrap gap-1">
                {diagnostic.weakAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs border-orange-300 text-orange-700">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => switchToStudent(student.id)}
            className={`w-full ${isCurrentUser ? "bg-gray-400" : `bg-${recommendations.color}-600 hover:bg-${recommendations.color}-700`}`}
            disabled={isCurrentUser}
          >
            {isCurrentUser ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Currently Active
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Switch to {student.name.split(" ")[0]}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!aliceData || !marcusData) {
    return <div className="flex items-center justify-center min-h-screen">Loading adaptive demo...</div>
  }

  const alice = mockUsers.find((u) => u.id === "1")!
  const marcus = mockUsers.find((u) => u.id === "4")!

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Adaptive Learning Demo</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how EduTutor AI adapts to different student performance levels. Switch between Alice (high performer)
              and Marcus (struggling student) to experience personalized learning.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Comparison Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2 text-blue-600" />
              Adaptive Learning Comparison
            </CardTitle>
            <CardDescription>
              How the AI system personalizes the learning experience based on student performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">High Performers</h3>
                <p className="text-sm text-green-700 mt-1">
                  Advanced difficulty, challenging problems, accelerated pace
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Average Students</h3>
                <p className="text-sm text-blue-700 mt-1">Balanced approach, mixed difficulty, steady progression</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900">Struggling Students</h3>
                <p className="text-sm text-orange-700 mt-1">Foundational focus, extended time, step-by-step guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <StudentProfile student={alice} diagnostic={aliceData} />
          <StudentProfile student={marcus} diagnostic={marcusData} />
        </div>

        {/* Current User Experience */}
        {currentUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-blue-600" />
                Your Current Experience as {currentUser.name}
              </CardTitle>
              <CardDescription>Based on your performance profile, here's what you'll see in the app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Dashboard Features</h4>
                  <ul className="space-y-2 text-sm">
                    {currentUser.id === "1" ? (
                      <>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Advanced course recommendations
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Challenge-level quizzes suggested
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Peer tutoring opportunities
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                          Foundational topics prioritized
                        </li>
                        <li className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                          Extended time limits offered
                        </li>
                        <li className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                          Step-by-step explanations
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quiz Experience</h4>
                  <ul className="space-y-2 text-sm">
                    {currentUser.id === "1" ? (
                      <>
                        <li className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          Complex, multi-step problems
                        </li>
                        <li className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          Advanced difficulty by default
                        </li>
                        <li className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          Conceptual connections highlighted
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center">
                          <TrendingDown className="h-4 w-4 text-orange-600 mr-2" />
                          Clear, step-by-step questions
                        </li>
                        <li className="flex items-center">
                          <TrendingDown className="h-4 w-4 text-orange-600 mr-2" />
                          Beginner difficulty recommended
                        </li>
                        <li className="flex items-center">
                          <TrendingDown className="h-4 w-4 text-orange-600 mr-2" />
                          Encouraging feedback messages
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="/student">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Experience Your Personalized Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
