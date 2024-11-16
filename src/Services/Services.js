import axios from 'axios';

export const getCategories = async (category) => {
    try {
        const URL = `https://the-trivia-api.com/v2/categories`;
        const response = await axios.get(URL);
        const categories = response.data;
        const filteredcategories = Object.values(categories).flat();
        const mappedCategories = filteredcategories.map(category => ({ [category]: false }));
        return mappedCategories;
    } catch (error) {
        console.log("Something wrong happend: " + error);
    }
}

export const getallQuestions = async (category) => {
    try {
        const easyURL = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=easy&limit=2`
        const mediumURL = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=medium&limit=2`
        const hardURL = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=hard&limit=2`
        const [easyResponse, mediumResponse, hardResponse] = await Promise.all([
            axios.get(easyURL),
            axios.get(mediumURL),
            axios.get(hardURL),
        ]);

        const allQuestions = [
            ...easyResponse.data,
            ...mediumResponse.data,
            ...hardResponse.data,
        ];

        const modquestions = allQuestions.map((question, index) => {
            const newQuestion = { ...question }; // create a new object
            if (index % 2 === 0) {
              newQuestion['player'] = 'player1';
            } else {
              newQuestion['player'] = 'player2';
            }
            newQuestion['incorrectAnswers'].push(newQuestion['correctAnswer']);
            return newQuestion;
          });
        return modquestions;
    } catch (error) {
        console.log("Something wrong happened: " + error);
    }
}

