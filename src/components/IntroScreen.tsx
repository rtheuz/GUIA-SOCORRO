import { useState, useEffect } from "react";
import introLogo from "@/assets/intro-logo.png";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const completeTimer = setTimeout(() => onComplete(), 2500);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background ${exiting ? "animate-intro-exit" : ""}`}
    >
      {/* Pulse ring */}
      <div className="absolute w-72 h-72 rounded-full border-2 border-primary/30 animate-pulse-ring" />

      {/* Logo */}
      <img
        src={introLogo}
        alt="GUIA SOCORRO"
        className="w-44 h-44 object-contain animate-intro-logo"
      />

      {/* Tagline */}
      <p className="mt-2 text-sm font-medium text-muted-foreground animate-intro-text" style={{ animationDelay: "0.6s" }}>
        Informação que salva vidas
      </p>
    </div>
  );
};

export default IntroScreen;
