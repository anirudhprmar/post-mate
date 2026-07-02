"use client";
import { useEffect, useState } from "react";
import { authClient } from "~/server/better-auth/client";
import type { User } from "~/lib/types/settings";

export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setUser(session.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      } finally {
        setLoading(false);
      }
    };
    void fetchUser();
  }, []);

  return { user, loading };
}
