"use client";

import { useState } from "react";
import Header from "../components/header";
import ChatFab from "../components/chat-fab";
import BottomTabs from "../components/bottom-tabs";
import Spotlight from "../components/spotlight";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [spotlightOpen, setSpotlightOpen] = useState(false);

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
