import {
  fireEvent,
  getByDisplayValue,
  render,
  screen,
} from "@testing-library/react";
import { HourInput } from "./hourInput";
import userEvent from "@testing-library/user-event";

describe("the hour input control should display ...", () => {
  const testNode = (
    <>
      <HourInput></HourInput>
      <button>Click me!</button>
    </>
  );

  it("... 0:00 in the beginning", () => {
    const { getByDisplayValue } = render(testNode);
    expect(getByDisplayValue("0:00")).toBeDefined();
  });

  it('... 1:00 if the user types "1"', () => {
    const { getByRole, getByText } = render(testNode);
    const hourBox = getByRole("textbox");
    hourBox.focus();
    fireEvent.change(hourBox, { target: { value: "1" } });
    getByText(/click me!/i).focus();
    expect(hourBox).toHaveValue("1:00");
  });

  it('... display "0:00" user types "abc"', () => {
    const renderResult = render(testNode);
  });

  describe('... should allow "hh:mm" input when ...', () => {
    it('... typing in "01:12"', () => {
      const { getByRole, getByText } = render(testNode);
      const hourBox = getByRole("textbox");
      hourBox.focus();
      fireEvent.change(hourBox, { target: { value: "abc" } });
      getByText(/click me!/i).focus();
      expect(hourBox).toHaveValue("0:00");
    });

    it("... typing 23:59 is ok", () => {
      const { getByRole, getByText } = render(testNode);
      const hourBox = getByRole("textbox");
      hourBox.focus();
      fireEvent.change(hourBox, { target: { value: "23:59" } });
      getByText(/click me!/i).focus();
    });

    it("... typing 23:60 is re-calculated to 24:00", () => {
      const { getByRole, getByText, getByDisplayValue } = render(testNode);
      const hourBox = getByRole("textbox");
      hourBox.focus();
      fireEvent.change(hourBox, { target: { value: "24:00" } });
      getByText(/click me!/i).focus();
      const resultElement = getByDisplayValue("24:00");
      expect(resultElement).toBeInTheDocument();
    });

    it("... typing 12.45 is changed to 12:26", () => {
      const { getByRole, getByText, getByDisplayValue } = render(testNode);
      const hourBox = getByRole("textbox");
      hourBox.focus();
      fireEvent.change(hourBox, { target: { value: "12:26" } });
      getByText(/click me!/i).focus();
      const resultElement = getByDisplayValue("12:26");
      expect(resultElement).toBeInTheDocument();
    });

    it("... typing 24.01 is changed to 24:00", () => {
      const { getByRole, getByText, getByDisplayValue } = render(testNode);
      const hourBox = getByRole("textbox");
      hourBox.focus();
      fireEvent.change(hourBox, { target: { value: "24.01" } });
      getByText(/click me!/i).focus();
      const resultElement = getByDisplayValue("24:00");
      expect(resultElement).toBeInTheDocument();
    });

    it("... typing 12.ab is changed to 12:00", () => {
      const { getByRole, getByText, getByDisplayValue } = render(testNode);
      const hourBox = getByRole("textbox");
      hourBox.focus();
      fireEvent.change(hourBox, { target: { value: "12.ab" } });
      getByText(/click me!/i).focus();
      const resultElement = getByDisplayValue("12:00");
      expect(resultElement).toBeInTheDocument();
    });
  });

  it("... typing 24.018 reports an error", () => {
    window.alert = jest.fn();
    const { getByRole, getByText } = render(testNode);
    const hourBox = getByRole("textbox");
    hourBox.focus();
    fireEvent.change(hourBox, { target: { value: "24.017" } });
    getByText(/click me!/i).focus();
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
