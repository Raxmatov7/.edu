"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!userEmail.trim()) {
      toast({
        title: "Xato",
        description: "Iltimos, email manzilingizni kiriting",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!userName.trim()) {
      toast({
        title: "Xato",
        description: "Iltimos, ismingizni kiriting",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Store user info in localStorage
    localStorage.setItem(
      "quizUser",
      JSON.stringify({
        email: userEmail,
        name: userName,
        role: "user",
        profileImage: null,
      }),
    )

    // Redirect to home page
    setTimeout(() => {
      router.push("/home")
      setIsLoading(false)
    }, 1000)
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check admin credentials
    if (adminEmail === "xusanuz725@gmail.com" && adminPassword === "xusan201014") {
      // Store admin info in localStorage
      localStorage.setItem(
        "quizUser",
        JSON.stringify({
          email: adminEmail,
          name: "Admin",
          role: "admin",
          profileImage: null,
        }),
      )

      // Redirect to admin panel
      setTimeout(() => {
        router.push("/admin")
        setIsLoading(false)
      }, 1000)
    } else {
      toast({
        title: "Kirish xatosi",
        description: "Email yoki parol noto'g'ri",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">Fan Savollari Testi</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Bilimingizni sinab ko'rish uchun tizimga kiring</p>
          </div>

          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Foydalanuvchi</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <Card className="border-2 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Foydalanuvchi sifatida kirish</CardTitle>
                  <CardDescription>Test savollarini yechish uchun ma'lumotlaringizni kiriting</CardDescription>
                </CardHeader>
                <form onSubmit={handleUserLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Ismingiz</Label>
                      <Input
                        id="user-name"
                        type="text"
                        placeholder="Ismingizni kiriting"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="sizning@email.uz"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                      {isLoading ? "Kirish..." : "Kirish"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-2 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Admin sifatida kirish</CardTitle>
                  <CardDescription>Admin paneliga kirish uchun ma'lumotlaringizni kiriting</CardDescription>
                </CardHeader>
                <form onSubmit={handleAdminLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@email.uz"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Parol</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                      {isLoading ? "Kirish..." : "Kirish"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

