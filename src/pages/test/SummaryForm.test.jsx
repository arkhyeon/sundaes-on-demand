import SummaryForm from "../summary/SummaryForm";
import { fireEvent, render, screen } from "@testing-library/react";

test("initial conditions", () => {
  render(<SummaryForm />);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  const checkbox = screen.getByRole("checkbox", {
    name: /i agree to terms and conditions/i,
  });

  expect(confirmButton).toBeDisabled();
  expect(checkbox).not.toBeChecked();
});

test("buttons turns disabled property when toggle checkbox", () => {
  render(<SummaryForm />);

  const confirmButton = screen.getByRole("button", { name: "Confirm Order" });
  const agreeCheck = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });

  fireEvent.click(agreeCheck);
  expect(agreeCheck).toBeChecked();
  expect(confirmButton).toBeEnabled();

  fireEvent.click(agreeCheck);
  expect(agreeCheck).not.toBeChecked();
  expect(confirmButton).toBeDisabled();
});
