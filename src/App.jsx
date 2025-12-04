import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    getDataFromAPI();
  }, []);

  function getDataFromAPI() {
    fetch("https://the-trivia-api.com/v2/questions")
      .then((res) => res.json())
      .then((value) => {
        const updated = value.map((q) => {
          // ---- QUESTION TEXT SAFE ----------
          let questionText = "";
          if (q.question && typeof q.question === "object" && q.question.text) {
            questionText = String(q.question.text);
          } else if (typeof q.question === "string") {
            questionText = q.question;
          } else {
            questionText = "Unknown Question";
          }

          // ---- CORRECT ANSWER SAFE ----------
          let correct =
            typeof q.correctAnswer === "string"
              ? q.correctAnswer
              : String(q.correctAnswer ?? "");

          // ---- INCORRECT ANSWERS SAFE -------
          let incorrect = Array.isArray(q.incorrectAnswers)
            ? q.incorrectAnswers.map((item) => String(item))
            : [];

          // ---- OPTIONS SAFE -----------------
          let options = shuffle([...incorrect, correct]);

          return {
            questionText,
            correct,
            options,
          };
        });

        setQuiz(updated);
      })
      .catch((err) => console.log("Error fetching quiz:", err));
  }

  function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function handleAnswer(opt) {
    setSelectedOption(opt);
  }

  function nextQuestion() {
    if (selectedOption === quiz[index].correct) {
      setScore((prev) => prev + 1);
    }

    if (index < quiz.length - 1) {
      setIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      alert(`Quiz Finished! 🎉 Your Score: ${score}/${quiz.length}`);
    }
  }

  if (!quiz.length) {
    return (
      <img
        src="https://static.wixstatic.com/media/68315b_30dbad1140034a3da3c59278654e1655~mv2.gif"
        width="100%"
        alt="Loading..."
      />
    );
  }

  return (
    <div className="App">
      <h1>Quiz App</h1>
      <p>Score: {score}</p>
      <hr />

      <h2>{quiz[index].questionText}</h2>

      <div>
        {quiz[index].options.map((opt, i) => (
          <button
            key={i}
            style={{
              display: "block",
              margin: "10px 0",
              background: selectedOption === opt ? "lightblue" : "",
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
    </div>
  );
}

export default App;
