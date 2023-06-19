import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();
  // render app
  const { unmount } = render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  await user.click(cherriesCheckbox);

  // find and click order button
  const orderButton = await screen.findByRole("button", {
    name: "Order Sundae!",
  });

  await user.click(orderButton);
  // check summary information based on order
  const termsAndConditions = screen.getByText(/terms and conditions/i);

  await user.click(termsAndConditions);
  // accept terms and conditions and click button to confirm order
  const confirmButton = await screen.findByRole("button", {
    name: /confirm order/i,
  });

  await user.click(confirmButton);
  // confirm order number on confirmation page
  await waitFor(() => {
    const orderNumber = screen.getByText(/Your order number is /i, {
      exact: false,
    });
    expect(orderNumber).toBeInTheDocument();
  });

  // click "new order" button on confirmation page
  const newOrderButton = await screen.findByRole("button", {
    name: /Create new order/i,
  });

  await user.click(newOrderButton);
  // check that scoops and toppings subtotals have been reset

  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });

  expect(scoopsSubtotal).toHaveTextContent("0.00");
  expect(toppingsSubtotal).toHaveTextContent("0.00");
  // do we need to await anything to avoid test errors

  unmount();
});
