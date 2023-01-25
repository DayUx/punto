import "./SegmentedButton.css";
import { useEffect, useState } from "react";

const SegmentedButton = ({
  options = {},
  value,
  onChange = function () {
    return;
  },
}) => {
  const [selected, setSelected] = useState(value);
  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <div className={"segmentedButton"}>
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={
              "segmentedButtonOption" +
              (selected === option.value ? " selected" : "")
            }
            onClick={function (e) {
              onChange(option.value);
              setSelected(option.value);
            }}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};
export default SegmentedButton;
