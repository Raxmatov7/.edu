"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface UserData {
  email: string
  name: string
  role: string
  profileImage: string | null
}

// Avatar variantlari
const DEFAULT_AVATARS = [
  "/avatar-svgrepo-com.svg",
  "/avatar-svgrepo-com (1).svg",
  "/avatar-svgrepo-com (2).svg",
  "/avatar-svgrepo-com (3).svg",
  "/avatar-svgrepo-com (4).svg",
  "/avatar-svgrepo-com (5).svg",
  "/avatar-svgrepo-com (6).svg",
  "/avatar-svgrepo-com (7).svg",


] as const

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [quizHistory, setQuizHistory] = useState<any[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [newName, setNewName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAvatarGrid, setShowAvatarGrid] = useState(false)

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

      // Get quiz history
      const history: any[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`quizResult_${parsedUserData.email}`)) {
          try {
            const result = JSON.parse(localStorage.getItem(key) || "{}")
            history.push({
              ...result,
              date: key.split("_")[2],
              id: key,
            })
          } catch (e) {
            console.error("Error parsing quiz result", e)
          }
        }
      }

      // Sort by date (newest first)
      history.sort((a, b) => Number.parseInt(b.date) - Number.parseInt(a.date))
      setQuizHistory(history)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("uz-UZ")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Xatolik",
          description: "Fayl hajmi 5MB dan oshmasligi kerak",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Xatolik",
          description: "Faqat rasm fayllarini yuklash mumkin",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const imageUrl = URL.createObjectURL(file)
      setPreviewUrl(imageUrl)
      setAvatarUrl("") // Clear direct URL input when file is selected
    }
  }

  const handleSelectDefaultAvatar = (avatarUrl: string) => {
    setAvatarUrl(avatarUrl)
    setSelectedFile(null)
    setPreviewUrl("")
    setShowAvatarGrid(false)
  }

  const handleUpdateProfile = async () => {
    if (!userData) return

    let newProfileImage = userData.profileImage

    if (selectedFile) {
      try {
        // Convert image to base64
        const base64Image = await convertFileToBase64(selectedFile)
        newProfileImage = base64Image
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Rasm yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
        return
      }
    } else if (avatarUrl) {
      newProfileImage = avatarUrl
    }

    const updatedUserData = {
      ...userData,
      name: newName || userData.name,
      profileImage: newProfileImage,
    }

    // Save to localStorage
    localStorage.setItem("quizUser", JSON.stringify(updatedUserData))
    setUserData(updatedUserData)
    setIsEditingProfile(false)
    setSelectedFile(null)
    setPreviewUrl("")

    toast({
      title: "Profil yangilandi",
      description: "Sizning ma'lumotlaringiz muvaffaqiyatli yangilandi.",
    })
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduQuiz</h1>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Profil</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Shaxsiy ma'lumotlar va test natijalari</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="border-2 shadow-lg">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData?.profileImage || ""} alt={userData?.name || ""} />
                    <AvatarFallback className="bg-blue-500 text-2xl text-white">
                      {userData?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
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
                          className="lucide lucide-pencil"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Profilni tahrirlash</DialogTitle>
                        <DialogDescription>
                          Profil ma'lumotlaringizni yangilang
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Ism</Label>
                          <Input
                            id="name"
                            defaultValue={userData?.name}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Ismingizni kiriting"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Profil rasmi</Label>
                          <div className="flex flex-col items-center gap-4">
                            {/* Preview current or selected image */}
                            <div className="relative h-24 w-24 overflow-hidden rounded-full">
                              <Image
                                src={previewUrl || userData?.profileImage || "/placeholder.svg"}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            
                            {/* Avatar options */}
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                                >
                                  Tayyor avatarlar
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  Rasm yuklash
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                  />
                                </Button>
                              </div>

                              {/* Default avatars grid */}
                              {showAvatarGrid && (
                                <div className="grid grid-cols-4 gap-2 mt-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                  {DEFAULT_AVATARS.map((avatar, index) => (
                                    <button
                                      key={index}
                                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                                        avatarUrl === avatar ? 'border-blue-500' : 'border-transparent'
                                      }`}
                                      onClick={() => handleSelectDefaultAvatar(avatar)}
                                    >
                                      <Image
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </button>
                                  ))}
                                </div>
                              )}

                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Rasm yuklash: maksimal hajm 5MB (PNG, JPG, JPEG)
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="avatar">Yoki rasm URL manzili</Label>
                          <Input
                            id="avatar"
                            value={avatarUrl}
                            onChange={(e) => {
                              setAvatarUrl(e.target.value)
                              setSelectedFile(null)
                              setPreviewUrl("")
                            }}
                            placeholder="Avatar rasmining URL manzili"
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            URL orqali rasm yuklash (ixtiyoriy)
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setIsEditingProfile(false)
                          setSelectedFile(null)
                          setPreviewUrl("")
                          setAvatarUrl("")
                          setShowAvatarGrid(false)
                        }}>
                          Bekor qilish
                        </Button>
                        <Button onClick={handleUpdateProfile}>
                          Saqlash
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardTitle className="mt-4">{userData?.name}</CardTitle>
                <CardDescription>{userData?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={() => router.push("/subjects")}>
                    Fanlar ro'yxatiga o'tish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Test natijalari</CardTitle>
                <CardDescription>Sizning test natijalaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                {quizHistory.length > 0 ? (
                  <div className="space-y-4">
                    {quizHistory.map((result, index) => (
                      <div key={index} className="rounded-lg border p-4 dark:border-gray-700">
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{result.subject}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(new Date(Number.parseInt(result.date)).toISOString())}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {result.score} / {result.totalQuestions}
                            </p>
                            <p
                              className={`text-sm ${
                                (result.score / result.totalQuestions) >= 0.7
                                  ? "text-green-600 dark:text-green-400"
                                  : result.score / result.totalQuestions >= 0.5
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Siz hali hech qanday testni yakunlamagansiz</p>
                    <Button className="mt-4" onClick={() => router.push("/subjects")}>
                      Testlarni boshlash
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

