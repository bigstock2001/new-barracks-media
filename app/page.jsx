"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import PodcastCarousel from "@/components/PodcastCarousel";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data?.session) {
          router.replace("/portal");
        }
      } catch (err) {
        // ignore errors; do not block rendering of homepage
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <>
      <PodcastCarousel />

      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          Welcome
        </h2>
        <p className="p" style={{ marginTop: 10 }}>
          
        </p>
      </section>
    </>
  );
}