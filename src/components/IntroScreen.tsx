import { useEffect } from "react";
import introLogo from "@/assets/intro-logo.png";

export default function IntroScreen({onComplete}:{onComplete:()=>void}) {
  useEffect(()=>{const timer=window.setTimeout(onComplete,2400);return ()=>window.clearTimeout(timer);},[onComplete]);
  return <div className="launch-screen" aria-label="Abrindo Guia Socorro" onClick={onComplete}>
    <div className="launch-perspective"><div className="launch-halo"/><img src={introLogo} alt="Guia Socorro" className="launch-logo" /></div>
  </div>;
}
