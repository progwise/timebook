import { useState } from "react";
import { composeExchanges } from "urql";

const DayItem = (props: {
  day: Date;
  selectedDate: Date;
  onClick: (day: Date) => void;
}): JSX.Element => {
  const day = props.day;
  const selectedDate = props.selectedDate;
  const dayString = day.getDate();

  const classNames = Array<string>();

  classNames.push("text-center border cursor-pointer p-0");

  const isSelectedYearAndMonth =
    selectedDate.getFullYear() === day.getFullYear() &&
    selectedDate.getMonth() === day.getMonth();

  if (isSelectedYearAndMonth) {
  } else {
    classNames.push("italic");
  }

  if (selectedDate.toLocaleDateString() === day.toLocaleDateString()) {
    classNames.push("border-red-700");
  }

  if (day.getDay() === 6 || day.getDay() === 0) {
    classNames.push("text-green-600");
  } else if (isSelectedYearAndMonth) {
    classNames.push("font-bold");
  }

  return (
    <div className={classNames.join(" ")} onClick={() => props.onClick(day)}>
      {dayString}
    </div>
  );
};

export const CalendarSelector = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarExpanded, setCalendarExpanded] = useState(false);

  const toggleCalendarExpanded = () =>
    calendarExpanded ? setCalendarExpanded(false) : setCalendarExpanded(true);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const firstDayOfSelectedMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  const getPreviousMonday = (startDate: Date): Date => {
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek === 1) {
      return startDate;
    }
    const newDate = startDate;
    if (dayOfWeek === 0) {
      newDate.setDate(startDate.getDate() - 6);
    } else {
      newDate.setDate(startDate.getDate() - (startDate.getDay() - 1));
    }

    return newDate;
  };

  const getDaysToRender = (): Array<Date> => {
    const ret = new Array<Date>();
    const start = getPreviousMonday(firstDayOfSelectedMonth);
    for (let i = 0; i < 35; i++) {
      const dayToAdd = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      ret.push(dayToAdd);
    }
    return ret;
  };

  const daysToRender = getDaysToRender();

  const gotoPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const gotoNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const getSelectedMonthTitle = (): string => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[selectedDate.getMonth()];
    return `${monthName} ${selectedDate.getFullYear()}`;
  };

  const monthTitle = getSelectedMonthTitle();

  return (
    <>
      <button onClick={toggleCalendarExpanded}>
        <span className="grid grid-cols-3 gap-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>

          {selectedDate.toLocaleDateString()}
        </span>
      </button>
      {calendarExpanded && (
        <section className="text-sm absolute mt-5 border-2 bg-gray-200 w-80 h-64 rounded-xl p-2 ">
          <head className="grid grid-cols-3 p-0 pb-2 font-bold">
            <button onClick={gotoPreviousMonth}>&lt;</button>
            <h2 className="text-center">{monthTitle}</h2>
            <button onClick={gotoNextMonth}>&gt;</button>
          </head>
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((weekDay, index) => {
              const classNames = ["p-1 text-center border-gray-800 border-b"];
              if (index > 4) {
                classNames.push("text-green-600");
              }

              return (
                <div className={classNames.join(" ")} key={index}>
                  {weekDay}
                </div>
              );
            })}
            {daysToRender.map((day, index) => (
              <DayItem
                key={index}
                day={day}
                selectedDate={selectedDate}
                onClick={setSelectedDate}
              ></DayItem>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
