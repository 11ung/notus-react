import { initialMeasureScores } from './DataValidation';

export const initialState = {
  results: initialMeasureScores,
  trends: [],
};

export const DashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
      }
    case 'SET_TRENDS':
      return {
        ...state,
        trends: action.payload,
      }
    default:
      return state;
  }
}
