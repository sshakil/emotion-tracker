const initialState = [{
  name: "Morning",
  guid: "default",
  emotions: ["ok"],
}]

export default function times(state = initialState, action) {
  switch(action.type) {
    case "GET_TIMES_SUCCESS":
      return action.json.times;
    default:
      return state
  }
  // return state
}