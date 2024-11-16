import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategories, getallQuestions } from "../../Services/Services";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player1, player2 } = location.state;
  const [categories, setCategories] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isOpen, setisOpen] = useState(false);
  const [selectdCategory, setSelectedCategory] = useState(null);
  const [player1score, setPlayer1score] = useState(0);
  const [player2score, setPlayer2score] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleExit = () => {
    if (currentIndex !== -1 && currentIndex < questions.length - 1) {
      alert(
        "Please complete the category to exit the game"
      );
      return;
    }
    console.log({
      player1: player1score,
      player2: player2score,
    })
    navigate("/endgame", {
      state: {
        name1: player1,
        name2: player2,
        score1: player1score,
        score2: player2score,
      },
    });
  };
  const calcScore = () => {
    const scores = {
      easy: 10,
      medium: 15,
      hard: 20,
    };
    if (
      questions[currentIndex].player == "player1" &&
      selectedOption === questions[currentIndex].correctAnswer
    ) {
      setPlayer1score(
        player1score + scores[questions[currentIndex].difficulty]
      );
    } else if (
      questions[currentIndex].player == "player2" &&
      selectedOption === questions[currentIndex].correctAnswer
    ) {
      console.log(selectedOption, questions[currentIndex].correctAnswer);
      setPlayer2score(
        player2score + scores[questions[currentIndex].difficulty]
      );
    }
  };
  const handleNext = () => {
    if (!selectedOption) {
      alert("select a option for going to next question");
      return;
    }
    setSelectedOption(null);
    calcScore();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Category completed! Please select a new category.");
      setQuestions(null);
      setSelectedCategory(null);
      setCurrentIndex(-1);
    }
  };

  const handleToggle = () => {
    setisOpen(!isOpen);
  };

  const handleOptionSelection = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);
  const categoryselected = async (e) => {
    try {
      if (currentIndex !== -1 && currentIndex < questions.length - 1) {
        alert(
          "Please complete all the questions in the current category before selecting a new one."
        );
        setisOpen(false);
        return;
      }

      const cat = e.target.value;
      if (cat === "") {
        return;
      }
      setSelectedCategory(cat);
      const response = await getallQuestions(cat);

      setCategories(
        categories.map((category) => {
          if (Object.keys(category)[0] === cat) {
            return { [cat]: true }; // Mark the category as used
          }
          return category;
        })
      );

      const falseCount = categories.filter(
        (obj) => Object.values(obj)[0] === false
      ).length;

      if (falseCount === 0) {
        console.log("All categories used. Game ends!");
      }

      setCurrentIndex(0);
      setQuestions(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      Game: {player1} vs {player2}
      <label>Select the category for your questions: </label>
      <select
        name="categories"
        multiple
        size={isOpen ? 5 : 1}
        onClick={handleToggle}
        onChange={categoryselected}
        disabled={questions && currentIndex !== questions.length - 1}
      >
        <option value="">{selectdCategory ? selectdCategory : "Select"}</option>

        {categories &&
          Object.values(categories).length > 0 &&
          Object.values(categories).map(
            (obj, index) =>
              Object.values(obj)[0] === false && (
                <option key={index} value={Object.keys(obj)[0]}>
                  {Object.keys(obj)[0]}
                </option>
              )
          )}
      </select>
      <div>
        {questions && currentIndex !== -1 ? (
          <div>
            <p>{questions[currentIndex].player}</p>
            <p>{questions[currentIndex].question.text}</p>
            {questions[currentIndex].incorrectAnswers.map((answer, index) => {
              return (
                <div key={index}>
                  <input
                    type="radio"
                    name="answer"
                    value={answer}
                    onChange={handleOptionSelection}
                    checked={selectedOption === answer}
                  />
                  {answer}
                </div>
              );
            })}
            <button onClick={handleNext}>Next Question</button>
          </div>
        ) : (
          <p>
            {categories
              ? "Select a category to start."
              : "Loading categories..."}
          </p>
        )}
      </div>
      <button onClick={handleExit}>
        Exit Game
      </button>
    </>
  );
};

export default Game;
