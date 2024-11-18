import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Home/Navbar";
import useGameStore from "../../Store/store";

const EndGame = () => {
  const navigate = useNavigate();
  const { player1, player2, player1score, player2score, resetGame } =
    useGameStore();

  // Determine winner and runner
  const tie = player1score === player2score;
  const winner = !tie
    ? player1score > player2score
      ? player1
      : player2
    : null;
  const runner = !tie
    ? player1score > player2score
      ? player2
      : player1
    : null;

  // Effect to validate players and display toast notifications
  useEffect(() => {
    if (!player1 || !player2) {
      navigate("/");
      return;
    }

    if (!tie) {
      toast.success(`Congratulations ${winner}!`);
    } else {
      toast.info("The match ended in a tie!");
    }
  }, [player1, player2, player1score, player2score, tie, winner, navigate]);

  const handleGoHome = () => {
    resetGame();
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-slate-200 flex flex-col justify-center items-center">
        {!tie ? (
          <div className="bg-slate-800 lg:w-1/2 sm:w-1/2 p-8 rounded-xl shadow-md text-center">
            <h1 className="text-3xl font-bold mb-6">Game Results</h1>
            <p className="text-xl mb-4">
              <span className="font-bold text-slate-300">Winner:</span> {winner}{" "}
              (Score:{" "}
              <span className="text-green-400">
                {winner === player1 ? player1score : player2score}
              </span>
              )
            </p>
            <p className="text-xl mb-4">
              <span className="font-bold text-slate-300">Runner-Up:</span>{" "}
              {runner} (Score:{" "}
              <span className="text-yellow-400">
                {runner === player1 ? player1score : player2score}
              </span>
              )
            </p>
            <button
              onClick={handleGoHome}
              className="mt-6 bg-slate-600 text-slate-200 px-6 py-2 rounded-md hover:bg-slate-500 transition-all"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 p-8 rounded-xl shadow-md text-center">
            <h1 className="text-3xl font-bold mb-6">It's a Tie!</h1>
            <p className="text-xl mb-4">
              Both players scored{" "}
              <span className="text-green-400 font-bold">{player1score}</span>.
            </p>
            <p className="text-xl mb-6">
              The match is tied. Please navigate to home to play again.
            </p>
            <button
              onClick={handleGoHome}
              className="bg-slate-600 text-slate-200 px-6 py-2 rounded-md hover:bg-slate-500 transition-all"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EndGame;
