"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import { mockUsers, mockCourses } from "@/lib/mock-data"
import type { User, QuizAttempt, DiagnosticResult } from "@/lib/types"
import { Users, BookOpen, TrendingUp, LogOut, Brain, CheckCircle, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function EducatorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<User[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "educator") {
      router.push("/")
      return
    }

    setUser(currentUser)

    // Load students (filter mock users for students only)
    const studentUsers = mockUsers.filter((u) => u.role === "student")
    setStudents(studentUsers)

    // Load quiz attempts and diagnostic results
    setQuizAttempts(StorageService.getQuizAttempts())
    setDiagnosticResults(StorageService.getDiagnosticResults())
  }, [router])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  // Analytics calculations
  const getAverageScore = () => {
    if (quizAttempts.length === 0) return 0
    const total = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
    return Math.round(total / quizAttempts.length)
  }

  const getTopPerformers = () => {
    const studentScores: { [studentId: string]: number[] } = {}

    quizAttempts.forEach((attempt) => {
      if (!studentScores[attempt.studentId]) {
        studentScores[attempt.studentId] = []
      }
      studentScores[attempt.studentId].push(attempt.score)
    })

    return Object.entries(studentScores)
      .map(([studentId, scores]) => {
        const student = students.find((s) => s.id === studentId)
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
        return {
          student,
          avgScore: Math.round(avgScore),
          quizCount: scores.length,
        }
      })
      .filter((item) => item.student)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5)
  }

  const getWeakAreas = () => {
    const topicCounts: { [topic: string]: { total: number; weak: number } } = {}

    diagnosticResults.forEach((result) => {
      // SAFETY: skip if topicScores is missing or not an object
      if (!result || typeof result.topicScores !== "object" || result.topicScores === null) return

      Object.entries(result.topicScores as Record<string, number>).forEach(([topic, score]) => {
        if (!topicCounts[topic]) {
          topicCounts[topic] = { total: 0, weak: 0 }
        }
        topicCounts[topic].total++
        if (score < 60) {
          topicCounts[topic].weak++
        }
      })
    })

    return Object.entries(topicCounts)
      .map(([topic, counts]) => ({
        topic,
        weakPercentage: Math.round((counts.weak / counts.total) * 100),
        studentCount: counts.total,
      }))
      .filter((item) => item.weakPercentage > 0)
      .sort((a, b) => b.weakPercentage - a.weakPercentage)
      .slice(0, 5)
  }

  const getPerformanceData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const dayAttempts = quizAttempts.filter((attempt) => attempt.completedAt.toISOString().split("T")[0] === date)

      const avgScore =
        dayAttempts.length > 0
          ? Math.round(dayAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / dayAttempts.length)
          : 0

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        avgScore,
        attempts: dayAttempts.length,
      }
    })
  }

  const getCoursePerformance = () => {
    return mockCourses
      .map((course) => {
        const courseAttempts = quizAttempts.filter((attempt) => attempt.quizId.includes(course.id))
        const avgScore =
          courseAttempts.length > 0
            ? Math.round(courseAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / courseAttempts.length)
            : 0

        return {
          name: course.name.split(" ")[0], // Shortened name for chart
          score: avgScore,
          attempts: courseAttempts.length,
        }
      })
      .filter((item) => item.attempts > 0)
  }

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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduTutor AI</h1>
                <p className="text-sm text-gray-600">Educator Dashboard</p>
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
          <p className="text-gray-600">Monitor student progress and gain insights into learning patterns</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{mockCourses.length}</p>
                  <p className="text-sm text-gray-600">Active Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{quizAttempts.length}</p>
                  <p className="text-sm text-gray-600">Quizzes Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{getAverageScore()}%</p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Trend</CardTitle>
                  <CardDescription>Average quiz scores over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getPerformanceData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Average scores by course</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCoursePerformance()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers and Weak Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with highest average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  {getTopPerformers().length > 0 ? (
                    <div className="space-y-3">
                      {getTopPerformers().map((performer, index) => (
                        <div
                          key={performer.student?.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{performer.student?.name}</p>
                              <p className="text-sm text-gray-600">{performer.quizCount} quizzes</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600">{performer.avgScore}%</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No quiz data available yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Areas Needing Attention</CardTitle>
                  <CardDescription>Topics where students struggle most</CardDescription>
                </CardHeader>
                <CardContent>
                  {getWeakAreas().length > 0 ? (
                    <div className="space-y-3">
                      {getWeakAreas().map((area) => (
                        <div key={area.topic} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{area.topic}</span>
                            <Badge variant="destructive">{area.weakPercentage}% struggling</Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {area.studentCount} students assessed
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No diagnostic data available yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Individual student progress and quiz history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => {
                    const studentAttempts = quizAttempts.filter((a) => a.studentId === student.id)
                    const avgScore =
                      studentAttempts.length > 0
                        ? Math.round(studentAttempts.reduce((sum, a) => sum + a.score, 0) / studentAttempts.length)
                        : 0
                    const diagnostic = diagnosticResults.find((d) => d.studentId === student.id)

                    return (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-blue-600">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{student.name}</h3>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{avgScore}%</p>
                            <p className="text-sm text-gray-600">Avg Score</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Quizzes Taken</p>
                            <p className="font-semibold">{studentAttempts.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Diagnostic Score</p>
                            <p className="font-semibold">{diagnostic?.overallScore || "Not taken"}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Last Activity</p>
                            <p className="font-semibold">
                              {studentAttempts.length > 0
                                ? new Date(studentAttempts[studentAttempts.length - 1].completedAt).toLocaleDateString()
                                : "No activity"}
                            </p>
                          </div>
                        </div>

                        {diagnostic && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                {/* Strong areas */}
                                <span className="text-green-600">Strong: </span>
                                {Array.isArray(diagnostic?.strongAreas) && diagnostic.strongAreas.length
                                  ? diagnostic.strongAreas.join(", ")
                                  : "None identified"}
                              </div>
                              <div>
                                {/* Weak areas */}
                                <span className="text-orange-600">Weak: </span>
                                {Array.isArray(diagnostic?.weakAreas) && diagnostic.weakAreas.length
                                  ? diagnostic.weakAreas.join(", ")
                                  : "None identified"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCourses.map((course) => {
                      const courseAttempts = quizAttempts.filter((a) => a.quizId.includes(course.id))
                      const completionRate = Math.round((courseAttempts.length / (students.length * 2)) * 100) // Assuming 2 quizzes per course

                      return (
                        <div key={course.id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{course.name}</span>
                            <span className="text-sm">{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        range: "90-100%",
                        count: quizAttempts.filter((a) => a.score >= 90).length,
                        color: "bg-green-500",
                      },
                      {
                        range: "80-89%",
                        count: quizAttempts.filter((a) => a.score >= 80 && a.score < 90).length,
                        color: "bg-blue-500",
                      },
                      {
                        range: "70-79%",
                        count: quizAttempts.filter((a) => a.score >= 70 && a.score < 80).length,
                        color: "bg-yellow-500",
                      },
                      {
                        range: "60-69%",
                        count: quizAttempts.filter((a) => a.score >= 60 && a.score < 70).length,
                        color: "bg-orange-500",
                      },
                      {
                        range: "Below 60%",
                        count: quizAttempts.filter((a) => a.score < 60).length,
                        color: "bg-red-500",
                      },
                    ].map((item) => (
                      <div key={item.range} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm">{item.range}</span>
                        </div>
                        <span className="text-sm font-medium">{item.count} quizzes</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>Automated recommendations based on student data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-900">Learning Pattern Detected</h4>
                    </div>
                    <p className="text-sm text-blue-800">
                      Students perform 15% better on quizzes taken in the morning. Consider scheduling important
                      assessments earlier in the day.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-900">Success Pattern</h4>
                    </div>
                    <p className="text-sm text-green-800">
                      Students who take diagnostic tests show 23% improvement in subsequent quiz scores. Encourage all
                      students to complete diagnostics.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      <h4 className="font-medium text-orange-900">Attention Needed</h4>
                    </div>
                    <p className="text-sm text-orange-800">
                      Quiz engagement drops after question 7. Consider shorter quiz formats or breaking complex topics
                      into smaller segments.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personalization Recommendations</CardTitle>
                  <CardDescription>Suggestions to improve individual student outcomes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {students.slice(0, 3).map((student) => {
                    const diagnostic = diagnosticResults.find((d) => d.studentId === student.id)
                    const attempts = quizAttempts.filter((a) => a.studentId === student.id)

                    return (
                      <div key={student.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">{student.name}</h4>
                        <div className="text-sm space-y-1">
                          {Array.isArray(diagnostic?.weakAreas) && diagnostic.weakAreas.length > 0 ? (
                            <p className="text-orange-600">• Focus on: {diagnostic.weakAreas.slice(0, 2).join(", ")}</p>
                          ) : null}
                          {attempts.length > 0 ? (
                            <p className="text-blue-600">
                              • Recommended difficulty:{" "}
                              {attempts[attempts.length - 1].score >= 80
                                ? "Advanced"
                                : attempts[attempts.length - 1].score >= 60
                                  ? "Intermediate"
                                  : "Beginner"}
                            </p>
                          ) : (
                            <p className="text-gray-600">• Encourage to start with diagnostic test</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
