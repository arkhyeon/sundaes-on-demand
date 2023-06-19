import SummaryForm from "../summary/SummaryForm";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test-utils/testing-library-utils";
import { waitFor } from "@testing-library/react";

test("initial conditions", () => {
  render(<SummaryForm />);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  const checkbox = screen.getByRole("checkbox", {
    name: /i agree to terms and conditions/i,
  });

  expect(confirmButton).toBeDisabled();
  expect(checkbox).not.toBeChecked();
});

test("buttons turns disabled property when toggle checkbox", async () => {
  const user = userEvent.setup();

  render(<SummaryForm />);

  const confirmButton = screen.getByRole("button", { name: "Confirm Order" });
  const agreeCheck = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });

  await user.click(agreeCheck);
  expect(agreeCheck).toBeChecked();
  expect(confirmButton).toBeEnabled();

  await user.click(agreeCheck);
  expect(agreeCheck).not.toBeChecked();
  expect(confirmButton).toBeDisabled();
});

test("popover responds to hover", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);

  // popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears on mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // popover disappears when we mouse out
  await user.unhover(termsAndConditions);
  await waitFor(() => {
    expect(popover).not.toBeInTheDocument();
  });
});
