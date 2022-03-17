const initialState = [{
  name: "morning",
  guid: "default"
}]

export default function times(state = initialState, action) {
  console.log("timesReducer - action.type: ", action.type)
  switch(action.type) {
    case "GET_TIMES_SUCCESS":
      return action.json.times;
    default:
      console.log("timesReducer - default")
      return state
  }
  // return state
}