import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    player1: "",
    player2: "",
  });
  useEffect(() =>{
    toast.success("Welcome to TriviaGame");
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const startGame = () => {
    if (formData.player1 === "" || formData.player2 === "") {
      toast.error("Players names should not be empty")
    } else {
      navigate("/game", {
        state: { player1: formData.player1, player2: formData.player2 },
      });
    }
  };
  return (
    <>
      <div>
        <Navbar />
        <div className="flex justify-center">
          <div className="bg-slate-700 h-max lg:w-1/3 sm:w-1/2 rounded-2xl mt-24 p-8  ">
            <h1 className="text-slate-200 text-center text-2xl font-bold mb-6">
              Enter player names
            </h1>
            <form className="space-y-8 text-center">
              <label
                className="block text-left font-medium text-xl text-slate-200"
                htmlFor="player1"
              >
                Player 1:
              </label>
              <input
                id="player1"
                name="player1"
                value={formData.player1}
                onChange={handleChange}
                className="w-full p-2 rounded-md border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                type="text"
              />
              <label
                className="block text-left font-medium text-xl text-slate-200"
                htmlFor="player2"
              >
                Player 2:
              </label>
              <input
                id="player2"
                name="player2"
                type="text"
                onChange={handleChange}
                value={formData.player2}
                className="w-full p-2 rounded-md border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <button
                onClick={() => {
                  startGame();
                }}
                type="button"
                className="w-full bg-slate-600 text-slate-200 p-2 rounded-md hover:bg-slate-500 transition-all"
              >
                Play the Game
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
