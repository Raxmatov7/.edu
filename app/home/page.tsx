"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserData {
  email: string
  name: string
  role: string
  profileImage: string | null
}

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")

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
      setContactName(parsedUserData.name || "")
      setContactEmail(parsedUserData.email || "")
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      toast({
        title: "Xabar yuborildi",
        description: "Sizning xabaringiz muvaffaqiyatli yuborildi. Tez orada javob beramiz.",
      })

      setContactMessage("")
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Xatolik yuz berdi",
        description: "Xabarni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      })
    }
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edu Quiz</h1>
            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li>
                  <Link href="/home" className="font-medium text-blue-600 dark:text-blue-400">
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
                <li>
                  <a
                    href="#premium"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Premium testlar
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Aloqa
                  </a>
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
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/subjects")}>
                Fanlar
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main>
        {/* Hero Section - Enhanced with gradient and animation */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"></div>
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="animate-fade-in mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400 md:text-5xl lg:text-6xl">
                Xush kelibsiz, {userData?.name}!
              </h1>
              <p className="mb-8 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                Bilimingizni sinab ko'rish va yangi bilimlar olish uchun bizning test platformamizdan foydalaning.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="h-12 px-8 text-base transform transition-transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => router.push("/subjects")}
                >
                  Testlarni boshlash
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base border-2 transform transition-transform hover:scale-105"
                  onClick={() => document.getElementById("premium")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Premium testlar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Tests Section - Enhanced with glass morphism */}
        <section id="premium" className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"></div>
          <div className="container relative mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 md:text-4xl">
                Premium Testlar
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Chuqurlashtirilgan bilimlarni olish va o'z sohasida mutaxassis bo'lish uchun premium testlarimizdan foydalaning.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <PremiumTestCard
                title="Matematika olimpiada savollari"
                description="Xalqaro olimpiadalarga tayyorlanish uchun maxsus savollar to'plami"
                price="99,000 so'm"
                imageSrc="/maths.webp?height=200&width=400"
              />
              <PremiumTestCard
                title="Ingliz tili IELTS"
                description="IELTS imtihoniga tayyorlanish uchun maxsus test savollari"
                price="149,000 so'm"
                imageSrc="/english.jpg?height=200&width=400"
              />
              <PremiumTestCard
                title="Fizika chuqurlashtirilgan kurs"
                description="Oliy ta'lim muassasalariga kirish uchun chuqurlashtirilgan fizika kursi"
                price="129,000 so'm"
                imageSrc="/fizik.jpg?height=200&width=400"
              />
            </div>
          </div>
        </section>

        {/* Contact Section - Enhanced with modern design */}
        <section id="contact" className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"></div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 md:text-4xl">
                  Biz bilan bog'laning
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  Savollaringiz yoki takliflaringiz bo'lsa, bizga xabar yuboring. Biz sizga tez orada javob beramiz.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-xl bg-white/80 backdrop-blur-lg p-8 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800/80">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Aloqa ma'lumotlari</h3>

                  <div className="mb-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
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
                          className="lucide lucide-mail"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email</p>
                        <p className="text-gray-600 dark:text-gray-300">eduquiz10@gmail</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
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
                          className="lucide lucide-phone"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Telefon</p>
                        <p className="text-gray-600 dark:text-gray-300">+998 99 610 84 86</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
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
                          className="lucide lucide-map-pin"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Manzil</p>
                        <p className="text-gray-600 dark:text-gray-300">Toshkent tumani, Oqqorg'on tumani</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href="https://t.me/Mr_Sobirjonovich"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                    >
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
                        className="lucide lucide-send"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/raxmatov_0_1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                    >
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
                        className="lucide lucide-instagram"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                    >
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
                        className="lucide lucide-telegram"
                      >
                        <path d="M21.5 15.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M17 15.5v-2.9a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v2.9" />
                        <path d="M17 15.5V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="rounded-xl bg-white/80 backdrop-blur-lg p-8 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800/80">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Xabar yuborish</h3>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Ismingiz</Label>
                      <Input
                        id="contact-name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Xabar</Label>
                      <Textarea
                        id="contact-message"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                        className="min-h-[120px]"
                        placeholder="Xabaringizni kiriting..."
                      />
                    </div>

                    <Button type="submit" className="w-full h-11">
                      Yuborish
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Edu Quiz
              </h3>
              <p className="text-gray-300">
                Bilimingizni sinab ko'rish va yangi bilimlar olish uchun eng yaxshi platforma.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold">Foydali havolalar</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/home" className="hover:text-blue-400">
                    Bosh sahifa
                  </Link>
                </li>
                <li>
                  <Link href="/subjects" className="hover:text-blue-400">
                    Fanlar
                  </Link>
                </li>
                <li>
                  <a href="#premium" className="hover:text-blue-400">
                    Premium testlar
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-400">
                    Aloqa
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold">Bog'lanish</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
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
                    className="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>eduquiz10@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
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
                    className="lucide lucide-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+998 99 610 84 86</span>
                </li>
                <li className="flex items-center gap-2">
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
                    className="lucide lucide-map-pin"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Toshkent viloyati, Oqqorg'on tumani</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Edu Quiz. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface PremiumTestCardProps {
  title: string
  description: string
  price: string
  imageSrc: string
}

function PremiumTestCard({ title, description, price, imageSrc }: PremiumTestCardProps) {
  const { toast } = useToast()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
  
    toast({
      title: "To'lov muvaffaqiyatli",
      description: "Xaridingiz uchun rahmat! Test materiallariga kirish huquqi berildi.",
    })
    
    setIsPaymentModalOpen(false)
    // Reset form
    setCardNumber("")
    setExpiryDate("")
    setCvv("")
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  return (
    <>
      <Card className="overflow-hidden border-2 transition-all hover:shadow-lg">
        <div className="aspect-video overflow-hidden">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            width={400}
            height={200}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{price}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsPaymentModalOpen(true)}>
            Sotib olish
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">To'lov ma'lumotlari</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {title} uchun to'lov - {price}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number" className="dark:text-gray-200">Karta raqami</Label>
              <Input
                id="card-number"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="dark:text-gray-200">Amal qilish muddati</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    if (value.length <= 4) {
                      setExpiryDate(
                        value.length > 2 ? value.slice(0, 2) + "/" + value.slice(2) : value
                      )
                    }
                  }}
                  maxLength={5}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="dark:text-gray-200">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="***"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={3}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              To'lovni amalga oshirish
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}



