import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useGameStore from "../../Store/store";
import Navbar from "../Home/Navbar";

const Game = () => {
  const navigate = useNavigate();
  const {
    player1,
    player2,
    categories,
    questions,
    currentIndex,
    selectedOption,
    selectedCategory,
    isOpen,
    player1score,
    player2score,
    fetchCategories,
    toggleCategoryDropdown,
    selectCategory,
    setSelectedOption,
    nextQuestion,
  } = useGameStore();

  useEffect(() => {
    if (!player1 || !player2) {
      navigate("/");
      return;
    }
    fetchCategories();
  }, [player1, player2, navigate, fetchCategories]);

  const handleExit = () => {
    if (currentIndex !== -1 && currentIndex < questions?.length - 1) {
      toast.error("Please complete the category to exit the game");
      return;
    }
    navigate("/endgame");
  };

  const handleCategorySelection = (e) => {
    const category = e.target.value;
    selectCategory(category);
  };

  const handleOptionSelection = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = () => {
    nextQuestion();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-slate-700">
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
              multiple={isOpen}
              size={isOpen ? 5 : 1}
              onClick={toggleCategoryDropdown}
              onChange={handleCategorySelection}
              disabled={questions && currentIndex < questions.length - 1}
              className="w-full p-2 border-2 border-slate-500 rounded-md focus:ring-2 focus:ring-slate-800 bg-slate-200 text-slate-800"
            >
              <option value="">
                {selectedCategory ? selectedCategory : "Select"}
              </option>
              {categories &&
                categories.length > 0 &&
                categories.map((obj, index) => {
                  const categoryName = Object.keys(obj)[0];
                  const isDisabled = Object.values(obj)[0];
                  return (
                    !isDisabled && (
                      <option
                        key={index}
                        value={categoryName}
                        className="bg-slate-200 text-slate-800"
                      >
                        {categoryName}
                      </option>
                    )
                  );
                })}
            </select>
          </div>
          <div>
            {questions && currentIndex !== -1 ? (
              <div className="bg-slate-800 text-slate-200 p-6 rounded-xl shadow-lg">
                <p className="text-lg mb-4">
                  Current Turn:{" "}
                  <span className="font-bold text-slate-300">
                    {questions[currentIndex].player === "player1"
                      ? player1
                      : player2}
                  </span>
                </p>
                <p className="text-xl font-semibold mb-4">
                  {questions[currentIndex].question.text}
                </p>
                {[...questions[currentIndex].incorrectAnswers]
                  .sort() // Randomize options
                  .map((answer, index) => (
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
                  ))}
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
