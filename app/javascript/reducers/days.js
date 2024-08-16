import { FETCH_DAY_SUCCESS_FOUND, FETCH_DAY_SUCCESS_NOT_FOUND, CREATE_ENTRIES_SUCCESS } from "../actions"

const initialState = []

export default function days(currentState = initialState, action) {
  switch(action.type) {
    case "GET_DAY_FOR_DATE":
      return currentState.days.find(
        day => day.date === action.date
      )
    case "FETCH_DAY_SUCCESS_FOUND":
      // console.log("GET_DAY_SUCCESS_FOUND, adding this in - ", action.json)
      return [...currentState, action.json]
    case "FETCH_DAY_SUCCESS_NOT_FOUND":
      return currentState
    case "CREATE_ENTRIES_SUCCESS":
      // Update the state to include the new emotion
      return currentState.map(day => {
        if (day.date === action.payload.date) {
          let periodExists = false
          const updatedPeriods = day.periods.map(period => {
            if (period.name === action.payload.periodName) {
              periodExists = true
              return {
                ...period,
                emotions: [...period.emotions, ...action.payload.emotions]
              }
            }
            return period
          })

          if (!periodExists) {
            updatedPeriods.push({
              name: action.payload.periodName,
              emotions: action.payload.emotions
            })
          }

          return {
            ...day,
            periods: updatedPeriods
          }
        }
        return day
      })
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