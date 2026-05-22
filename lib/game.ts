import { words } from "../data/words"

export function getWord(index: number) {
  return words[index]
}

export function checkAnswer(word: any, answer: string) {
  return word.slovak === answer
}

export function getNextIndex(current: number) {
  return (current + 1) % words.length
}