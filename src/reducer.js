export default function reducer(state, action) {
  let newState = state;

  switch (action.type) {
    case "updateQueue":
      newState = { ...state, queue: action.payload };
      break;
    case "updateSearchQueries":
      newState = { ...state, search_queries: action.payload };
      break;
    default:
      break;
  }

  return newState;
}
