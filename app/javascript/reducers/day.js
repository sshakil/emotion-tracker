const initialState = {
  date: "date",
  periods: [
    {
      name: "earlyMorning",
      emotions: [],
    },
    {
      name: "morning",
      emotions: [
        {
          name: "place"
        }
      ],
    },
    {
      name: "afternoon",
      emotions: [
        {
          name: "place"
        },
        {
          name: "holder"
        },
        {
          name: "text as"
        }
      ],
    },
    {
      name: "evening",
      emotions: [
        {
          name: "place"
        },
        {
          name: "holder"
        },
      ],
    },
    {
      name: "beforeBed",
      emotions: [],
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