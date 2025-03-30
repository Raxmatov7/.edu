"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { quizData } from "@/lib/quiz-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface QuizResults {
  subject: string
  score: number
  totalQuestions: number
  answers: string[]
}

interface UserData {
  email: string
  name: string
  role: string
  profileImage: string | null
}

export default function ResultsPage({ params }: { params: { subject: string } }) {
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  const subject = params.subject
  const subjectData = quizData.find((s) => s.id === subject)

  useEffect(() => {
    // Check if user is logged in
    const userDataStr = localStorage.getItem("quizUser")
    if (!userDataStr) {
      router.push("/")
      return
    }

    try {
      const parsedUserData = JSON.parse(userDataStr)
      if (!parsedUserData.email) {
        router.push("/")
        return
      }

      setUserData(parsedUserData)
    } catch (error) {
      router.push("/")
      return
    }

    const storedResults = localStorage.getItem("quizResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }

    // Store quiz results for admin statistics
    if (storedResults && userDataStr) {
      try {
        const parsedResults = JSON.parse(storedResults)
        const userData = JSON.parse(userDataStr)

        // Store the result with a unique key
        const resultKey = `quizResult_${userData.email}_${Date.now()}`
        localStorage.setItem(resultKey, storedResults)

        // Update total score for average calculation
        const totalScore = Number.parseInt(localStorage.getItem(`totalScore_${userData.email}`) || "0")
        const newScore = Math.round((parsedResults.score / parsedResults.totalQuestions) * 100)
        localStorage.setItem(`totalScore_${userData.email}`, (totalScore + newScore).toString())

        // Update last active time
        localStorage.setItem(`lastActive_${userData.email}`, new Date().toISOString())
      } catch (e) {
        console.error("Error storing quiz results", e)
      }
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("quizUser")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!results || !subjectData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Natijalar topilmadi</h1>
        <Button onClick={() => router.push("/subjects")}>Fanlar ro'yxatiga qaytish</Button>
      </div>
    )
  }

  const percentage = Math.round((results.score / results.totalQuestions) * 100)

  let message = ""
  let messageColor = ""
  let bgColor = ""

  if (percentage >= 80) {
    message = "Ajoyib natija!"
    messageColor = "text-green-600 dark:text-green-400"
    bgColor = "bg-green-500"
  } else if (percentage >= 60) {
    message = "Yaxshi natija!"
    messageColor = "text-blue-600 dark:text-blue-400"
    bgColor = "bg-blue-500"
  } else if (percentage >= 40) {
    message = "O'rtacha natija"
    messageColor = "text-yellow-600 dark:text-yellow-400"
    bgColor = "bg-yellow-500"
  } else {
    message = "Yaxshiroq tayyorlanish kerak"
    messageColor = "text-red-600 dark:text-red-400"
    bgColor = "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{results.subject} testi natijalari</h1>
            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li>
                  <Link
                    href="/home"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Bosh sahifa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subjects"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Fanlar
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userData?.profileImage || ""} alt={userData?.name || ""} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {userData?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mening akkauntim</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/home")}>
                Bosh sahifa
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/subjects")}>
                Fanlar ro'yxati
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 overflow-hidden border-2 shadow-lg">
          <div className={`${bgColor} p-6 text-white`}>
            <h2 className="text-2xl font-bold">Sizning natijangiz</h2>
          </div>
          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <p className="mb-2 text-4xl font-bold">
                {results.score} / {results.totalQuestions}
              </p>
              <p className={`text-xl font-semibold ${messageColor}`}>{message}</p>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex justify-between">
                <span>To'g'ri javoblar</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Savollar tahlili</h2>

        {subjectData.questions.map((question, index) => (
          <Card key={index} className="mb-4 overflow-hidden border shadow-md">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    results.answers[index] === question.correctAnswer
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {results.answers[index] === question.correctAnswer ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {index + 1}. {question.question}
                </h3>
              </div>

              <div className="ml-8">
                <p className="mb-1">
                  <span className="font-medium">Sizning javobingiz:</span>{" "}
                  <span
                    className={
                      results.answers[index] === question.correctAnswer
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {results.answers[index] || "Javob berilmagan"}
                  </span>
                </p>

                {results.answers[index] !== question.correctAnswer && (
                  <p>
                    <span className="font-medium">To'g'ri javob:</span>{" "}
                    <span className="text-green-600 dark:text-green-400">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/quiz/${subject}`)} className="h-11 px-6">
            Qayta urinish
          </Button>
          <Button onClick={() => router.push("/subjects")} className="h-11 px-6">
            Fanlar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    </div>
  )
}

