"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { EduTutorLogo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, XCircle, Loader2, ArrowLeft, ExternalLink, KeyRound } from "lucide-react"
import Link from "next/link"

interface ServiceStatus {
  name: string
  status: "checking" | "connected" | "error" | "not-configured"
  message: string
}

export default function SetupPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "IBM Watsonx", status: "not-configured", message: "Not tested yet" },
    { name: "Pinecone", status: "not-configured", message: "Optional - for advanced analytics" },
    { name: "Google Classroom", status: "not-configured", message: "Optional - for classroom integration" },
  ])

  const testWatsonx = async () => {
    updateServiceStatus("IBM Watsonx", "checking", "Testing connection...")

    try {
      const response = await fetch("/api/test-watsonx")
      const data = await response.json()

      if (data.success) {
        updateServiceStatus("IBM Watsonx", "connected", "Successfully connected and generated test questions!")
      } else {
        updateServiceStatus("IBM Watsonx", "error", data.message || "Connection failed")
      }
    } catch {
      updateServiceStatus("IBM Watsonx", "error", "Failed to test connection")
    }
  }

  const updateServiceStatus = (name: string, status: ServiceStatus["status"], message: string) => {
    setServices((prev) =>
      prev.map((service) => (service.name === name ? { ...service, status, message } : service))
    )
  }

  const testAll = () => {
    testWatsonx()
    // Add Pinecone + Google Classroom test handlers here when ready
  }

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Badge variant="secondary">Testing...</Badge>
      case "connected":
        return <Badge className="bg-green-600">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Not Configured</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <EduTutorLogo className="h-8 w-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduTutor AI
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">EduTutor AI Setup</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure and test AI services to get started.</p>
          </div>

          {/* API Key Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your keys securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <KeyRound className="text-blue-500" />
                <Input placeholder="IBM Watsonx API Key (configured)" disabled />
                <Button variant="outline" size="sm">Update Key</Button>
              </div>
              {/* Add inputs for Pinecone or Google Classroom here if needed */}
            </CardContent>
          </Card>

          {/* Service Testing */}
          <Card className="mb-8">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Test and verify integrations</CardDescription>
              </div>
              <Button onClick={testAll} variant="outline" size="sm">Test All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(service.status)}
                    {service.name === "IBM Watsonx" && (
                      <Button onClick={testWatsonx} disabled={service.status === "checking"} size="sm">
                        Test Connection
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>Follow these steps to complete configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* IBM Watsonx */}
              <div>
                <h3 className="font-semibold mb-2">1. IBM Watsonx</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Already configured. You also need a Project ID from IBM Cloud.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="https://cloud.ibm.com/catalog/services/watson-machine-learning" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Project ID
                  </Link>
                </Button>
              </div>

              {/* Pinecone */}
              <div>
                <h3 className="font-semibold mb-2">2. Pinecone (Optional)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Enables vector search for recommendations.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="https://www.pinecone.io/" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Pinecone Dashboard
                  </Link>
                </Button>
              </div>

              {/* Google Classroom */}
              <div>
                <h3 className="font-semibold mb-2">3. Google Classroom (Optional)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Integrate with your school’s Google Classroom workspace.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="https://console.developers.google.com/" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Cloud Console
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Start App Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ready to Start!</CardTitle>
              <CardDescription>Your EduTutor AI is now ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/student">Start Learning</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/student/quiz-generator">Generate a Quiz</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/educator">Educator Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
