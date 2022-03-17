const initialState = {
    name: "public-store-default",
    guid: "default"
  }


export default function user(state = initialState, action) {
  console.log("userReducer - action.type: ", action.type)
  switch(action.type) {
    case "GET_USER_SUCCESS":
      return action.json.user;
    default:
      return state
  }
  // return state
}