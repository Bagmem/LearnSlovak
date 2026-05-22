export type Word = {
  id: number
  russian: string
  slovak: string
  category: "basic" | "food" | "travel" | "verbs"
}

export const words: Word[] = [
  // BASIC (самые важные)
  { id: 1, russian: "дом", slovak: "dom", category: "basic" },
  { id: 2, russian: "вода", slovak: "voda", category: "basic" },
  { id: 3, russian: "хлеб", slovak: "chlieb", category: "basic" },
  { id: 4, russian: "я", slovak: "ja", category: "basic" },
  { id: 5, russian: "ты", slovak: "ty", category: "basic" },
  { id: 6, russian: "он", slovak: "on", category: "basic" },
  { id: 7, russian: "она", slovak: "ona", category: "basic" },
  { id: 8, russian: "мы", slovak: "my", category: "basic" },
  { id: 9, russian: "вы", slovak: "vy", category: "basic" },

  // VERBS (глаголы)
  { id: 10, russian: "есть", slovak: "jesť", category: "verbs" },
  { id: 11, russian: "пить", slovak: "piť", category: "verbs" },
  { id: 12, russian: "идти", slovak: "ísť", category: "verbs" },
  { id: 13, russian: "жить", slovak: "žiť", category: "verbs" },

  // FOOD
  { id: 14, russian: "яблоко", slovak: "jablko", category: "food" },
  { id: 15, russian: "молоко", slovak: "mlieko", category: "food" },
  { id: 16, russian: "мясо", slovak: "mäso", category: "food" },

  // TRAVEL
  { id: 17, russian: "город", slovak: "mesto", category: "travel" },
  { id: 18, russian: "страна", slovak: "krajina", category: "travel" },
  { id: 19, russian: "дорога", slovak: "cesta", category: "travel" }
]