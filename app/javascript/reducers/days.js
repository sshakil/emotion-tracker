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
    case "CREATE_ENTRIES_SUCCESS":
      // Check if the day exists in the current state
      const dayExists = currentState.some(day => day.date === action.payload.date);

      if (dayExists) {
        return currentState.map(day => {
          if (day.date === action.payload.date) {
            let periodExists = false;
            const updatedPeriods = day.periods.map(period => {
              if (period.name === action.payload.periodName) {
                periodExists = true;
                const updatedEmotions = [
                  ...period.emotions,
                  ...action.payload.entries.map(entry => ({
                    uuid: entry.uuid,
                    name: entry.emotion_name,
                  })),
                ];
                return {
                  ...period,
                  emotions: updatedEmotions,
                };
              }
              return period;
            });

            if (!periodExists) {
              const newPeriod = {
                name: action.payload.periodName,
                emotions: action.payload.entries.map(entry => ({
                  uuid: entry.uuid,
                  name: entry.emotion_name,
                })),
              };
              updatedPeriods.push(newPeriod);
            }

            return {
              ...day,
              periods: updatedPeriods,
            };
          }
          return day;
        });
      } else {
        // If the day doesn't exist, create a new day with the period and add it to the state
        const newDay = {
          date: action.payload.date,
          periods: [
            {
              name: action.payload.periodName,
              emotions: action.payload.entries.map(entry => ({
                uuid: entry.uuid,
                name: entry.emotion_name,
              })),
            },
          ],
        };
        return [...currentState, newDay];
      }
    case "DELETE_ENTRY_SUCCESS":
      return currentState.map(day => {
        if (day.date === action.payload.date) {
          const updatedPeriods = day.periods.map(period => {
            if (period.name === action.payload.periodName) {
              // Filter out the emotion with the matching UUID
              const updatedEmotions = period.emotions.filter(emotion => emotion.uuid !== action.payload.uuid)
              return {
                ...period,
                emotions: updatedEmotions
              }
            }

            return period
          })

          return {
            ...day,
            periods: updatedPeriods
          }
        }
        return day
      })

    default:
      return currentState
  }
}