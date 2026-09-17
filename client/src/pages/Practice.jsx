import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const question = {
  topic: "Binary search trees",
  text: "What is the time complexity of binary search on a sorted array?",
  options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
  answer: "O(log n)",
  xp: 35,
};

function Practice() {
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = picked === question.answer;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <Link to="/skilltree" className="text-muted text-sm hover:text-ink transition-colors">
          Back to skill tree
        </Link>

        <motion.div
          animate={submitted && !correct ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-surface rounded-3xl p-7 border border-white/5 mt-5"
        >
          <p className="text-muted text-sm">{question.topic}</p>
          <h1 className="font-display font-bold text-2xl text-ink mt-2 mb-7 leading-snug">
            {question.text}
          </h1>

          <div className="flex flex-col gap-2.5 mb-6">
            {question.options.map((opt) => {
              const isPicked = picked === opt;
              const isAnswer = opt === question.answer;

              let state = "border-white/10 text-muted hover:border-white/25";
              if (!submitted && isPicked) state = "border-mint bg-mint/10 text-ink";
              if (submitted && isAnswer) state = "border-mint bg-mint/10 text-ink";
              if (submitted && isPicked && !isAnswer) state = "border-rose bg-rose/10 text-ink";

              return (
                <motion.button
                  key={opt}
                  whileTap={!submitted ? { scale: 0.99 } : {}}
                  disabled={submitted}
                  onClick={() => setPicked(opt)}
                  className={`text-left px-4 py-3.5 rounded-xl border text-sm transition-colors ${state}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden mb-5"
              >
                <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5">
                  <p className={`text-sm ${correct ? "text-mint" : "text-rose"}`}>
                    {correct
                      ? "Held it. Next review moves out to 6 days."
                      : `The answer is ${question.answer}. This one comes back tomorrow.`}
                  </p>
                  {correct && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, delay: 0.15 }}
                      className="nums text-gold text-sm shrink-0 ml-3"
                    >
                      +{question.xp}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!submitted ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => picked && setSubmitted(true)}
              disabled={!picked}
              className="w-full bg-gold text-bg font-display font-bold py-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {picked ? "Submit answer" : "Pick an answer"}
            </motion.button>
          ) : (
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link to="/dashboard" className="block text-center w-full bg-mint text-bg font-display font-bold py-3 rounded-full">
                Next topic
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Practice;