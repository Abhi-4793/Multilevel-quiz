import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function StartScreen({ onStart, highScore }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 style={{ margin: 0 }}>Welcome to the Multi-Level Quiz</h2>
      <p className="sub">
        Start at Easy level — progress by meeting the pass criteria.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <button className="btn" onClick={onStart}>
          Start Quiz
        </button>
        <button className="btn ghost" onClick={() => window.location.reload()}>
          Reset
        </button>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div className="sub">High Score</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{highScore ?? 0}</div>
        </div>
      </div>
    </motion.div>
  );
}

StartScreen.propTypes = {
  onStart: PropTypes.func.isRequired,
  highScore: PropTypes.number,
};
