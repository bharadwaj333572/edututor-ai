interface PineconeConfig {
  apiKey: string
  environment: string
  indexName: string
}

interface StudentPerformanceVector {
  id: string
  values: number[]
  metadata: {
    studentId: string
    topic: string
    score: number
    difficulty: string
    timestamp: string
    concepts: string[]
  }
}

interface LearningInsight {
  studentId: string
  weakAreas: string[]
  strongAreas: string[]
  recommendedTopics: string[]
  difficultyLevel: string
  confidenceScore: number
}

export class PineconeService {
  private config: PineconeConfig

  constructor(config: PineconeConfig) {
    this.config = config
  }

  async storeStudentPerformance(performance: StudentPerformanceVector): Promise<void> {
    try {
      const response = await fetch(
        `https://${this.config.indexName}-${this.config.environment}.svc.pinecone.io/vectors/upsert`,
        {
          method: "POST",
          headers: {
            "Api-Key": this.config.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vectors: [performance],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Pinecone upsert failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error storing student performance:", error)
    }
  }

  async getStudentInsights(studentId: string): Promise<LearningInsight | null> {
    try {
      // Query for similar performance patterns
      const queryResponse = await fetch(
        `https://${this.config.indexName}-${this.config.environment}.svc.pinecone.io/query`,
        {
          method: "POST",
          headers: {
            "Api-Key": this.config.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              studentId: { $eq: studentId },
            },
            topK: 50,
            includeMetadata: true,
          }),
        },
      )

      if (!queryResponse.ok) {
        throw new Error(`Pinecone query failed: ${queryResponse.statusText}`)
      }

      const data = await queryResponse.json()
      return this.analyzePerformanceData(studentId, data.matches)
    } catch (error) {
      console.error("Error getting student insights:", error)
      return null
    }
  }

  async findSimilarStudents(studentVector: number[]): Promise<string[]> {
    try {
      const response = await fetch(
        `https://${this.config.indexName}-${this.config.environment}.svc.pinecone.io/query`,
        {
          method: "POST",
          headers: {
            "Api-Key": this.config.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vector: studentVector,
            topK: 10,
            includeMetadata: true,
          }),
        },
      )

      const data = await response.json()
      return data.matches.filter((match: any) => match.score > 0.8).map((match: any) => match.metadata.studentId)
    } catch (error) {
      console.error("Error finding similar students:", error)
      return []
    }
  }

  async getTopicRecommendations(studentId: string, currentTopic: string): Promise<string[]> {
    try {
      // Get student's performance history
      const insights = await this.getStudentInsights(studentId)
      if (!insights) return []

      // Use vector similarity to find related topics
      const response = await fetch(
        `https://${this.config.indexName}-${this.config.environment}.svc.pinecone.io/query`,
        {
          method: "POST",
          headers: {
            "Api-Key": this.config.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              topic: { $ne: currentTopic },
            },
            topK: 5,
            includeMetadata: true,
          }),
        },
      )

      const data = await response.json()
      return data.matches.map((match: any) => match.metadata.topic)
    } catch (error) {
      console.error("Error getting topic recommendations:", error)
      return []
    }
  }

  private analyzePerformanceData(studentId: string, matches: any[]): LearningInsight {
    const performances = matches.map((match) => match.metadata)

    // Analyze weak and strong areas
    const topicScores: { [topic: string]: number[] } = {}
    performances.forEach((perf) => {
      if (!topicScores[perf.topic]) {
        topicScores[perf.topic] = []
      }
      topicScores[perf.topic].push(perf.score)
    })

    const weakAreas: string[] = []
    const strongAreas: string[] = []

    Object.entries(topicScores).forEach(([topic, scores]) => {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      if (avgScore < 70) {
        weakAreas.push(topic)
      } else if (avgScore > 85) {
        strongAreas.push(topic)
      }
    })

    // Determine recommended difficulty level
    const recentScores = performances
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map((p) => p.score)

    const avgRecentScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length

    let difficultyLevel = "intermediate"
    if (avgRecentScore > 85) {
      difficultyLevel = "advanced"
    } else if (avgRecentScore < 60) {
      difficultyLevel = "beginner"
    }

    return {
      studentId,
      weakAreas,
      strongAreas,
      recommendedTopics: [...weakAreas, ...this.getRelatedTopics(strongAreas)],
      difficultyLevel,
      confidenceScore: avgRecentScore,
    }
  }

  private getRelatedTopics(strongAreas: string[]): string[] {
    // Simple topic relationship mapping
    const topicRelations: { [key: string]: string[] } = {
      algebra: ["calculus", "trigonometry"],
      calculus: ["differential equations", "linear algebra"],
      geometry: ["trigonometry", "coordinate geometry"],
      statistics: ["probability", "data analysis"],
    }

    const related: string[] = []
    strongAreas.forEach((area) => {
      if (topicRelations[area.toLowerCase()]) {
        related.push(...topicRelations[area.toLowerCase()])
      }
    })

    return [...new Set(related)]
  }
}

export const pineconeService = new PineconeService({
  apiKey: process.env.PINECONE_API_KEY || "",
  environment: process.env.PINECONE_ENVIRONMENT || "",
  indexName: process.env.PINECONE_INDEX_NAME || "edututor-ai",
})
