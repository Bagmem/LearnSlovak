import type { User } from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export async function ensureUserProfile(user: User, fallbackName?: string) {
  const profileRef = doc(db, "users", user.uid)
  const profileSnap = await getDoc(profileRef)

  if (profileSnap.exists()) {
    return
  }

  await setDoc(profileRef, {
    uid: user.uid,
    name: fallbackName || user.displayName || "Без имени",
    email: user.email || "",
    photoURL: user.photoURL || "", // Will be updated when user uploads a profile picture
    xp: 0,
    level: "A1",
    createdAt: serverTimestamp(),
  })
}