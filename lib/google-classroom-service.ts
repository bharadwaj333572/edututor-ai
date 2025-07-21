interface GoogleClassroomConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

interface ClassroomCourse {
  id: string
  name: string
  section: string
  description: string
  room: string
  ownerId: string
  creationTime: string
  updateTime: string
  enrollmentCode: string
  courseState: string
  alternateLink: string
}

interface ClassroomStudent {
  courseId: string
  userId: string
  profile: {
    id: string
    name: {
      givenName: string
      familyName: string
      fullName: string
    }
    emailAddress: string
    photoUrl?: string
  }
}

interface CourseWork {
  courseId: string
  id: string
  title: string
  description: string
  materials: any[]
  state: string
  alternateLink: string
  creationTime: string
  updateTime: string
  dueDate?: {
    year: number
    month: number
    day: number
  }
  dueTime?: {
    hours: number
    minutes: number
  }
}

export class GoogleClassroomService {
  private config: GoogleClassroomConfig
  private accessToken: string | null = null

  constructor(config: GoogleClassroomConfig) {
    this.config = config
  }

  async authenticate(authCode: string): Promise<boolean> {
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: authCode,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          grant_type: "authorization_code",
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange auth code for token")
      }

      const tokenData = await tokenResponse.json()
      this.accessToken = tokenData.access_token
      return true
    } catch (error) {
      console.error("Google Classroom authentication error:", error)
      return false
    }
  }

  async getCourses(): Promise<ClassroomCourse[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated with Google Classroom")
    }

    try {
      const response = await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }

      const data = await response.json()
      return data.courses || []
    } catch (error) {
      console.error("Error fetching courses:", error)
      return []
    }
  }

  async getStudents(courseId: string): Promise<ClassroomStudent[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated with Google Classroom")
    }

    try {
      const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }

      const data = await response.json()
      return data.students || []
    } catch (error) {
      console.error("Error fetching students:", error)
      return []
    }
  }

  async getCourseWork(courseId: string): Promise<CourseWork[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated with Google Classroom")
    }

    try {
      const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch course work")
      }

      const data = await response.json()
      return data.courseWork || []
    } catch (error) {
      console.error("Error fetching course work:", error)
      return []
    }
  }

  async createAssignment(courseId: string, title: string, description: string): Promise<string | null> {
    if (!this.accessToken) {
      throw new Error("Not authenticated with Google Classroom")
    }

    try {
      const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          workType: "ASSIGNMENT",
          state: "PUBLISHED",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create assignment")
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error("Error creating assignment:", error)
      return null
    }
  }

  async syncCourseData(courseId: string): Promise<{
    course: ClassroomCourse | null
    students: ClassroomStudent[]
    courseWork: CourseWork[]
  }> {
    try {
      const [courses, students, courseWork] = await Promise.all([
        this.getCourses(),
        this.getStudents(courseId),
        this.getCourseWork(courseId),
      ])

      const course = courses.find((c) => c.id === courseId) || null

      return {
        course,
        students,
        courseWork,
      }
    } catch (error) {
      console.error("Error syncing course data:", error)
      return {
        course: null,
        students: [],
        courseWork: [],
      }
    }
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope:
        "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.me",
      access_type: "offline",
      prompt: "consent",
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }
}

export const googleClassroomService = new GoogleClassroomService({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
})
