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
          let options = shuffle([...q.incorrectAnswers, q.correctAnswer])
          return { ...q, options }
        })
        setQuiz(updated)
      })
      .catch(err => console.log(err))
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
    setSelectedOption(opt) // sirf option store karna
  }

  function nextQuestion() {
    // check karna selected option correct hai ya nahi
    if (selectedOption === quiz[index].correctAnswer) {
      setScore(score + 1)
    }

    if (index < quiz.length - 1) {
      setIndex(index + 1)
      setSelectedOption(null) // reset for next question
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
