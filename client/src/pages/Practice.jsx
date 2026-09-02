import { useState } from "react";
import { Link } from "react-router-dom";

const mockQuestion = {
  text: "What is the time complexity of binary search on a sorted array?",
  options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
  correct: "O(log n)",
};

function Practice() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
  }

  const isCorrect = selected === mockQuestion.correct;

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center px-6 font-body">
      <div className="w-full max-w-lg">
        <Link to="/skilltree" className="text-muted text-sm hover:text-ink transition">
          ← Back to Skill Tree
        </Link>

        <div className="bg-surface rounded-2xl p-6 border border-white/5 mt-6">
          <p className="text-ink font-body text-lg mb-6">{mockQuestion.text}</p>

          <div className="flex flex-col gap-3 mb-6">
            {mockQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !submitted && setSelected(opt)}
                className={`text-left px-4 py-3 rounded-xl border text-sm font-body transition ${
                  selected === opt
                    ? "border-teal bg-teal/10 text-ink"
                    : "border-white/10 text-muted hover:border-white/30"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {submitted && (
            <p
              className={`text-sm mb-4 px-3 py-2 rounded-lg ${
                isCorrect ? "text-teal bg-teal/10" : "text-red-400 bg-red-400/10"
              }`}
            >
              {isCorrect ? "Correct! Mastery updated." : `Not quite. Correct answer: ${mockQuestion.correct}`}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="w-full bg-gold text-bg font-display font-bold py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-40"
          >
            {submitted ? "Submitted" : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Practice;