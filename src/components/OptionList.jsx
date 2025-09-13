import React, { useCallback } from "react";
import PropTypes from "prop-types";

function OptionList({ current, selected, onSelect, qIndex }) {
  const onChange = useCallback(
    (val) => {
      onSelect(val);
    },
    [onSelect]
  );

  if (!current) return null;

  if (current.type === "multiple-choice") {
    return (
      <div className="options">
        {current.options.map((opt, idx) => (
          <label
            className={`option ${selected === opt ? "selected" : ""}`}
            key={opt}
            htmlFor={`q-${qIndex}-opt-${idx}`}
          >
            <input
              id={`q-${qIndex}-opt-${idx}`}
              className="radio-input"
              type="radio"
              name={`q-${qIndex}`}
              checked={selected === opt}
              onChange={() => onChange(opt)}
            />
            <span className="option-text">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (current.type === "true-false") {
    return (
      <div className="options">
        {["true", "false"].map((opt, idx) => (
          <label
            className={`option ${selected === opt ? "selected" : ""}`}
            key={opt}
            htmlFor={`q-${qIndex}-tf-${idx}`}
          >
            <input
              id={`q-${qIndex}-tf-${idx}`}
              className="radio-input"
              type="radio"
              name={`q-${qIndex}`}
              checked={selected === opt}
              onChange={() => onChange(opt)}
            />
            <span className="option-text">
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <input
      className="option text-input"
      placeholder="Type your answer"
      value={selected || ""}
      onChange={(e) => onSelect(e.target.value)}
    />
  );
}

OptionList.propTypes = {
  current: PropTypes.object,
  selected: PropTypes.any,
  onSelect: PropTypes.func.isRequired,
  qIndex: PropTypes.number.isRequired,
};

export default React.memo(OptionList);
