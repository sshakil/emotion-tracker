// todo - needs to be an array
const initialState = [
  {
    date: "2022-04-04",
    periods: [
      {
        name: "earlyMorning",
        emotions: [
          {
            name: "ok"
          }
        ],
      },
      {
        name: "morning",
        emotions: [],
      },
      {
        name: "afternoon",
        emotions: [],
      },
      {
        name: "evening",
        emotions: [],
      },
      {
        name: "beforeBed",
        emotions: [],
      }
    ]
  },
  {
    date: "2022-04-05",
    periods: [
      {
        name: "earlyMorning",
        emotions: [
          {
            name: "ok"
          }
        ],
      },
      {
        name: "morning",
        emotions: [],
      },
      {
        name: "afternoon",
        emotions: [],
      },
      {
        name: "evening",
        emotions: [],
      },
      {
        name: "beforeBed",
        emotions: [],
      }
    ]
  }
]

export default function days(currentState = initialState, action) {
  switch(action.type) {
    case "GET_DAY":
      console.log("GET_DAY - ", initialState[0])
      return initialState[0]
    case "GET_DAY_SUCCESS_FOUND":
      console.log("GET_DAY_SUCCESS_FOUND, adding this in - ", action.json)
      return [...currentState, action.json]
    case "GET_DAY_SUCCESS_NOT_FOUND":
      console.log("GET_DAY_SUCCESS_NOT_FOUND")
      return currentState
    default:
      return currentState
  }
}