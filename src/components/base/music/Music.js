import fiatPunto from "../../../assets/music/fiat_punto.mp3";
import { useEffect, useState } from "react";
import music from "../../../assets/music/fiat_punto.mp3";
import Button from "../button/Button";
import { MdOutlineMusicNote, MdOutlineMusicOff } from "react-icons/md";
import IconButton from "../button/IconButton";
const Music = () => {
  let [audio, SetAudio] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const Playit = () => {
    audio.play();
    setIsPlaying(true);
  };
  const Stopit = () => {
    audio.pause();
    setIsPlaying(false);
  };
  useEffect(() => {
    audio = new Audio(music);
    audio.loop = true;
    SetAudio(audio);
  }, []);

  return (
    <IconButton onClick={isPlaying ? Stopit : Playit} className={"music"}>
      {isPlaying ? (
        <MdOutlineMusicNote size={20} />
      ) : (
        <MdOutlineMusicOff size={20} />
      )}
    </IconButton>
  );
};
export default Music;
