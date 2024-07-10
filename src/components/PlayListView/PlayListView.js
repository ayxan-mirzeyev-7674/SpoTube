import { useParams } from "react-router-dom";
import styles from "./PlayListView.module.css";

function PlayListView() {
  const { id } = useParams();
  return <div style={{ color: "white" }}>PlayList ID : {id}</div>;
}

export default PlayListView;
