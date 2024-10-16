import { FETCH_DAY_SUCCESS_FOUND, FETCH_DAY_SUCCESS_NOT_FOUND, CREATE_ENTRIES_SUCCESS } from "../actions"

const initialState = []

export default function days(currentState = initialState, action) {
  switch(action.type) {
    case "GET_DAY_FOR_DATE":
      return currentState.days.find(
        day => day.date === action.date
      )
    case "FETCH_DAY_SUCCESS_FOUND":
      return [...currentState, action.json]
    case "FETCH_DAY_SUCCESS_NOT_FOUND":
      return currentState
    case "CREATE_ENTRIES_SUCCESS": {
      const { date, periodName, entries } = action.payload;

      // Helper to create a new period with the entries
      const createNewPeriod = () => ({
        name: periodName,
        emotions: entries.map(entry => ({
          uuid: entry.uuid,
          name: entry.emotion_name,
        })),
      });

      // Helper to update a day
      const updateDay = day => {
        const updatedPeriods = day.periods.map(period => {
          if (period.name === periodName) {
            // Update the emotions for the existing period
            return {
              ...period,
              emotions: [
                ...period.emotions,
                ...entries.map(entry => ({
                  uuid: entry.uuid,
                  name: entry.emotion_name,
                })),
              ],
            };
          }
          return period;
        });

        // Add new period if it doesn't exist
        const periodExists = updatedPeriods.some(period => period.name === periodName);
        return {
          ...day,
          periods: periodExists ? updatedPeriods : [...updatedPeriods, createNewPeriod()],
        };
      };

      // Check if the day exists
      const dayExists = currentState.some(day => day.date === date);

      // Update existing day or add a new day
      return dayExists
        ? currentState.map(day => (day.date === date ? updateDay(day) : day))
        : [...currentState, { date, periods: [createNewPeriod()] }];
    }
    case "DELETE_ENTRY_SUCCESS": {
      const { date, periodName, uuid } = action.payload;

      return currentState.map(day =>
        day.date === date
          ? {
            ...day,
            periods: day.periods.map(period =>
              period.name === periodName
                ? {
                  ...period,
                  emotions: period.emotions.filter(emotion => emotion.uuid !== uuid)
                }
                : period
            )
          }
          : day
      );
    }

    default:
      return currentState
  }
}