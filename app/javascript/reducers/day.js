const initialState = {
  date: "date",
  periods: [
    {
      name: "Early Morning",
      // guid: "early-morning",
      emotions: [""],
    },
    {
      name: "Morning",
      // guid: "morning",
      emotions: [""],
    },
    {
      name: "Afternoon",
      // guid: "afternoon",
      emotions: [""],
    },
    {
      name: "Evening",
      // guid: "evening",
      emotions: [""],
    },
    {
      name: "Before Bed",
      // guid: "before-bed",
      emotions: [""],
    }
  ]
}

export default function day(state = initialState, action) {
  switch(action.type) {
    case "GET_DAY_SUCCESS":
      console.log("GET_DAY_SUCCESS - action.json - ", action.json)
      return action.json;
    default:
      return state
  }
  // return state
}