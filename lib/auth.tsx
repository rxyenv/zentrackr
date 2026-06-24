import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

import { hasSupabaseConfig, supabase } from "./supabase";

type AuthContextValue = {
  session: Session | null;
  userId: string | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    session,
    userId: session?.user.id ?? null,
    loading,
    isConfigured: hasSupabaseConfig,
    signIn: async (email, password) => {
      if (!supabase) {
        return "Supabase env vars are missing.";
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    },
    signUp: async (email, password) => {
      if (!supabase) {
        return "Supabase env vars are missing.";
      }

      const { error } = await supabase.auth.signUp({ email, password });
      return error?.message ?? null;
    },
    signOut: async () => {
      if (supabase) {
        await supabase.auth.signOut();
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
