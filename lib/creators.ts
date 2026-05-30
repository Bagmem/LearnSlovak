export const CREATOR_EMAILS = [
  "norweynlay@gmail.com",
  "bagmem4@gmail.com",
]

export function isCreator(email?: string | null): boolean {
  if (!email) return false

  return CREATOR_EMAILS.map((item) => item.toLowerCase()).includes(email.toLowerCase())
}