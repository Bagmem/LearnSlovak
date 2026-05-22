import { type Word } from "../data/words"

export function checkAnswer(word: Word, answer: string) {
  return word.slovak === answer
}