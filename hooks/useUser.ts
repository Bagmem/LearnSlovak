import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return user;
}