import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import questionsData from "../data/questions.json";
import OptionList from "./OptionList";
import {
  LEVELS,
  POINTS,
  PASS_REQUIRED,
  TIMER_DURATION,
} from "../constants/quizConstants";
import { shuffle, evaluate } from "../utils/quizUtils";
import useTimer from "../hooks/useTimer";
import { FEEDBACK_MESSAGES } from "../constants/messages";

export default function Quiz({ onFinish, onBackToStart }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const level = LEVELS[levelIndex];
  const current = questions[qIndex];

  const [timeLeft, resetTimer] = useTimer(TIMER_DURATION, {
    active: true,
    onTimeout: useCallback(() => handleSubmit(true, true), []),
  });

  useEffect(() => {
    const arr = Array.isArray(questionsData[level])
      ? shuffle(questionsData[level])
      : [];
    setQuestions(arr);
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setAnswers([]);
    resetTimer();
  }, [levelIndex]);
  // derived state
  const correctCount = useMemo(
    () => answers.filter((a) => a.isCorrect).length,
    [answers]
  );
  const answeredCount = useMemo(() => answers.length, [answers]);
  const [totalScore, setTotalScore] = useState(0);

  const handleSelect = useCallback((val) => {
    setSelected(val);
  }, []);

  const handleSubmit = useCallback(
    (forced = false, timeout = false) => {
      if (!current) return;

      // evaluate
      const isCorrect = evaluate(current, selected);
      const points = isCorrect ? POINTS[level] : 0;

      setAnswers((prev) => [
        ...prev,
        {
          qId: current.id || `${level}-${qIndex}`,
          userAnswer: selected,
          isCorrect,
          points,
        },
      ]);
      if (isCorrect) {
        setTotalScore((prev) => prev + POINTS[level]);
      }
      if (timeout) {
        setFeedback({ ok: false, message: FEEDBACK_MESSAGES.timeout });
      } else if (isCorrect) {
        setFeedback({ ok: true, message: FEEDBACK_MESSAGES.correct });
      } else {
        setFeedback({
          ok: false,
          message: `${FEEDBACK_MESSAGES.wrong} Correct: ${current.correctAnswer}`,
        });
      }

      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        if (qIndex + 1 < questions.length) {
          setQIndex(qIndex + 1);
          resetTimer();
        } else {
          if (correctCount + (isCorrect ? 1 : 0) >= PASS_REQUIRED) {
            if (levelIndex + 1 < LEVELS.length) {
              setLevelIndex(levelIndex + 1);
            } else {
              onFinish({
                total: totalScore + points,
                final: true,
                levelCompleted: level,
              });
            }
          }
        }
      }, 900);
    },
    [
      current,
      selected,
      qIndex,
      questions,
      level,
      levelIndex,
      correctCount,
      totalScore,
      onFinish,
      resetTimer,
    ]
  );

  const levelDone = questions.length > 0 && answeredCount >= questions.length;
  const passed = correctCount >= PASS_REQUIRED;

  const retryLevel = useCallback(() => {
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setAnswers([]);
    resetTimer();
  }, [resetTimer]);

  const finishGame = useCallback(() => {
    onFinish({
      total: totalScore,
      final: true,
      levelCompleted: LEVELS[levelIndex],
    });
  }, [onFinish, totalScore, levelIndex]);
  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Level: {level.toUpperCase()}</div>
          <div className="sub">
            Question {qIndex + 1} of {questions.length}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="level-badge">Score: {totalScore}</div>
          <div className="sub">Timer: {timeLeft}s</div>
        </div>
      </div>
      <div className="card">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="question">{current.question}</div>

              <OptionList
                current={current}
                selected={selected}
                onSelect={handleSelect}
                qIndex={qIndex}
              />

              <div className="controls">
                <button
                  className="btn"
                  onClick={() => handleSubmit()}
                  disabled={feedback !== null}
                >
                  Submit
                </button>
                <button
                  className="btn ghost"
                  onClick={() => {
                    setSelected(null);
                  }}
                >
                  Clear
                </button>
                <div
                  style={{ marginLeft: "auto", alignSelf: "center" }}
                  className="sub"
                >
                  Points per correct: {POINTS[level]}
                </div>
              </div>

              {feedback && (
                <div
                  className={`feedback ${feedback.ok ? "correct" : "wrong"}`}
                >
                  {feedback.message}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="nodata"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No questions found for this level.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {levelDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 12 }}
        >
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="title">Level Complete</div>
                <div className="sub">
                  Correct: {correctCount} / {questions.length}
                </div>
              </div>

              {passed ? (
                <div style={{ textAlign: "right" }}>
                  <div className="sub">You passed this level!</div>
                  {levelIndex + 1 < LEVELS.length ? (
                    <button
                      className="btn"
                      onClick={() => setLevelIndex(levelIndex + 1)}
                    >
                      Proceed to {LEVELS[levelIndex + 1].toUpperCase()}
                    </button>
                  ) : (
                    <button className="btn" onClick={finishGame}>
                      Finish Quiz
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "right" }}>
                  <div className="sub">You failed this level.</div>
                  <button className="btn" onClick={retryLevel}>
                    Retry Level
                  </button>
                  <button
                    className="btn ghost"
                    onClick={onBackToStart}
                    style={{ marginLeft: 8 }}
                  >
                    Restart Game
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
Quiz.propTypes = {
  onFinish: PropTypes.func.isRequired,
  onBackToStart: PropTypes.func.isRequired,
};
