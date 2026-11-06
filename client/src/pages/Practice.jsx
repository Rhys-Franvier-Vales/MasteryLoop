import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import * as skillService from "../services/skillService";
import * as attemptService from "../services/attemptService";
import { errorMessage } from "../services/api";

function Practice() {
  const [params] = useSearchParams();
  const nodeParam = params.get("node");
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [node, setNode] = useState(null);
  const [question, setQuestion] = useState(null);

  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const startedAt = useRef(0);

  // Ask the server for a question: for the chosen topic, or else whatever is most due.
  const fetchQuestion = useCallback(async () => {
    let id = nodeParam;
    if (!id) {
      const { quests } = await skillService.getDue();
      if (!quests.length) return { empty: true };
      id = quests[0].nodeId;
    }
    return attemptService.getQuestion(id);
  }, [nodeParam]);

  const show = useCallback((data) => {
    if (data.empty) {
      setLoadError("Nothing is due right now. Check the skill tree to see what unlocks next.");
      return;
    }
    setNode(data.node);
    setQuestion(data.question);
    startedAt.current = Date.now();
  }, []);

  // First question, loaded when the page opens.
  useEffect(() => {
    let cancelled = false;
    fetchQuestion()
      .then((data) => !cancelled && show(data))
      .catch((err) => !cancelled && setLoadError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fetchQuestion, show]);

  // "Another question" button.
  async function nextQuestion() {
    setLoading(true);
    setLoadError("");
    setPicked(null);
    setResult(null);
    setSubmitError("");
    try {
      show(await fetchQuestion());
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!picked || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await attemptService.submit({
        nodeId: node.id,
        questionId: question.id,
        selected: picked,
        timeMs: Date.now() - startedAt.current,
      });
      setResult(res);
      setUser(res.user); // keep XP, level and streak fresh everywhere
    } catch (err) {
      setSubmitError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const days = result ? `${result.intervalDays} day${result.intervalDays === 1 ? "" : "s"}` : "";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <Link to="/skilltree" className="text-muted text-sm hover:text-ink transition-colors">
          Back to skill tree
        </Link>

        {loading && <p className="text-muted text-sm mt-8">Finding your next question…</p>}

        {!loading && loadError && (
          <div className="bg-surface rounded-3xl p-7 border border-white/5 mt-5">
            <p className="text-ink mb-5">{loadError}</p>
            <Link to="/dashboard" className="inline-block bg-mint text-bg font-semibold text-sm px-5 py-2.5 rounded-full">
              Back to dashboard
            </Link>
          </div>
        )}

        {!loading && !loadError && question && (
          <motion.div
            animate={result && !result.correct ? { x: [0, -8, 8, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="bg-surface rounded-3xl p-7 border border-white/5 mt-5"
          >
            <p className="text-muted text-sm">{node.title}</p>
            <h1 className="font-display font-bold text-2xl text-ink mt-2 mb-7 leading-snug">{question.text}</h1>

            <div className="flex flex-col gap-2.5 mb-6">
              {question.options.map((opt) => {
                const isPicked = picked === opt;
                const isAnswer = result && opt === result.correctAnswer;

                let state = "border-white/10 text-muted hover:border-white/25";
                if (!result && isPicked) state = "border-mint bg-mint/10 text-ink";
                if (result && isAnswer) state = "border-mint bg-mint/10 text-ink";
                if (result && isPicked && !isAnswer) state = "border-rose bg-rose/10 text-ink";

                return (
                  <motion.button
                    key={opt}
                    whileTap={!result ? { scale: 0.99 } : {}}
                    disabled={Boolean(result)}
                    onClick={() => setPicked(opt)}
                    className={`text-left px-4 py-3.5 rounded-xl border text-sm transition-colors ${state}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {submitError && <p className="text-sm text-rose bg-rose/10 rounded-xl px-3.5 py-2.5 mb-4">{submitError}</p>}

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden mb-5">
                  <div className="rounded-xl px-4 py-3 bg-white/5">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${result.correct ? "text-mint" : "text-rose"}`}>
                        {result.correct
                          ? `Held it. Next review in ${days}.`
                          : `The answer is ${result.correctAnswer}. This one comes back tomorrow.`}
                      </p>
                      {result.xpEarned > 0 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, delay: 0.15 }}
                          className="nums text-gold text-sm shrink-0 ml-3"
                        >
                          +{result.xpEarned}
                        </motion.span>
                      )}
                    </div>
                    {result.explanation && <p className="text-muted text-xs mt-2 leading-relaxed">{result.explanation}</p>}
                    {result.newlyUnlocked.length > 0 && (
                      <p className="text-mint text-xs mt-2">Unlocked: {result.newlyUnlocked.join(", ")}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!picked || submitting}
                className="w-full bg-gold text-bg font-display font-bold py-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? "Checking…" : picked ? "Submit answer" : "Pick an answer"}
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.98 }} onClick={nextQuestion} className="flex-1 bg-mint text-bg font-display font-bold py-3 rounded-full">
                  Another question
                </motion.button>
                <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                  <Link to="/dashboard" className="block text-center bg-raised text-ink font-display font-bold py-3 rounded-full border border-white/10">
                    Dashboard
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Practice;
