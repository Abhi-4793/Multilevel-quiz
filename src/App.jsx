import React, { useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import { motion } from "framer-motion";
import Quiz from "./components/Quiz";
import ResultScreen from "./components/ResultScreen";
import { safeGetLocalStorage } from "./utils/quizUtils";
import { STORAGE_KEY } from "./constants/quizConstants";

export default function App() {
  const [phase, setPhase] = useState("start");
  const [result, setResult] = useState(null);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    setHighScore(Number(safeGetLocalStorage(STORAGE_KEY) || 0));
  }, []);

  function start() {
    setPhase("quiz");
  }
  function backToStart() {
    setPhase("start");
  }
  function finish(res) {
    setResult(res);
    setPhase("result");
    // high score handled by ResultScreen as well — keep UI in sync
    setHighScore((prev) => Math.max(prev, res.total || 0));
  }

  function restart() {
    setResult(null);
    setPhase("start");
  }

  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {phase === "start" && (
        <StartScreen onStart={start} highScore={highScore} />
      )}
      {phase === "quiz" && (
        <Quiz onFinish={finish} onBackToStart={backToStart} />
      )}
      {phase === "result" && (
        <ResultScreen result={result} onRestart={restart} />
      )}

      {/* <div style={{ marginTop: 14, textAlign: "center" }} className="sub">
        Tip: edit <code>src/data/questions.json</code> to configure questions &
        levels.
      </div> */}
    </motion.div>
  );
}
