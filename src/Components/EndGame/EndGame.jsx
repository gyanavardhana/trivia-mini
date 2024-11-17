import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import Navbar from "../Home/Navbar";

const EndGame = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const { name1, name2, score1, score2 } = location.state || {};

  const [winner, setWinner] = useState(null);
  const [runner, setRunner] = useState(null);
  const [tie, setTie] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }

    if (score1 > score2) {
      toast.success(`Congratulations ${name1}`)
      setWinner(name1);
      setRunner(name2);
    } else if (score2 > score1) {
      toast.success(`Congratulations ${name2}`)
      setRunner(name1);
      setWinner(name2);
    } else {
      toast.success("Match Tie")
      setTie(true);
    }
  }, [location.state, navigate, name1, name2, score1, score2]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-slate-200 flex flex-col justify-center items-center">
        {!tie ? (
          <div className="bg-slate-800 lg:w-1/2 sm:w-1/2 p-8 rounded-xl shadow-md text-center">
            <h1 className="text-3xl font-bold mb-6">Game Results</h1>
            <p className="text-xl mb-4">
              <span className="font-bold text-slate-300">Winner:</span> {winner}{" "}
              (Score: <span className="text-green-400">{winner === name1 ? score1 : score2}</span>)
            </p>
            <p className="text-xl mb-4">
              <span className="font-bold text-slate-300">Runner-Up:</span> {runner}{" "}
              (Score: <span className="text-yellow-400">{runner === name1 ? score1 : score2}</span>)
            </p>
            <button
              onClick={() => navigate("/")}
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
              <span className="text-green-400 font-bold">{score1}</span>.
            </p>
            <p className="text-xl mb-6">
              The match is tied. Please navigate to home to play again.
            </p>
            <button
              onClick={() => navigate("/")}
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
