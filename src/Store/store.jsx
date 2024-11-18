import { create } from 'zustand';
import { getCategories, getallQuestions } from '../Services/Services';
import { toast } from "react-toastify";
import { devtools , persist} from "zustand/middleware";

const useGameStore = create(
  devtools((set, get) => ({
    player1: "",
    player2: "",
    player1score: 0,
    player2score: 0,

    categories: null,
    questions: null,
    currentIndex: -1,
    selectedOption: null,
    selectedCategory: null,
    isOpen: false,

    setPlayers: (player1, player2) =>
      set({ player1, player2 }, false, 'GameStore/setPlayers'),

    resetGame: () =>
      set(
        {
          player1score: 0,
          player2score: 0,
          questions: null,
          currentIndex: -1,
          selectedOption: null,
          selectedCategory: null,
          isOpen: false,
        },
        false,
        'GameStore/resetGame'
      ),

    toggleCategoryDropdown: () =>
      set(
        (state) => ({ isOpen: !state.isOpen }),
        false,
        'GameStore/toggleCategoryDropdown'
      ),

    setSelectedOption: (option) =>
      set({ selectedOption: option }, false, 'GameStore/setSelectedOption'),

    fetchCategories: async () => {
      try {
        const response = await getCategories();
        set({ categories: response }, false, 'GameStore/fetchCategories');
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch categories');
      }
    },

    selectCategory: async (category) => {
      const state = get();
      try {
        if (state.currentIndex !== -1 && state.currentIndex < state.questions?.length - 1) {
          toast.error('Please complete current category first');
          set({ isOpen: false }, false, 'GameStore/closeCategoryDropdown');
          return;
        }

        if (category === '') return;

        const response = await getallQuestions(category);
        set(
          {
            selectedCategory: category,
            questions: response,
            currentIndex: 0,
            categories: state.categories.map((cat) => {
              if (Object.keys(cat)[0] === category) {
                return { [category]: true };
              }
              return cat;
            }),
          },
          false,
          'GameStore/selectCategory'
        );
        toast.success('Game Started');
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch questions');
      }
    },

    calculateScore: () => {
      const state = get();
      const scores = { easy: 10, medium: 15, hard: 20 };
      const currentQuestion = state.questions[state.currentIndex];

      if (state.selectedOption === currentQuestion.correctAnswer) {
        if (currentQuestion.player === 'player1') {
          set(
            (state) => ({
              player1score: state.player1score + scores[currentQuestion.difficulty],
            }),
            false,
            'GameStore/updatePlayer1Score'
          );
        } else {
          set(
            (state) => ({
              player2score: state.player2score + scores[currentQuestion.difficulty],
            }),
            false,
            'GameStore/updatePlayer2Score'
          );
        }
      }
    },

    nextQuestion: () => {
      const state = get();
      if (!state.selectedOption) {
        toast.error('Select an option before moving to the next question');
        return;
      }

      state.calculateScore();

      if (state.currentIndex < state.questions.length - 1) {
        set(
          (state) => ({
            currentIndex: state.currentIndex + 1,
            selectedOption: null,
          }),
          false,
          'GameStore/nextQuestion'
        );
      } else {
        toast.error('Category completed! Please select a new category');
        set(
          {
            questions: null,
            selectedCategory: null,
            currentIndex: -1,
            selectedOption: null,
          },
          false,
          'GameStore/resetAfterCategory'
        );
      }
    },
  }))
);

export default useGameStore;
