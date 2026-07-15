const { useState: useStateQ, useMemo: useMemoQ } = React

function Quiz({ onStartRoom }) {
  const { QUIZ, COLLECTIONS, PRESETS, DEFAULT_PRESET } = window.DATA
  const [answers, setAnswers] = useStateQ([]) // option objects, one per question
  const step = answers.length
  const done = step >= QUIZ.length

  const result = useMemoQ(() => {
    if (!done) return null
    const score = { dorm: 0, essentials: 0, kids: 0 }
    answers.forEach((a) => {
      Object.entries(a.w).forEach(([k, v]) => (score[k] += v))
    })
    const winner = Object.keys(score).sort((a, b) => score[b] - score[a])[0]
    const hint = answers.find((a) => {
      const p = a.preset && PRESETS.find((x) => x.id === a.preset)
      return p && p.collection === winner
    })
    const presetId = hint ? hint.preset : DEFAULT_PRESET[winner]
    return { winner, preset: PRESETS.find((p) => p.id === presetId), score }
  }, [answers, done])

  const reset = () => setAnswers([])

  return (
    <div className="section quiz">
      <p className="section-kicker">03 — Style quiz</p>
      <h2 className="section-title">Find your room era.</h2>
      <p className="section-sub">Five taps. Zero wrong answers.</p>

      <div className="quiz-card">
        {!done ? (
          <>
            <div className="quiz-progress">
              {QUIZ.map((_, i) => (
                <span key={i} className={i < step ? 'done' : i === step ? 'now' : ''} />
              ))}
            </div>
            <p className="quiz-count">Q{step + 1} / {QUIZ.length}</p>
            <h3 className="quiz-q">{QUIZ[step].q}</h3>
            <div className="quiz-options">
              {QUIZ[step].options.map((o) => (
                <button key={o.label} className="quiz-option" onClick={() => setAnswers((a) => [...a, o])}>
                  {o.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button className="quiz-back" onClick={() => setAnswers((a) => a.slice(0, -1))}>
                ← Back
              </button>
            )}
          </>
        ) : (
          <div className="quiz-result" style={{ '--racc': COLLECTIONS[result.winner].accent }}>
            <p className="quiz-result-kicker">Your era is…</p>
            <h3 className="quiz-result-name">{COLLECTIONS[result.winner].name}</h3>
            <p className="quiz-result-tag">{COLLECTIONS[result.winner].tagline}</p>
            <div className="quiz-result-preset">
              <strong>Matched starter room: “{result.preset.name}”</strong>
              <p>{result.preset.items.length} pieces, pre-styled and ready to remix.</p>
            </div>
            <div className="quiz-result-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onStartRoom(result.winner, result.preset.id)}
              >
                Start with this room
              </button>
              <button className="btn btn-ghost" onClick={reset}>Retake quiz</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

window.Quiz = Quiz
