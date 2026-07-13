"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import ChatFab from "../components/chat-fab";
import BottomTabs from "../components/bottom-tabs";
import Spotlight from "../components/spotlight";
import { useAuth } from "../contexts/auth-context";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <>
      <Header onSpotlightOpen={() => setSpotlightOpen(true)} />
      {children}
      <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      <ChatFab />
      <BottomTabs />
    </>
  );
}
