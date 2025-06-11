import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  /** Time in minutes */
  initialMinutes: number;
  /** Called once, when the countdown reaches 0 */
  onExpire: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, onExpire }) => {
  // total seconds remaining
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // start the countdown
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // last tick: clear and fire callback
          clearInterval(intervalRef.current!);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup on unmount or initialMinutes change
    return () => clearInterval(intervalRef.current!);
  }, [initialMinutes, onExpire]);

  // format MM:SS
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const padded = seconds.toString().padStart(2, "0");

  return (
    <div className="text-lg font-mono">
      Time Remaining: {minutes}:{padded}
    </div>
  );
};

export default Timer;
