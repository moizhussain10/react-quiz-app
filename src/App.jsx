import { useEffect, useState } from 'react'
import './App.css'

function App() {
  let [quiz, setQuiz] = useState([])
  let [index, setIndex] = useState(0)
  let [score, setScore] = useState(0)
  let [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    getDataFromAPI()
  }, [])

  function getDataFromAPI() {
    fetch('https://the-trivia-api.com/v2/questions')
      .then(data => data.json())
      .then(value => {
        let updated = value.map(q => {
          let incorrect = Array.isArray(q.incorrectAnswers)
            ? q.incorrectAnswers
            : [];

          // correctAnswer ko string bana do (agar number ho)
          let correct = typeof q.correctAnswer === "string"
            ? q.correctAnswer
            : String(q.correctAnswer);

          // Sab options ko string convert karo (in case koi number ho)
          incorrect = incorrect.map(item =>
            typeof item === "string" ? item : String(item)
          );

          let options = shuffle([...incorrect, correct]);

          return {
            ...q,
            correctAnswer: correct,
            incorrectAnswers: incorrect,
            options
          };
        });


        setQuiz(updated)
      })
  }

  function shuffle(array) {
    let currentIndex = array.length
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ]
    }
    return array
  }

  function handleAnswer(opt) {
    setSelectedOption(opt)
  }

  function nextQuestion() {
    if (selectedOption === quiz[index].correctAnswer) {
      setScore(score + 1)
    }

    if (index < quiz.length - 1) {
      setIndex(index + 1)
      setSelectedOption(null)
    } else {
      alert(`Quiz Finished! 🎉 Your Score: ${score}/${quiz.length}`)
    }
  }

  if (!quiz.length) {
    return (
      <img
        src="https://static.wixstatic.com/media/68315b_30dbad1140034a3da3c59278654e1655~mv2.gif"
        width="100%"
        alt=""
      />
    )
  }

  return (
    <>
      <h1>Quiz App</h1>
      <p>Score: {score}</p>
      <hr />
      <br />

      <h2>{quiz[index].question.text}</h2>

      <div>
        {quiz[index].options.map((opt, i) => (
          <button
            key={i}
            style={{
              display: "block",
              margin: "10px 0",
              background: selectedOption === opt ? "lightblue" : ""
            }}
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <button onClick={nextQuestion} disabled={!selectedOption}>
        Next
      </button>
    </>
  )
}

export default App
