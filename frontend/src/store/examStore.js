import { create } from 'zustand';

const useExamStore = create((set) => ({
  // Active exam state
  attemptId: null,
  exam: null,
  questions: [],
  answers: {}, // { questionId: selectedOptionIndex }
  currentQuestionIndex: 0,
  startedAt: null,
  results: null,
  userName: '',

  setExamData: (data) =>
    set({
      attemptId: data.attemptId,
      exam: data.exam,
      questions: data.questions,
      startedAt: new Date().toISOString(),
      answers: {},
      currentQuestionIndex: 0,
      results: null,
    }),

  setUserName: (name) => set({ userName: name }),

  setAnswer: (questionId, selectedOptionIndex) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: selectedOptionIndex,
      },
    })),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setResults: (results) => set({ results }),

  reset: () =>
    set({
      attemptId: null,
      exam: null,
      questions: [],
      answers: {},
      currentQuestionIndex: 0,
      startedAt: null,
      results: null,
      userName: '',
    }),
}));

export default useExamStore;
