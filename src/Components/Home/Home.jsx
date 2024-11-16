import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    player1: "",
    player2: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const startGame = () => {
    if (formData.player1 === "" || formData.player2 === "") {
      alert("Players names should not be empty");
    } else {
      navigate("/game", {
        state: { player1: formData.player1, player2: formData.player2 },
      });
    }
  };
  return (
    <>
      <div>
        <label>Enter the player1 name: </label>
        <input
          id="player1"
          name="player1"
          value={formData.player1}
          onChange={handleChange}
          type="text"
        ></input>
        <label>Enter the player2 name: </label>
        <input
          id="player2"
          name="player2"
          type="text"
          onChange={handleChange}
          value={formData.player2}
        ></input>
        <button onClick={startGame}>Play the game</button>
      </div>
    </>
  );
};

export default Home;
