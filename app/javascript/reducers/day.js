const initialState = {
  date: "date",
  periods: [
    {
      name: "Early Morning",
      emotions: [],
    },
    {
      name: "Morning",
      emotions: [
        {
          name: "place"
        }
      ],
    },
    {
      name: "Afternoon",
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
      name: "Evening",
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
      name: "Before Bed",
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