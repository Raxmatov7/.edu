"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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

interface UserData {
  email: string
  name: string
  role: string
  profileImage: string | null
}

export default function QuizPage({ params }: { params: { subject: string } }) {
  const router = useRouter()
  const subject = params.subject
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>(Array(15).fill(""))
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  const subjectData = quizData.find((s) => s.id === subject)

  useEffect(() => {
    const checkUser = async () => {
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

      setIsLoading(false)
    }

    checkUser()
  }, [router])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (!isLoading) {
      if (!isQuizFinished) {
        timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              finishQuiz()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isQuizFinished, isLoading])

  const handleLogout = () => {
    localStorage.removeItem("quizUser")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!subjectData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Fan topilmadi</h1>
        <Button onClick={() => router.push("/subjects")}>Fanlar ro'yxatiga qaytish</Button>
      </div>
    )
  }

  const currentQuestion = subjectData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / subjectData.questions.length) * 100

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleNext = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = selectedAnswer || ""
    setAnswers(newAnswers)

    if (currentQuestionIndex < subjectData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      finishQuiz(newAnswers)
    }

    // Store quiz activity for admin statistics
    const userDataStr = localStorage.getItem("quizUser")
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        // Update last active time
        localStorage.setItem(`lastActive_${userData.email}`, new Date().toISOString())

        // Increment quizzes taken count
        const quizzesTaken = Number.parseInt(localStorage.getItem(`quizzesTaken_${userData.email}`) || "0")
        localStorage.setItem(`quizzesTaken_${userData.email}`, (quizzesTaken + 1).toString())

        // Store user data in a format accessible to admin
        localStorage.setItem(`quizUser_${userData.email}`, userDataStr)
      } catch (e) {
        console.error("Error updating user statistics", e)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1])
    }
  }

  const finishQuiz = (finalAnswers?: string[]) => {
    setIsQuizFinished(true)
    const newAnswers = finalAnswers || [...answers]
    if (!finalAnswers) {
      newAnswers[currentQuestionIndex] = selectedAnswer || ""
    }

    // Calculate score
    let score = 0
    subjectData.questions.forEach((question, index) => {
      if (newAnswers[index] === question.correctAnswer) {
        score++
      }
    })

    // Navigate to results page with score
    localStorage.setItem(
      "quizResults",
      JSON.stringify({
        subject: subjectData.name,
        score,
        totalQuestions: subjectData.questions.length,
        answers: newAnswers,
      }),
    )

    router.push(`/quiz/${subject}/results`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{subjectData.name} testi</h1>
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
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Savol {currentQuestionIndex + 1} / {subjectData.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 dark:text-gray-300"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-200">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Progress value={progress} className="mb-8 h-2" />

        <Card className="mb-8 border-2 shadow-lg">
          <CardContent className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-gray-100">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>

            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${
                    selectedAnswer === option ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-gray-700" : ""
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} className="mr-3" />
                  <Label htmlFor={`option-${index}`} className="w-full cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="h-11 px-6"
          >
            Oldingi savol
          </Button>

          {currentQuestionIndex < subjectData.questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!selectedAnswer} className="h-11 px-6">
              Keyingi savol
            </Button>
          ) : (
            <Button onClick={() => finishQuiz()} disabled={!selectedAnswer} className="h-11 px-6">
              Testni yakunlash
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

