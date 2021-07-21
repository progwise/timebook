import React, { ReactChild, ReactChildren } from "react";
//import { DaySelector } from "../components/daySelector";
import { HourInput } from "../components/hourInput";
import { CalendarSelector } from "../components/calendarSelector";
import { WeekSelector } from "../components/weekSelector";

const Time = () => {
  const ColumnHeader = (props: { children: ReactChildren | ReactChild }) => {
    return <th className="text-left">{props.children}</th>;
  };

  const handleSelectedWeekChange = (year: number, week: number) => {
    console.log("receive changed week", year, week);
  };

  return (
    <article>
      <h2>Your timetable</h2>
      <div>
        <CalendarSelector />
        <WeekSelector onChange={handleSelectedWeekChange} />
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <ColumnHeader>M</ColumnHeader>
            <ColumnHeader>T</ColumnHeader>
            <ColumnHeader>W</ColumnHeader>
            <ColumnHeader>Th</ColumnHeader>
            <ColumnHeader>F</ColumnHeader>
            <ColumnHeader>S</ColumnHeader>
            <ColumnHeader>Su</ColumnHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <HourInput></HourInput>
            </td>
            <td>
              <HourInput></HourInput>
            </td>
            <td>
              <HourInput></HourInput>
            </td>
            <td>
              <HourInput></HourInput>
            </td>
            <td>
              <HourInput></HourInput>
            </td>
            <td>
              <HourInput></HourInput>
            </td>
            <td>
              <HourInput></HourInput>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
};

export default Time;
