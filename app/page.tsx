"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/builder");
  }, [router]);

  return <main className=" h-screen overflow-hidden"></main>;
}
