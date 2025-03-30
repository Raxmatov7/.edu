"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { quizData } from "@/lib/quiz-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

interface QuizStats {
  totalQuestions: number
  totalUsers: number
  averageScore: number
  activeUsers: number
}

interface UserData {
  email: string
  name: string
  role: string
  profileImage: string | null
}

interface UserActivity {
  email: string
  name: string
  lastActive: string
  quizzesTaken: number
  averageScore: number
}

interface NewQuestion {
  question: string
  options: string[]
  correctAnswer: string
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Record<string, QuizStats>>({})
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeUsers, setActiveUsers] = useState<UserActivity[]>([])
  const [selectedSubject, setSelectedSubject] = useState("algebra")
  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  })
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)
  const [localQuizData, setLocalQuizData] = useState(quizData)

  useEffect(() => {
    // Check if user is logged in as admin
    const userDataStr = localStorage.getItem("quizUser")
    if (!userDataStr) {
      router.push("/")
      return
    }

    try {
      const parsedUserData = JSON.parse(userDataStr)
      if (parsedUserData.role !== "admin" || parsedUserData.email !== "xusanuz725@gmail.com") {
        router.push("/")
        return
      }

      setUserData(parsedUserData)
    } catch (error) {
      router.push("/")
      return
    }

    // Get all users from localStorage
    const allUsers: UserActivity[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("quizUser_")) {
        try {
          const user = JSON.parse(localStorage.getItem(key) || "{}")
          const lastActive = localStorage.getItem(`lastActive_${user.email}`) || new Date().toISOString()
          const quizzesTaken = Number.parseInt(localStorage.getItem(`quizzesTaken_${user.email}`) || "0")
          const totalScore = Number.parseInt(localStorage.getItem(`totalScore_${user.email}`) || "0")

          allUsers.push({
            email: user.email,
            name: user.name,
            lastActive,
            quizzesTaken,
            averageScore: quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0,
          })
        } catch (e) {
          console.error("Error parsing user data", e)
        }
      }
    }

    // For demo purposes, add some mock users if none exist
    if (allUsers.length === 0) {
      const mockUsers = [
        {
          email: "user1@example.com",
          name: "Alisher Zokirov",
          lastActive: new Date().toISOString(),
          quizzesTaken: 5,
          averageScore: 78,
        },
        {
          email: "user2@example.com",
          name: "Malika Rahimova",
          lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          quizzesTaken: 3,
          averageScore: 92,
        },
        {
          email: "user3@example.com",
          name: "Bobur Karimov",
          lastActive: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          quizzesTaken: 8,
          averageScore: 65,
        },
      ]

      mockUsers.forEach((user) => {
        localStorage.setItem(
          `quizUser_${user.email}`,
          JSON.stringify({
            email: user.email,
            name: user.name,
            role: "user",
            profileImage: null,
          }),
        )
        localStorage.setItem(`lastActive_${user.email}`, user.lastActive)
        localStorage.setItem(`quizzesTaken_${user.email}`, user.quizzesTaken.toString())
        localStorage.setItem(`totalScore_${user.email}`, (user.averageScore * user.quizzesTaken).toString())
      })

      allUsers.push(...mockUsers)
    }

    setActiveUsers(allUsers)

    // Calculate stats for each subject
    const statsData: Record<string, QuizStats> = {}

    // Get stored quiz results for statistics
    const quizResults: Record<string, number[]> = {}

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("quizResult_")) {
        try {
          const result = JSON.parse(localStorage.getItem(key) || "{}")
          if (!quizResults[result.subject]) {
            quizResults[result.subject] = []
          }
          quizResults[result.subject].push((result.score / result.totalQuestions) * 100)
        } catch (e) {
          console.error("Error parsing quiz result", e)
        }
      }
    }

    // Check if we have any stored quiz data
    const storedQuizData = localStorage.getItem("adminQuizData")
    if (storedQuizData) {
      try {
        const parsedData = JSON.parse(storedQuizData)
        setLocalQuizData(parsedData)
      } catch (e) {
        console.error("Error parsing stored quiz data", e)
      }
    }

    localQuizData.forEach((subject) => {
      const subjectScores = quizResults[subject.name] || []
      const averageScore =
        subjectScores.length > 0 ? Math.round(subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length) : 0

      // Count active users for this subject
      const activeForSubject = allUsers.filter((user) => {
        const lastActive = new Date(user.lastActive)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays < 7 // Active in the last 7 days
      }).length

      statsData[subject.id] = {
        totalQuestions: subject.questions.length,
        totalUsers: allUsers.length,
        averageScore: averageScore || 70, // Fallback if no scores
        activeUsers: activeForSubject,
      }
    })

    setStats(statsData)
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("quizUser")
    router.push("/")
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion({ ...newQuestion, options: newOptions })
  }

  const handleAddQuestion = () => {
    // Validate the new question
    if (!newQuestion.question.trim()) {
      toast({
        title: "Xatolik",
        description: "Savol matni kiritilmagan",
        variant: "destructive",
      })
      return
    }

    if (newQuestion.options.some((opt) => !opt.trim())) {
      toast({
        title: "Xatolik",
        description: "Barcha javob variantlari to'ldirilishi kerak",
        variant: "destructive",
      })
      return
    }

    if (!newQuestion.correctAnswer) {
      toast({
        title: "Xatolik",
        description: "To'g'ri javob tanlanmagan",
        variant: "destructive",
      })
      return
    }

    // Add the new question to the selected subject
    const updatedQuizData = [...localQuizData]
    const subjectIndex = updatedQuizData.findIndex((s) => s.id === selectedSubject)

    if (subjectIndex !== -1) {
      if (editingQuestionIndex !== null) {
        // Update existing question
        updatedQuizData[subjectIndex].questions[editingQuestionIndex] = {
          question: newQuestion.question,
          options: newQuestion.options,
          correctAnswer: newQuestion.correctAnswer,
        }

        toast({
          title: "Muvaffaqiyatli",
          description: "Savol muvaffaqiyatli yangilandi",
        })
      } else {
        // Add new question
        updatedQuizData[subjectIndex].questions.push({
          question: newQuestion.question,
          options: newQuestion.options,
          correctAnswer: newQuestion.correctAnswer,
        })

        toast({
          title: "Muvaffaqiyatli",
          description: "Yangi savol qo'shildi",
        })
      }

      // Update local state and localStorage
      setLocalQuizData(updatedQuizData)
      localStorage.setItem("adminQuizData", JSON.stringify(updatedQuizData))

      // Update stats
      const updatedStats = { ...stats }
      updatedStats[selectedSubject].totalQuestions = updatedQuizData[subjectIndex].questions.length
      setStats(updatedStats)

      // Reset form
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      })
      setEditingQuestionIndex(null)
    }
  }

  const handleEditQuestion = (index: number) => {
    const subject = localQuizData.find((s) => s.id === selectedSubject)
    if (subject && subject.questions[index]) {
      const question = subject.questions[index]
      setNewQuestion({
        question: question.question,
        options: [...question.options],
        correctAnswer: question.correctAnswer,
      })
      setEditingQuestionIndex(index)
    }
  }

  const handleDeleteQuestion = (index: number) => {
    const updatedQuizData = [...localQuizData]
    const subjectIndex = updatedQuizData.findIndex((s) => s.id === selectedSubject)

    if (subjectIndex !== -1) {
      updatedQuizData[subjectIndex].questions.splice(index, 1)

      // Update local state and localStorage
      setLocalQuizData(updatedQuizData)
      localStorage.setItem("adminQuizData", JSON.stringify(updatedQuizData))

      // Update stats
      const updatedStats = { ...stats }
      updatedStats[selectedSubject].totalQuestions = updatedQuizData[subjectIndex].questions.length
      setStats(updatedStats)

      toast({
        title: "Muvaffaqiyatli",
        description: "Savol o'chirildi",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("uz-UZ")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <header className="sticky top-0 z-10 border-b bg-white/90 shadow-sm backdrop-blur-md dark:bg-gray-900/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData?.profileImage || ""} alt={userData?.name || ""} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {userData?.name?.charAt(0).toUpperCase() || "A"}
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
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white/50 p-6 rounded-lg backdrop-blur-sm dark:bg-gray-800/50">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Xush kelibsiz, {userData?.name}!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test savollari va foydalanuvchilar statistikasi
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-0 bg-white/70 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800/70">
            <CardHeader className="pb-2">
              <CardTitle>Umumiy foydalanuvchilar</CardTitle>
              <CardDescription>Barcha foydalanuvchilar soni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{activeUsers.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800/70">
            <CardHeader className="pb-2">
              <CardTitle>Faol foydalanuvchilar</CardTitle>
              <CardDescription>So'nggi 7 kun ichida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {
                  activeUsers.filter((user) => {
                    const lastActive = new Date(user.lastActive)
                    const now = new Date()
                    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
                    return diffDays < 7
                  }).length
                }
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800/70">
            <CardHeader className="pb-2">
              <CardTitle>Umumiy savollar</CardTitle>
              <CardDescription>Barcha fanlardagi savollar soni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {Object.values(stats).reduce((acc, curr) => acc + curr.totalQuestions, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800/70">
            <CardHeader className="pb-2">
              <CardTitle>O'rtacha ball</CardTitle>
              <CardDescription>Barcha fanlar bo'yicha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {Math.round(
                  Object.values(stats).reduce((acc, curr) => acc + curr.averageScore, 0) / Object.values(stats).length,
                )}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="algebra" onValueChange={setSelectedSubject}>
              <TabsList className="mb-4 grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70">
                {localQuizData.map((subject) => (
                  <TabsTrigger key={subject.id} value={subject.id}>
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {localQuizData.map((subject) => (
                <TabsContent key={subject.id} value={subject.id}>
                  <Card className="border-0 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{subject.name} fani savollari</CardTitle>
                        <CardDescription>Jami {subject.questions.length} ta savol</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Yangi savol qo'shish</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
                          <DialogHeader>
                            <DialogTitle>
                              {editingQuestionIndex !== null ? "Savolni tahrirlash" : "Yangi savol qo'shish"}
                            </DialogTitle>
                            <DialogDescription className="dark:text-gray-400">
                              {subject.name} fani uchun{" "}
                              {editingQuestionIndex !== null ? "savolni tahrirlang" : "yangi savol qo'shing"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="question">Savol matni</Label>
                              <Textarea
                                id="question"
                                value={newQuestion.question}
                                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                placeholder="Savolni kiriting..."
                                className="min-h-[80px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Javob variantlari</Label>
                              {newQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Variant ${index + 1}`}
                                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: option })}
                                    className={
                                      newQuestion.correctAnswer === option
                                        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                        : "border-gray-200 dark:border-gray-700"
                                    }
                                  >
                                    {newQuestion.correctAnswer === option ? "To'g'ri" : "To'g'ri javob"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleAddQuestion}>
                              {editingQuestionIndex !== null ? "Saqlash" : "Qo'shish"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {subject.questions.map((question, index) => (
                          <div key={index} className="rounded-lg border border-gray-200 bg-white/90 p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90">
                            <div className="mb-2 flex items-center justify-between">
                              <h3 className="font-semibold">
                                {index + 1}. {question.question}
                              </h3>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditQuestion(index)}>
                                  Tahrirlash
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      O'chirish
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Savolni o'chirishni tasdiqlang</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bu amalni ortga qaytarib bo'lmaydi. Savol tizimdan butunlay o'chiriladi.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteQuestion(index)}>
                                        O'chirish
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            <div className="ml-4 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${option === question.correctAnswer ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                                  ></div>
                                  <span
                                    className={
                                      option === question.correctAnswer
                                        ? "font-medium text-green-600 dark:text-green-400"
                                        : ""
                                    }
                                  >
                                    {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div>
            <Card className="border-0 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70">
              <CardHeader>
                <CardTitle>Faol foydalanuvchilar</CardTitle>
                <CardDescription>So'nggi faollik bo'yicha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeUsers
                    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
                    .slice(0, 5)
                    .map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/90 p-3 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDate(user.lastActive)}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.quizzesTaken} test, {user.averageScore}% o'rtacha
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Tez orada",
                      description: "Barcha foydalanuvchilar ro'yxati tez orada qo'shiladi",
                    })
                  }}
                >
                  Barcha foydalanuvchilarni ko'rish
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
