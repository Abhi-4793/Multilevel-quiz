import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CongratulationsPopup({ show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="congrats-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="congrats-box"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            🎉 Congratulations! 🎉
            <p>You set a new High Score!</p>
            <button className="btn primary" onClick={onClose}>
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
