const { useState: useStateQ, useMemo: useMemoQ } = React

const QUIZ_LETTERS = ['A', 'B', 'C', 'D']

function QuizRail({ quiz, step, done }) {
  return (
    <ol className="quiz-rail">
      {quiz.map((q, i) => {
        const state = done || i < step ? 'done' : i === step ? 'now' : 'todo'
        return (
          <li key={q.q} className={'is-' + state}>
            <span className="quiz-rail-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="quiz-rail-q">{q.q}</span>
            <span className="quiz-rail-state">
              {state === 'done' ? 'Logged' : state === 'now' ? 'In progress' : ''}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function Quiz({ onStartRoom }) {
  const { QUIZ, COLLECTIONS, PRESETS, DEFAULT_PRESET } = window.DATA
  const [answers, setAnswers] = useStateQ([])
  const step = answers.length
  const done = step >= QUIZ.length
  const pct = done ? 100 : Math.round((step / QUIZ.length) * 100)

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

  return (
    <div className="quiz-feature">
      <div className="quiz-bar">
        <span className="quiz-bar-index">03 — PacSun Home Style Index</span>
        <span className="quiz-bar-meta">Five questions · FW26 assortment</span>
      </div>

      <div className="quiz-grid">
        <div className="quiz-lede">
          <h2>Find your room era.</h2>
          <p>
            Answer five questions and the index assigns you a collection, its Pantone standards, and a
            pre-styled starter room you can remix piece by piece.
          </p>
          <div className="quiz-pct">
            <strong>{pct}%</strong>
            <span>Complete</span>
          </div>
          <QuizRail quiz={QUIZ} step={step} done={done} />
        </div>

        <div className="quiz-panel">
          {!done ? (
            <>
              <div className="quiz-panel-head">
                <span className="quiz-panel-count">
                  Question {String(step + 1).padStart(2, '0')} of {String(QUIZ.length).padStart(2, '0')}
                </span>
                <span className="quiz-ticks">
                  {QUIZ.map((q, i) => (
                    <span key={q.q} className={i < step ? 'done' : i === step ? 'now' : ''} />
                  ))}
                </span>
              </div>
              <h3 className="quiz-q">{QUIZ[step].q}</h3>
              <div className="quiz-options">
                {QUIZ[step].options.map((o, i) => (
                  <button key={o.label} className="quiz-option" onClick={() => setAnswers((a) => [...a, o])}>
                    <span className="quiz-option-letter">{QUIZ_LETTERS[i]}</span>
                    <span className="quiz-option-label">{o.label}</span>
                  </button>
                ))}
              </div>
              <div className="quiz-panel-foot">
                {step > 0 ? (
                  <button className="quiz-back" onClick={() => setAnswers((a) => a.slice(0, -1))}>
                    ← Previous question
                  </button>
                ) : (
                  <span />
                )}
                <span className="quiz-panel-note">No wrong answers</span>
              </div>
            </>
          ) : (
            <div className="quiz-result" style={{ '--racc': COLLECTIONS[result.winner].accent }}>
              <div className="quiz-panel-head">
                <span className="quiz-result-kicker is-pop">Result · Index complete</span>
                <span className="quiz-panel-note">
                  {QUIZ.length} / {QUIZ.length} logged
                </span>
              </div>
              <h3 className="quiz-result-name">{COLLECTIONS[result.winner].name}</h3>
              <p className="quiz-result-tag">{COLLECTIONS[result.winner].tagline}</p>
              <p className="quiz-result-colors-label">Your colour standards</p>
              <PantoneRow swatches={COLLECTIONS[result.winner].pantone} />
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
                <button className="btn btn-ghost" onClick={() => setAnswers([])}>
                  Retake the index
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

window.Quiz = Quiz
window.QuizRail = QuizRail
