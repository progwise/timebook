import { ChangeEvent, FocusEvent, useState } from "react";

export interface IWorkDuration {
  hours: number;
  minutes: number;
}

export const getWorkDuration = (timeString: string): IWorkDuration => {
  let parts = timeString.split(":");
  if (parts.length > 1) {
    return {
      hours: parseInt(parts[0]),
      minutes: parseInt(parts[1]),
    };
  }

  return {
    hours: parseInt(timeString),
    minutes: 0,
  };
};

function pad(value: number) {
  return value < 10 ? "0" + value.toString() : value.toString();
}

export const HourInput = () => {
  const [formattedDuration, setFormattedDuration] = useState("0:00");

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const newDuration = getWorkDuration(event.target.value);
    setFormattedDuration(`${newDuration.hours}:${pad(newDuration.minutes)}`);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormattedDuration(event.target.value);
  };

  return (
    <div className="border w-14">
      <input
        className="w-full text-center p-1"
        type="text"
        name="hours"
        placeholder="0:00"
        onBlur={handleOnBlur}
        value={formattedDuration}
        onChange={handleOnChange}
      />
    </div>
  );
};
