export function shuffle(arr = []) {
  // Fisher-Yates shuffle
  const a = Array.isArray(arr) ? arr.slice() : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalize(val) {
  return String(val ?? "")
    .trim()
    .toLowerCase();
}

export function evaluate(current, userAnswer) {
  if (!current) return false;
  if (current.type === "text-input")
    return normalize(current.correctAnswer) === normalize(userAnswer);
  return String(userAnswer) === String(current.correctAnswer);
}

export function safeGetLocalStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function safeSetLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {}
}
