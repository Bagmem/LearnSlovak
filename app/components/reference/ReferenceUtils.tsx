import { type WordStats } from "../../../lib/game"

export function isWordLearned(stat: WordStats): boolean {
  return stat.correctCount >= 2 && stat.correctCount >= stat.wrongCount
}