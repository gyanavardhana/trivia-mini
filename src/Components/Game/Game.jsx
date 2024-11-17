import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategories, getallQuestions } from "../../Services/Services";
import Navbar from "../Home/Navbar";
import { toast } from "react-toastify";
const Game = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { player1, player2 } = location.state || {};
  const [categories, setCategories] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isOpen, setisOpen] = useState(false);
  const [selectdCategory, setSelectedCategory] = useState(null);
  const [player1score, setPlayer1score] = useState(0);
  const [player2score, setPlayer2score] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, []);
  const handleExit = () => {
    if (currentIndex !== -1 && currentIndex < questions.length - 1) {
      toast.error("Please complete the category to exit the game");
      return;
    }
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
      questions[currentIndex].player === "player1" &&
      selectedOption === questions[currentIndex].correctAnswer
    ) {
      setPlayer1score(
        player1score + scores[questions[currentIndex].difficulty]
      );
    } else if (
      questions[currentIndex].player === "player2" &&
      selectedOption === questions[currentIndex].correctAnswer
    ) {
      setPlayer2score(
        player2score + scores[questions[currentIndex].difficulty]
      );
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast.error("Select an option before moving to the next question.");
      return;
    }
    setSelectedOption(null);
    calcScore();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.error("Category completed! Please select a new category.");
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
        toast.error(
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
      toast.success("Game Started.")
      const response = await getallQuestions(cat);
      setCategories(
        categories.map((category) => {
          if (Object.keys(category)[0] === cat) {
            return { [cat]: true }; 
          }
          return category;
        })
      );

      setCurrentIndex(0);
      setQuestions(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  text-slate-700">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-center text-3xl font-bold mb-8">
            Game: <span className="text-slate-700">{player1}</span> vs{" "}
            <span className="text-slate-700">{player2}</span>
          </h1>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">
              Select the category for your questions:
            </label>
            <select
              name="categories"
              multiple
              size={isOpen ? 5 : 1}
              onClick={handleToggle}
              onChange={categoryselected}
              disabled={questions && currentIndex !== questions.length - 1}
              className="w-full p-2 border-2 border-slate-500 rounded-md focus:ring-2 focus:ring-slate-800 bg-slate-200 text-slate-800"
            >
              <option value="" >
                {selectdCategory ? selectdCategory : "Select"}
              </option>
              {categories &&
                Object.values(categories).length > 0 &&
                Object.values(categories).map(
                  (obj, index) =>
                    Object.values(obj)[0] === false && (
                      <option
                        key={index}
                        value={Object.keys(obj)[0]}
                        className="bg-slate-200 text-slate-800  "
                      >
                        {Object.keys(obj)[0]}
                      </option>
                    )
                )}
            </select>
          </div>
          <div>
            {questions && currentIndex !== -1 ? (
              <div className="bg-slate-800 text-slate-200 p-6 rounded-xl shadow-lg">
                <p className="text-lg mb-4">
                  Current Turn:{" "}
                  <span className="font-bold text-slate-300">
                    {questions[currentIndex].player === "player1"? player1: player2}
                  </span>
                </p>
                <p className="text-xl font-semibold mb-4">
                  {questions[currentIndex].question.text}
                </p>
                {questions[currentIndex].incorrectAnswers.map(
                  (answer, index) => (
                    <div key={index} className="mb-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="answer"
                          value={answer}
                          onChange={handleOptionSelection}
                          checked={selectedOption === answer}
                          className="accent-slate-500 cursor-pointer"
                        />
                        {answer}
                      </label>
                    </div>
                  )
                )}
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-slate-600 text-slate-200 py-2 rounded-md hover:bg-slate-500 transition-all"
                >
                  Next Question
                </button>
              </div>
            ) : (
              <p className="text-lg text-center">
                {categories
                  ? "Select a category to start."
                  : "Loading categories..."}
              </p>
            )}
          </div>
          <button
            onClick={handleExit}
            className="mt-6 w-full bg-slate-600 text-slate-200 py-2 rounded-md hover:bg-slate-500 transition-all"
          >
            Exit Game
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
