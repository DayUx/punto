import logo from "./logo.svg";
import "./App.css";
import Card from "./components/game/card/Card";
import Grid from "./components/game/grid/Grid";

function App() {
  return (
    <div className="App">
      <Grid size={6}></Grid>
      <Card id={"card1"} color="rouge" value={1}></Card>
      <Card id={"card2"} color="vert" value={5}></Card>
      <Card id={"card3"} color="jaune" value={3}></Card>
      <Card id={"card4"} color="bleu" value={6}></Card>
      <Card id={"card5"} color="rouge" value={2}></Card>
    </div>
  );
}

export default App;
