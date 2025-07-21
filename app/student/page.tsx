"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import { mockCourses } from "@/lib/mock-data"
import type { User, Course, DiagnosticResult } from "@/lib/types"
import {
  BookOpen,
  Brain,
  TrendingUp,
  Award,
  LogOut,
  FolderSyncIcon as Sync,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null)
  const [isGoogleClassroomSynced, setIsGoogleClassroomSynced] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }

    setUser(currentUser)

    // Load diagnostic result
    const diagnostic = StorageService.getStudentDiagnosticResult(currentUser.id)
    setDiagnosticResult(diagnostic)

    // If no diagnostic result, redirect to diagnostic test
    if (!diagnostic) {
      router.push("/student/diagnostic")
      return
    }

    // Load courses (simulated Google Classroom sync)
    setCourses(mockCourses)
  }, [router])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  const simulateGoogleClassroomSync = async () => {
    setIsSyncing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGoogleClassroomSynced(true)
    setIsSyncing(false)
  }

  const getQuizAttempts = () => {
    if (!user) return []
    return StorageService.getStudentQuizAttempts(user.id)
  }

  const getAverageScore = () => {
    const attempts = getQuizAttempts()
    if (attempts.length === 0) return 0
    const total = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    return Math.round(total / attempts.length)
  }

  const getRecommendedCourses = () => {
    if (!diagnosticResult) return courses.slice(0, 3)

    // Recommend courses based on weak areas
    const strongAreas = diagnosticResult?.strongAreas ?? []
    const weakAreas = diagnosticResult?.weakAreas ?? []

    return courses
      .filter((course) =>
        weakAreas.some((area) => course.topics.some((topic) => topic.toLowerCase().includes(area.toLowerCase()))),
      )
      .slice(0, 3)
  }

  const strongAreas = diagnosticResult?.strongAreas ?? []
  const weakAreas = diagnosticResult?.weakAreas ?? []

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

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
                <h1 className="text-xl font-bold text-gray-900">EduTutor AI</h1>
                <p className="text-sm text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">Continue your personalized learning journey</p>
        </div>

        {/* Google Classroom Sync */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sync className="h-5 w-5 mr-2" />
              Google Classroom Integration
            </CardTitle>
            <CardDescription>Sync your courses and assignments from Google Classroom</CardDescription>
          </CardHeader>
          <CardContent>
            {!isGoogleClassroomSynced ? (
              <Button
                onClick={simulateGoogleClassroomSync}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSyncing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Syncing...
                  </>
                ) : (
                  <>
                    <Sync className="h-4 w-4 mr-2" />
                    Connect Google Classroom
                  </>
                )}
              </Button>
            ) : (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Successfully synced with Google Classroom</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{getQuizAttempts().length}</p>
                  <p className="text-sm text-gray-600">Quizzes Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{getAverageScore()}%</p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{diagnosticResult?.strongAreas?.length ?? 0}</p>
                  <p className="text-sm text-gray-600">Strong Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>Select a course to start taking quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{course.name}</h3>
                        <Badge variant="secondary">{course.subject}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {course.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {course.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/student/quiz?courseId=${course.id}`}>Start Quiz</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Quiz Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {getQuizAttempts().length > 0 ? (
                  <div className="space-y-3">
                    {getQuizAttempts()
                      .slice(-5)
                      .reverse()
                      .map((attempt) => (
                        <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Quiz #{attempt.id.slice(-6)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{attempt.score}%</p>
                            <Badge
                              variant={attempt.score >= 70 ? "default" : "destructive"}
                              className={attempt.score >= 70 ? "bg-green-600" : ""}
                            >
                              {attempt.score >= 70 ? "Pass" : "Needs Improvement"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No quizzes taken yet</p>
                    <p className="text-sm">Start with a course above to begin learning!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Diagnostic Results */}
            {diagnosticResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Learning Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-sm font-bold">{diagnosticResult.overallScore}%</span>
                    </div>
                    <Progress value={diagnosticResult.overallScore} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Strong Areas</h4>
                    <div className="space-y-1">
                      {strongAreas.length > 0 ? (
                        strongAreas.map((area) => (
                          <div key={area} className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            {area}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No strong areas yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-600 mb-2">Areas to Improve</h4>
                    <div className="space-y-1">
                      {weakAreas.length > 0 ? (
                        weakAreas.map((area) => (
                          <div key={area} className="flex items-center text-sm">
                            <AlertCircle className="h-3 w-3 text-orange-600 mr-2" />
                            {area}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No weak areas detected</p>
                      )}
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/student/diagnostic">Retake Diagnostic</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your learning profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecommendedCourses().map((course) => (
                    <div key={course.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">{course.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{course.subject}</p>
                      <Button asChild size="sm" className="w-full mt-2">
                        <Link href={`/student/quiz?courseId=${course.id}`}>Start Learning</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/student/diagnostic">
                    <Brain className="h-4 w-4 mr-2" />
                    Take Diagnostic Test
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/student/progress">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
