"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ThemeToggle } from "@/components/theme-toggle"

interface UserData {
  email: string
  name: string
  role: string
  profileImage: string | null
}

const getSubjectIcon = (subjectName: string) => {
  const icons = {
    "Algebra": (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <rect width="512" height="512" rx="128" fill="#6366f1"/>
        <path fill="#fff" d="M170 256h172M256 170v172" strokeWidth="40"/>
        <text x="180" y="200" fontSize="80" fill="#fff" fontWeight="bold">x</text>
        <text x="280" y="400" fontSize="80" fill="#fff" fontWeight="bold">y</text>
      </svg>
    ),
    "Geometriya": (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <rect width="512" height="512" rx="128" fill="#6366f1"/>
        <path fill="#fff" d="M256 100L100 400h312L256 100z"/>
        <circle cx="256" cy="100" r="20" fill="#fff"/>
        <circle cx="100" cy="400" r="20" fill="#fff"/>
        <circle cx="412" cy="400" r="20" fill="#fff"/>
        <path fill="none" stroke="#6366f1" strokeWidth="12" d="M256 100v300M100 400l312-300M100 400h312"/>
      </svg>
    ),
    "Ingliz tili": (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <rect width="512" height="512" rx="128" fill="#6366f1"/>
        <text x="150" y="340" fontSize="280" fill="#fff" fontWeight="bold">A</text>
        <text x="220" y="200" fontSize="120" fill="#fff" fontWeight="bold">B</text>
        <text x="300" y="280" fontSize="120" fill="#fff" fontWeight="bold">C</text>
      </svg>
    ),
    "Rus tili": (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <rect width="512" height="512" rx="128" fill="#6366f1"/>
        <text x="140" y="340" fontSize="240" fill="#fff" fontWeight="bold">Я</text>
        <text x="280" y="200" fontSize="100" fill="#fff" fontWeight="bold">Б</text>
        <text x="320" y="280" fontSize="100" fill="#fff" fontWeight="bold">В</text>
      </svg>
    ),
    "Fizika": (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <rect width="512" height="512" rx="128" fill="#6366f1"/>
        <g transform="translate(256 256)">
          <circle cx="0" cy="0" r="40" fill="#fff"/>
          <g transform="rotate(0)">
            <ellipse cx="0" cy="0" rx="180" ry="70" fill="none" stroke="#fff" strokeWidth="24"/>
          </g>
          <g transform="rotate(60)">
            <ellipse cx="0" cy="0" rx="180" ry="70" fill="none" stroke="#fff" strokeWidth="24"/>
          </g>
          <g transform="rotate(120)">
            <ellipse cx="0" cy="0" rx="180" ry="70" fill="none" stroke="#fff" strokeWidth="24"/>
          </g>
        </g>
      </svg>
    )
  };

  return icons[subjectName as keyof typeof icons] || (
    // Default icon if subject not found
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-blue-600 dark:text-blue-400">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
};

export default function SubjectsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

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

    setIsLoading(false)
  }, [router])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <header className="sticky top-0 z-10 border-b bg-white/90 shadow-sm backdrop-blur-md dark:bg-gray-900/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              EduQuiz
            </h1>
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
                    className="font-medium text-blue-600 dark:text-blue-400"
                  >
                    Fanlar
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
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
            Fanlar
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            O'zingizni qiziqtirgan fan bo'yicha bilimingizni sinab ko'ring
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizData.map((subject) => (
            <Card
              key={subject.id}
              className="overflow-hidden border-0 bg-white/70 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800/70"
            >
              <CardHeader className="pb-2">
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>{subject.questions.length} ta savol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 rounded-md bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/40 dark:to-purple-900/40">
                  <div className="flex h-full flex-col items-center justify-center">
                    {getSubjectIcon(subject.name)}
                    <p className="text-center text-gray-700 dark:text-gray-300">
                      Bilimingizni sinab ko'ring
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => router.push(`/quiz/${subject.id}`)}
                >
                  Testni boshlash
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

