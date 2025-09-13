import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { safeSetLocalStorage, safeGetLocalStorage } from "../utils/quizUtils";
import { STORAGE_KEY } from "../constants/quizConstants";
import CongratulationsPopup from "./CongratulationPopup";

export default function ResultScreen({ result, onRestart }) {
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("highScore") || "0", 10);
    } catch {
      return 0;
    }
  });
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (result?.total > highScore) {
      setHighScore(result?.total);
      try {
        localStorage.setItem("highScore", result?.total);
      } catch (err) {
        console.error("LocalStorage error:", err);
      }
      setShowCongrats(true);
    }
  }, [result, highScore]);

  useEffect(() => {
    const prev = Number(safeGetLocalStorage(STORAGE_KEY) || 0);
    if (result?.total > prev)
      safeSetLocalStorage(STORAGE_KEY, String(result.total));
  }, [result]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 style={{ margin: 0 }}>
        {result?.final ? "Quiz Finished" : "Quiz Ended"}
      </h2>
      <p className="sub">
        {result?.final ? "You completed the game" : "Game ended"}
      </p>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          {result?.total ?? 0} Points
        </div>
        <div className="sub">
          Level reached: {result?.levelCompleted ?? "—"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button className="btn" onClick={onRestart}>
          Restart
        </button>
        <button className="btn ghost" onClick={() => window.location.reload()}>
          Home
        </button>
        <CongratulationsPopup
          show={showCongrats}
          onClose={() => setShowCongrats(false)}
        />
      </div>
    </motion.div>
  );
}

ResultScreen.propTypes = {
  result: PropTypes.object,
  onRestart: PropTypes.func.isRequired,
};
