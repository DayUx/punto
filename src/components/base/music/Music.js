import fiatPunto from "../../../assets/music/fiat_punto.mp3";
const Music = () => {
  return (
    <div className="music">
      <audio controls>
        <source src={fiatPunto} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
export default Music;
