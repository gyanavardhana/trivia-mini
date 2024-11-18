import { create } from 'zustand';
import { getCategories, getallQuestions } from '../Services/Services';
import { toast } from "react-toastify"

const useGameStore = create((set, get) => ({
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

    setPlayers: (player1, player2) => set({ player1, player2 }),

    resetGame: () => set({
        player1score: 0,
        player2score: 0,
        questions: null,
        currentIndex: -1,
        selectedOption: null,
        selectedCategory: null,
        isOpen: false
    }),

    toggleCategoryDropdown: () => set(state => ({ isOpen: !state.isOpen })),

    setSelectedOption: (option) => set({ selectedOption: option }),

    fetchCategories: async () => {
        try {
            const response = await getCategories()
            set({ categories: response })
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch categories')
        }
    },

    selectCategory: async (category) => {
        const state = get()
        try {
            if (state.currentIndex !== -1 && state.currentIndex < state.questions?.length - 1) {
                toast.error('Please complete current category first')
                set({ isOpen: false })
                return
            }

            if (category === '') return

            const response = await getallQuestions(category)
            set({
                selectedCategory: category,
                questions: response,
                currentIndex: 0,
                categories: state.categories.map(cat => {
                    if (Object.keys(cat)[0] === category) {
                        return { [category]: true }
                    }
                    return cat
                })
            })
            toast.success('Game Started')
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch questions')
        }
    },

    calculateScore: () => {
        const state = get()
        const scores = { easy: 10, medium: 15, hard: 20 }
        const currentQuestion = state.questions[state.currentIndex]

        if (state.selectedOption === currentQuestion.correctAnswer) {
            if (currentQuestion.player === 'player1') {
                set(state => ({
                    player1score: state.player1score + scores[currentQuestion.difficulty]
                }))
            } else {
                set(state => ({
                    player2score: state.player2score + scores[currentQuestion.difficulty]
                }))
            }
        }
    },

    nextQuestion: () => {
        const state = get()
        if (!state.selectedOption) {
            toast.error('Select an option before moving to the next question')
            return
        }

        state.calculateScore()

        if (state.currentIndex < state.questions.length - 1) {
            set(state => ({
                currentIndex: state.currentIndex + 1,
                selectedOption: null
            }))
        } else {
            toast.error('Category completed! Please select a new category')
            set({
                questions: null,
                selectedCategory: null,
                currentIndex: -1,
                selectedOption: null
            })
        }
    }
}))




export default useGameStore;