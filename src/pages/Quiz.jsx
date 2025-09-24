//HOOK useMemo - lets you derive a value ('like current question') from  other values
import { useMemo, useState } from "react"
//useApp is global context (shared state) using it to read and set the selected region
import { useApp } from '../context/AppContext.jsx';
//custom hook loads countries and gives loading, error and list
import useFetchCountries from "../features/countries/hooks/useFetchCountries.js";

//list for buttons
const REGIONS = ['Europe', 'Asia', 'Oceania', 'Americas', 'Africa'];

//my react component
export default function Quiz() {
  //consolelog to confirm the component is rendering
  // console.log('Quiz mounted');

    //state -> current state in useApp, dispatch -> change global state in useApp
    const { state, dispatch } = useApp();
    //currently chosen region
    const { selectedRegion } = state;
  
    const { loading, error, list } = useFetchCountries();

    //LOCAL COMPONENT STATE:
//phase: controls which screen we show - setup, playing, done
    const [phase, setPhase] = useState('setup');
    //initially empty string, controlled w input
    const [username, setUsername] = useState('');
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    //shape: { name: 'sweden', correct: true }
    const [lastResult, setLastResult] = useState(null);

    const totalNrQuestions = 15;
    // - we wrap in useMemo to avoid recalculating unless questions or index change. 
    // - when app first loads, questions is [], so current will be undefined - its ok - only render when current question exist.
    const current = useMemo(() => questions[index], [questions, index]);

    // - calls your global reducer to set the selected region in app state
    function handleSelected(region) {
      dispatch({ type: 'SET_REGION', payload: region });
    }

    //quiz start
    // mental model:
    // 1. 'start' = prepare data (questions)
    // 2. then tell the UI which screen to show (phase)
    function startQuiz(e) {
      e.preventDefault();
      // - guard. if username or region is missing -> do nothing
      if (!username || !selectedRegion) return;

      // - we build a pool / simplified array that only contains what we need for the questions: name + flag
      const pool = list.map(c => ({
        name: c.name.common,
        flagPng: c.flags.png
      }));

      // - pick 15 random
      // - we shuffle that array
      // - we take the first 15 as our questions for this run and save them in state
      // - we switch to phase=playing so the UI shows the quiz
      const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
      setQuestions(shuffledPool.slice(0, totalNrQuestions));
      setPhase('playing');
    }
    // core game logic
    function submitAnswer(e) {
      e.preventDefault();
      if (!current) return;

      //compare the users answer to the current country name. if correct -> increment score
      const correct = answer.trim().toLowerCase() === current.name.toLowerCase();
      setLastResult({ name: current.name, correct });
      if (correct) setScore(s => s + 1);

      //if we've reached the last question -> 'done'
      //otherwise increase index and clear the input field
      const next = index + 1;
      if (next >= totalNrQuestions) {
        // save score to localStorage if last question
        const entry = { username,
                        region: selectedRegion, 
                        score, 
                        total: totalNrQuestions, 
                        date: new Date().toISOString()
                      };
        const prevResInStorage = JSON.parse(localStorage.getItem('quizResults') || '[]');
        //save new result + all the old ones
        localStorage.setItem('quizResults', JSON.stringify([entry, ...prevResInStorage]));
        // console.log(entry);
        setPhase('done');
      } else {
        setIndex(next);
        setAnswer('');
      }

  
    }

    return (
      <div className="quiz-app">
        {phase === 'setup' && (
          <form 
          onSubmit={startQuiz}
          className="quiz-form"
          >
            <h2>Flag Quiz</h2>
            <hr className="hr-normal hr-quiz"/>

            <label>
              Username:
              <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              />
            </label>

            <div>
              {REGIONS.map((r) => (
                <button
                key={r}
                type="button"
                className="btn"
                onClick={() => handleSelected(r)}
                style={{ opacity: selectedRegion === r ? 1 : 0.7 }}
                >
                  {r}
                </button>
              ))}
            </div>

            {selectedRegion && loading && <p>Loading...</p>}
            {selectedRegion && error && <p>Error loading countries</p>}

            <button 
            type="submit" 
            disabled={!selectedRegion || loading}
            className="submit-btn btn"
            >Start</button>
          </form>
        )}

      {phase === "playing" && current && (
        <section className="quiz-section">
          <h3>Question {index + 1}/{totalNrQuestions}</h3><p>Current Score: {score}</p>
          {lastResult && (
            <p>
              Previous: <strong>{lastResult.name}</strong> - {lastResult.correct ? 'Correct' : 'Wrong'}
            </p>
          )}
          <img src={current.flagPng} alt={`Flag of ${current.name}`} />

          <form 
          onSubmit={submitAnswer}
          className="submit-question-form"
          >
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type Name..."
            />
            <button 
            type="submit"
            className="btn"
            >Submit</button>
          </form>
        </section>
      )}

      {phase === "done" && (
        <section className="done-quiz">
          <h3>Well Played!</h3>
          <p>{username} got {score} / {totalNrQuestions}</p>
        </section>
      )}
      </div>
    );
  }