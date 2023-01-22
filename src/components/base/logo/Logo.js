import "./Logo.css";

const Logo = ({ size = 50 }) => {
  return (
    <div
      className={"logo"}
      style={{
        fontSize: `${size}px`,
      }}
    >
      <span className={"font-rouge"}>p</span>
      <span className={"font-bleu"}>u</span>
      <span className={"font-jaune"}>n</span>
      <span className={"font-vert"}>t</span>
      <span className={"font-rouge"}>o</span>
    </div>
  );
};

export default Logo;
