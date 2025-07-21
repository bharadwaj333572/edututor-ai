"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthService } from "@/lib/auth"
import { Brain, BookOpen, Users, BarChart3, GraduationCap, Sparkles } from "lucide-react"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getCurrentUser()
      if (user?.role === "student") {
        router.push("/student")
      } else if (user?.role === "educator") {
        router.push("/educator")
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = AuthService.login(email, password)
      if (user) {
        if (user.role === "student") {
          router.push("/student")
        } else if (user.role === "educator") {
          router.push("/educator")
        }
      } else {
        setError('Invalid credentials. Use password: "password"')
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("password")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Brain className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">EduTutor AI</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Personalized Learning with Generative AI and LMS Integration
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Adaptive Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Educator Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="demo">Quick Demo</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="demo" className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">Try the platform with demo accounts</div>

                  <div className="space-y-4">
                    {/* Student Demo Accounts */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <GraduationCap className="h-3 w-3" />
                        Student Accounts
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => quickLogin("alice@student.edu")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">AJ</span>
                            </div>
                            <div>
                              <div className="font-medium">Alice Johnson</div>
                              <div className="text-xs text-gray-500">High Performer • Math Focus</div>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => quickLogin("bob@student.edu")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-600">BS</span>
                            </div>
                            <div>
                              <div className="font-medium">Bob Smith</div>
                              <div className="text-xs text-gray-500">Average Performer • Science Focus</div>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => quickLogin("emma@student.edu")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-purple-600">EC</span>
                            </div>
                            <div>
                              <div className="font-medium">Emma Chen</div>
                              <div className="text-xs text-gray-500">New Student • Needs Diagnostic</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Educator Demo Accounts */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Educator Accounts
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => quickLogin("sarah@teacher.edu")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-orange-600">SW</span>
                            </div>
                            <div>
                              <div className="font-medium">Dr. Sarah Wilson</div>
                              <div className="text-xs text-gray-500">Mathematics Department</div>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => quickLogin("michael@teacher.edu")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-red-600">MD</span>
                            </div>
                            <div>
                              <div className="font-medium">Prof. Michael Davis</div>
                              <div className="text-xs text-gray-500">Physics Department</div>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => quickLogin("lisa@teacher.edu")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-teal-600">LT</span>
                            </div>
                            <div>
                              <div className="font-medium">Dr. Lisa Thompson</div>
                              <div className="text-xs text-gray-500">Biology Department</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="font-medium mb-1">Demo Credentials</div>
                    <div>
                      Password for all accounts: <code className="bg-white px-2 py-1 rounded font-mono">password</code>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Learning Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience personalized education with AI-powered tools designed for modern learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Quiz Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent quiz generation tailored to your learning level and progress
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Personalized difficulty adjustment based on your performance and learning patterns
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Progress Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive insights and analytics to track learning progress and identify areas for improvement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
