import { type Word } from "../data/words"

export function checkAnswer(word: Word, selectedOption: string): boolean {
  return word.slovak.trim().toLowerCase() === selectedOption.trim().toLowerCase()
}