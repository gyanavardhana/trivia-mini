import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EndGame = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state from location
  const { name1, name2, score1, score2 } = location.state || {};

  const [winner, setWinner] = useState(null);
  const [runner, setRunner] = useState(null);
  const [tie, setTie] = useState(false);

  // Determine the winner and runner once on mount
  useEffect(() => {
    if (!location.state) {
      // Redirect if accessed without proper state
      navigate("/");
      return;
    }

    if (score1 > score2) {
      setWinner(name1);
      setRunner(name2);
    } else if (score2 > score1) {
      setRunner(name1);
      setWinner(name2);
    } else {
      setTie(true);
    }
  }, [location.state, navigate, name1, name2, score1, score2]);

  return (
    <>
      {!tie ? (
        <div>
          <h1>Winner: {winner}</h1>
          <h1>Runner: {runner}</h1>
        </div>
      ) : (
        <div>
          <p>The match is tied. Please navigate to home to play again.</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      )}
    </>
  );
};

export default EndGame;
