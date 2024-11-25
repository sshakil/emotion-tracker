const initialState = [{
  name: "Morning",
  guid: "default",
  emotions: ["ok"],
}]

export default function times(state = initialState, action) {
  switch(action.type) {
    case "GET_TIMES_SUCCESS":
      console.log("GET_TIMES_SUCCESS - action.json - ", action.json)
      return action.json.times
    default:
      return state
  }
}