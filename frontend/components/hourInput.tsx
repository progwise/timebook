import { ChangeEvent, FocusEvent, useState } from "react";

export interface IWorkDuration {
  hours: number;
  minutes: number;
}

export const getWorkDuration = (s: string): IWorkDuration => {
  let parts = s.split(":");
  if (parts.length === 1) {
    return {
      hours: parseInt(parts[0]),
      minutes: 0,
    };
  } else if (parts.length > 1) {
    return {
      hours: parseInt(parts[0]),
      minutes: parseInt(parts[1]),
    };
  }

  return {
    hours: parseInt(s),
    minutes: 0,
  };
};

function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}

export const HourInput = () => {
  const [workDuration, setWorkDuration] = useState<IWorkDuration>({
    hours: 0,
    minutes: 0,
  });
  const [formattedDuration, setFormattedDuration] = useState("0:00");

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const newDuration = getWorkDuration(event.target.value);
    setWorkDuration(newDuration);
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
