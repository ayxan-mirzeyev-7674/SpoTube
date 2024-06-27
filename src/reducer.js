export default function reducer(state, action) {
  let newState = state;

  switch (action.type) {
    case "updateQueue":
      newState = { ...state, queue: action.payload };
      break;
    case "updateSearchQueries":
      newState = { ...state, search_queries: action.payload };
      break;
    case "updateVolume":
      newState = { ...state, volume: action.payload };
      break;
    case "updateCurrentMusic":
      newState = { ...state, currentMusic: action.payload };
      break;
    case "updateQueueId":
      newState = { ...state, queue_id: action.payload };
      break;
    default:
      break;
  }

  return newState;
}
