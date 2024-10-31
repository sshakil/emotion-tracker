import {
  FETCH_DAY_SUCCESS_FOUND,
  FETCH_DAY_SUCCESS_NOT_FOUND,
  CREATE_ENTRIES_SUCCESS,
  FETCH_DAYS_SUCCESS,
  FETCH_DAYS_FAILURE
} from "../actions"

const initialState = []

// Helper function to get the period name based on its ID
function getPeriodNameById(id) {
  const periodMapping = {
    1: 'Early Morning',
    2: 'Morning',
    3: 'Afternoon',
    4: 'Evening',
    5: 'Before Bed'
  };
  return periodMapping[id] || 'Unknown Period';
}

// Helper function to transform `day_periods` to `periods`
const transformDayPeriods = (day_periods) => {
  return day_periods.map(day_period => ({
    name: getPeriodNameById(day_period.period_id), // Assuming you have a mapping function
    emotions: day_period.entries.map(entry => ({
      uuid: entry.uuid,
      name: entry.emotion.name,
    }))
  }));
};

export default function days(currentState = initialState, action) {
  switch(action.type) {
    case FETCH_DAYS_SUCCESS:
      return action.payload.map(day => ({
        date: day.date,
        periods: transformDayPeriods(day.day_periods)
      }))
    case FETCH_DAYS_FAILURE:
      return currentState
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