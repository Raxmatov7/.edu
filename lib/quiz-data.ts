export interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

export interface SubjectData {
  id: string
  name: string
  questions: Question[]
}

// Check if we have stored quiz data in localStorage
let storedQuizData: SubjectData[] | null = null

if (typeof window !== "undefined") {
  const storedData = localStorage.getItem("adminQuizData")
  if (storedData) {
    try {
      storedQuizData = JSON.parse(storedData)
    } catch (e) {
      console.error("Error parsing stored quiz data", e)
    }
  }
}

export const quizData: SubjectData[] = storedQuizData || [
  {
    id: "algebra",
    name: "Algebra",
    questions: [
      {
        question: "5x + 3 = 18 tenglamani yeching",
        options: ["x = 2", "x = 3", "x = 4", "x = 5"],
        correctAnswer: "x = 3",
      },
      {
        question: "Quyidagi ifodani soddalashtiring: 2(x + 3) - 4",
        options: ["2x + 2", "2x + 6", "2x - 1", "2x + 5"],
        correctAnswer: "2x + 2",
      },
      {
        question: "x² - 9 ifodani ko'paytuvchilarga ajrating",
        options: ["(x - 3)(x - 3)", "(x + 3)(x - 3)", "(x + 9)(x - 1)", "(x - 9)(x + 1)"],
        correctAnswer: "(x + 3)(x - 3)",
      },
      {
        question: "Kvadrat tenglamaning diskriminanti nima?",
        options: ["b² - 4ac", "b² + 4ac", "-b ± √(b² - 4ac)/2a", "(-b ± √D)/2a"],
        correctAnswer: "b² - 4ac",
      },
      {
        question: "Quyidagi kasrni qisqartiring: 24/36",
        options: ["1/2", "2/3", "3/4", "4/6"],
        correctAnswer: "2/3",
      },
      {
        question: "Agar a = 4 va b = 7 bo'lsa, (a + b)² ning qiymati nechaga teng?",
        options: ["77", "81", "121", "144"],
        correctAnswer: "121",
      },
      {
        question: "log₁₀(100) ning qiymati nechaga teng?",
        options: ["1", "2", "10", "100"],
        correctAnswer: "2",
      },
      {
        question: "Quyidagi sonlardan qaysi biri 3 ga bo'linadi?",
        options: ["122", "235", "418", "531"],
        correctAnswer: "531",
      },
      {
        question: "Agar x + y = 10 va xy = 21 bo'lsa, x² + y² nechaga teng?",
        options: ["58", "62", "79", "100"],
        correctAnswer: "58",
      },
      {
        question: "Arifmetik progressiyada a₁ = 5 va d = 3 bo'lsa, a₁₀ nechaga teng?",
        options: ["23", "27", "32", "35"],
        correctAnswer: "32",
      },
      {
        question: "Geometrik progressiyada b₁ = 3 va q = 2 bo'lsa, b₅ nechaga teng?",
        options: ["24", "36", "48", "96"],
        correctAnswer: "48",
      },
      {
        question: "Quyidagi tenglamani yeching: 2^x = 8",
        options: ["x = 2", "x = 3", "x = 4", "x = 8"],
        correctAnswer: "x = 3",
      },
      {
        question: "Agar 5! = 5 × 4 × 3 × 2 × 1 bo'lsa, 6! nechaga teng?",
        options: ["120", "240", "360", "720"],
        correctAnswer: "720",
      },
      {
        question: "Quyidagi ifodani soddalashtiring: (x³)²",
        options: ["x⁵", "x⁶", "x⁹", "x^32"],
        correctAnswer: "x⁶",
      },
      {
        question: "Agar f(x) = x² + 3x va g(x) = 2x - 1 bo'lsa, f(g(2)) nechaga teng?",
        options: ["12", "15", "21", "36"],
        correctAnswer: "21",
      },
    ],
  },
  {
    id: "geometriya",
    name: "Geometriya",
    questions: [
      {
        question: "Uchburchakning burchaklari yig'indisi nechaga teng?",
        options: ["90°", "180°", "270°", "360°"],
        correctAnswer: "180°",
      },
      {
        question: "Doiraning yuzi formulasi qaysi?",
        options: ["πr", "2πr", "πr²", "2πr²"],
        correctAnswer: "πr²",
      },
      {
        question: "Parallelogrammning yuzi formulasi qaysi?",
        options: ["a × b", "a × h", "(a × b)/2", "a + b + c + d"],
        correctAnswer: "a × h",
      },
      {
        question: "Pifagor teoremasiga ko'ra to'g'ri burchakli uchburchakda qanday munosabat mavjud?",
        options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c²"],
        correctAnswer: "a² + b² = c²",
      },
      {
        question: "Muntazam oltiburchakning ichki burchaklari yig'indisi nechaga teng?",
        options: ["360°", "540°", "720°", "1080°"],
        correctAnswer: "720°",
      },
      {
        question: "Kubning hajmi formulasi qaysi?",
        options: ["a²", "4a²", "a³", "6a²"],
        correctAnswer: "a³",
      },
      {
        question: "Silindrning hajmi formulasi qaysi?",
        options: ["πr²", "2πr", "πr²h", "4/3πr³"],
        correctAnswer: "πr²h",
      },
      {
        question: "Konusning hajmi formulasi qaysi?",
        options: ["πr²h", "πr²h/2", "πr²h/3", "4/3πr³"],
        correctAnswer: "πr²h/3",
      },
      {
        question: "Sferani kesib o'tuvchi tekislik bilan hosil bo'lgan kesim shakli nima?",
        options: ["Ellips", "Doira", "Parabola", "Giperbola"],
        correctAnswer: "Doira",
      },
      {
        question: "Uchburchakning yuzi formulasi qaysi?",
        options: ["a × b", "(a × h)/2", "a + b + c", "√(s(s-a)(s-b)(s-c))"],
        correctAnswer: "(a × h)/2",
      },
      {
        question: "Teng yonli uchburchakda nechta teng tomon mavjud?",
        options: ["0", "1", "2", "3"],
        correctAnswer: "2",
      },
      {
        question: "Trapetsiyaning yuzi formulasi qaysi?",
        options: ["a × h", "(a + c) × h/2", "a × b", "(a + b + c + d)/2"],
        correctAnswer: "(a + c) × h/2",
      },
      {
        question: "To'g'ri to'rtburchakning diagonallari nima xususiyatga ega?",
        options: [
          "Ular teng",
          "Ular perpendikulyar",
          "Ular to'rtburchakni teng qismlarga bo'ladi",
          "Ular to'rtburchakni teng yuzali uchburchaklarga bo'ladi",
        ],
        correctAnswer: "Ular teng",
      },
      {
        question: "Agar uchburchakning tomonlari 3, 4 va 5 bo'lsa, bu qanday uchburchak?",
        options: [
          "Teng tomonli uchburchak",
          "Teng yonli uchburchak",
          "To'g'ri burchakli uchburchak",
          "O'tmas burchakli uchburchak",
        ],
        correctAnswer: "To'g'ri burchakli uchburchak",
      },
      {
        question: "Muntazam ko'pburchakning barcha tomonlari va burchaklari nima xususiyatga ega?",
        options: [
          "Faqat tomonlari teng",
          "Faqat burchaklari teng",
          "Ham tomonlari, ham burchaklari teng",
          "Tomonlari va burchaklari teng emas",
        ],
        correctAnswer: "Ham tomonlari, ham burchaklari teng",
      },
    ],
  },
  {
    id: "ingliz-tili",
    name: "Ingliz tili",
    questions: [
      {
        question: "Choose the correct form: She ___ to the cinema yesterday.",
        options: ["go", "goes", "went", "gone"],
        correctAnswer: "went",
      },
      {
        question: "Which sentence is grammatically correct?",
        options: [
          "I have been to London last year.",
          "I went to London last year.",
          "I have gone to London last year.",
          "I did go to London last year.",
        ],
        correctAnswer: "I went to London last year.",
      },
      {
        question: "What is the plural form of 'child'?",
        options: ["childs", "childes", "children", "childrens"],
        correctAnswer: "children",
      },
      {
        question: "Choose the correct preposition: She arrived ___ the airport on time.",
        options: ["at", "in", "on", "to"],
        correctAnswer: "at",
      },
      {
        question: "Which word is an adverb?",
        options: ["happy", "quickly", "beautiful", "intelligence"],
        correctAnswer: "quickly",
      },
      {
        question: "Choose the correct form: If I ___ rich, I would buy a big house.",
        options: ["am", "was", "were", "be"],
        correctAnswer: "were",
      },
      {
        question: "What is the past participle of 'write'?",
        options: ["wrote", "writed", "written", "writen"],
        correctAnswer: "written",
      },
      {
        question: "Choose the correct article: I saw ___ interesting movie last night.",
        options: ["a", "an", "the", "no article needed"],
        correctAnswer: "an",
      },
      {
        question: "Which sentence uses the present perfect tense correctly?",
        options: [
          "I am living here since 2010.",
          "I have lived here since 2010.",
          "I live here since 2010.",
          "I was living here since 2010.",
        ],
        correctAnswer: "I have lived here since 2010.",
      },
      {
        question: "Choose the correct comparative form: This book is ___ than that one.",
        options: ["more interesting", "interestinger", "most interesting", "interestingest"],
        correctAnswer: "more interesting",
      },
      {
        question: "Which word is a synonym for 'beautiful'?",
        options: ["ugly", "pretty", "bad", "horrible"],
        correctAnswer: "pretty",
      },
      {
        question: "Choose the correct form: She ___ TV when I called her.",
        options: ["watches", "watched", "was watching", "has watched"],
        correctAnswer: "was watching",
      },
      {
        question: "What is the correct question tag: You like coffee, ___?",
        options: ["do you", "don't you", "aren't you", "isn't it"],
        correctAnswer: "don't you",
      },
      {
        question: "Choose the correct modal verb: You ___ smoke in the hospital.",
        options: ["can", "must", "should", "mustn't"],
        correctAnswer: "mustn't",
      },
      {
        question: "Which sentence is in the passive voice?",
        options: [
          "They built this house in 1990.",
          "This house was built in 1990.",
          "Someone builds houses.",
          "The builder has finished the house.",
        ],
        correctAnswer: "This house was built in 1990.",
      },
    ],
  },
  {
    id: "fizika",
    name: "Fizika",
    questions: [
      {
        question: "Nyutonning birinchi qonuni nima haqida?",
        options: ["Inersiya", "Kuch va tezlanish", "Ta'sir va aks ta'sir", "Gravitatsiya"],
        correctAnswer: "Inersiya",
      },
      {
        question: "Yorug'likning vakuumdagi tezligi qancha?",
        options: ["300,000 km/s", "150,000 km/s", "200,000 km/s", "250,000 km/s"],
        correctAnswer: "300,000 km/s",
      },
      {
        question: "Quyidagi birliklardan qaysi biri kuchni o'lchaydi?",
        options: ["Vatt", "Nyuton", "Joul", "Paskal"],
        correctAnswer: "Nyuton",
      },
      {
        question: "Elektr qarshiligining birligi nima?",
        options: ["Volt", "Amper", "Om", "Vatt"],
        correctAnswer: "Om",
      },
      {
        question: "Quyidagi formulalardan qaysi biri F = ma?",
        options: [
          "Nyutonning birinchi qonuni",
          "Nyutonning ikkinchi qonuni",
          "Nyutonning uchinchi qonuni",
          "Gravitatsiya qonuni",
        ],
        correctAnswer: "Nyutonning ikkinchi qonuni",
      },
      {
        question: "Energiyaning SI birlik tizimidagi o'lchov birligi nima?",
        options: ["Vatt", "Joul", "Nyuton", "Paskal"],
        correctAnswer: "Joul",
      },
      {
        question: "Quyidagi hodisalardan qaysi biri elektromagnit to'lqinlar?",
        options: ["Tovush", "Yorug'lik", "Seysmik to'lqinlar", "Suv to'lqinlari"],
        correctAnswer: "Yorug'lik",
      },
      {
        question: "Termodinamikaning birinchi qonuni nimani ifodalaydi?",
        options: [
          "Energiyaning saqlanish qonuni",
          "Entropiyaning ortishi",
          "Absolyut nol harorat",
          "Issiqlik o'tkazuvchanlik",
        ],
        correctAnswer: "Energiyaning saqlanish qonuni",
      },
      {
        question: "Quyidagi formulalardan qaysi biri E = mc²?",
        options: [
          "Nyutonning ikkinchi qonuni",
          "Eynshteynning nisbiylik nazariyasi",
          "Kulon qonuni",
          "Termodinamikaning birinchi qonuni",
        ],
        correctAnswer: "Eynshteynning nisbiylik nazariyasi",
      },
      {
        question: "Quyidagi birliklardan qaysi biri bosimni o'lchaydi?",
        options: ["Nyuton", "Paskal", "Joul", "Vatt"],
        correctAnswer: "Paskal",
      },
      {
        question: "Elektr tokining o'lchov birligi nima?",
        options: ["Volt", "Amper", "Om", "Vatt"],
        correctAnswer: "Amper",
      },
      {
        question: "Quyidagi hodisalardan qaysi biri diffuziya?",
        options: [
          "Suyuqlikning bug'lanishi",
          "Moddalarning aralashishi",
          "Elektr tokining o'tishi",
          "Yorug'likning sinishi",
        ],
        correctAnswer: "Moddalarning aralashishi",
      },
      {
        question: "Quyidagi birliklardan qaysi biri quvvatni o'lchaydi?",
        options: ["Joul", "Nyuton", "Vatt", "Paskal"],
        correctAnswer: "Vatt",
      },
      {
        question: "Quyidagi hodisalardan qaysi biri elektromagnit induksiya?",
        options: [
          "Magnit maydonida elektr tokining hosil bo'lishi",
          "Elektr zaryadlarning o'zaro ta'siri",
          "Yorug'likning sinishi",
          "Issiqlik o'tkazuvchanlik",
        ],
        correctAnswer: "Magnit maydonida elektr tokining hosil bo'lishi",
      },
      {
        question: "Quyidagi birliklardan qaysi biri chastotani o'lchaydi?",
        options: ["Metr", "Sekund", "Gerts", "Nyuton"],
        correctAnswer: "Gerts",
      },
    ],
  },
  {
    id: "rus-tili",
    name: "Rus tili",
    questions: [
      {
        question: "Выберите правильное окончание: Я люб_ читать книги.",
        options: ["лю", "лью", "лю́", "лъю"],
        correctAnswer: "лю",
      },
      {
        question: "Какое из этих слов является существительным мужского рода?",
        options: ["книга", "окно", "портфель", "дверь"],
        correctAnswer: "портфель",
      },
      {
        question: "Выберите правильную форму множественного числа слова 'друг':",
        options: ["други", "друзья", "другы", "другие"],
        correctAnswer: "друзья",
      },
      {
        question: "Какое из этих слов является антонимом к слову 'холодный'?",
        options: ["тёплый", "мокрый", "светлый", "быстрый"],
        correctAnswer: "тёплый",
      },
      {
        question: "В каком слове ударение падает на первый слог?",
        options: ["молоко", "работа", "зонтик", "письмо"],
        correctAnswer: "зонтик",
      },
      {
        question: "Выберите правильный вариант: Я ___ в школу каждый день.",
        options: ["иду", "хожу", "пойду", "ходил"],
        correctAnswer: "хожу",
      },
      {
        question: "Какой знак препинания ставится в конце вопросительного предложения?",
        options: ["точка", "восклицательный знак", "вопросительный знак", "запятая"],
        correctAnswer: "вопросительный знак",
      },
      {
        question: "Выберите слово с правильным написанием:",
        options: ["карандаш", "корандаш", "карондаш", "корондаш"],
        correctAnswer: "карандаш",
      },
      {
        question: "Какое из этих слов является глаголом прошедшего времени?",
        options: ["читаю", "читал", "читать", "прочитаю"],
        correctAnswer: "читал",
      },
      {
        question: "В каком предложении есть прилагательное?",
        options: [
          "Я иду домой",
          "Красная машина едет быстро",
          "Он читает книгу",
          "Мы гуляем в парке"
        ],
        correctAnswer: "Красная машина едет быстро",
      },
      {
        question: "Выберите правильный предлог: Книга лежит ___ столе.",
        options: ["в", "на", "под", "за"],
        correctAnswer: "на",
      },
      {
        question: "Какое из этих слов пишется с мягким знаком?",
        options: ["доч", "ноч", "мыш", "рож"],
        correctAnswer: "ночь",
      },
      {
        question: "Выберите слово, в котором все согласные звонкие:",
        options: ["город", "парта", "класс", "шкаф"],
        correctAnswer: "город",
      },
      {
        question: "Какое из этих местоимений является личным?",
        options: ["этот", "такой", "он", "чей"],
        correctAnswer: "он",
      },
      {
        question: "В каком слове есть приставка?",
        options: ["река", "поезд", "стол", "дом"],
        correctAnswer: "поезд",
      }
    ],
  }
]