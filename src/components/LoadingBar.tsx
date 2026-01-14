import { useEffect, useState } from "react";

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start animation immediately
    setProgress(0);

    // Smoothly animate to 90% over 1.5 seconds
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) {
          return 90;
        }
        const increment = 90 / 15; // Reach 90% in ~1.5 seconds (15 intervals * 100ms)
        return Math.min(oldProgress + increment, 90);
      });
    }, 100);

    // Complete to 100% after minimum display time
    const completeTimer = setTimeout(() => {
      setProgress(100);
    }, 300);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[1px] bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out shadow-lg shadow-primary/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
