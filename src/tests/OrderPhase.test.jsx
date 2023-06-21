import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
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

  // check summary subtotals
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: /Scoops: \$/ });
  const toppingsHeading = screen.getByRole("heading", { name: /Toppings: \$/ });

  expect(scoopsHeading).toHaveTextContent("Scoops: $4.00");
  expect(toppingsHeading).toHaveTextContent("Toppings: $1.50");

  // check summary information based on order
  //getByText 이용 하나씩 검사
  expect(screen.getByText("2 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  //getAllByRole 이용 List로 진행
  const optionItems = screen.getAllByRole("listitem");
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(["2 Vanilla", "Cherries"]);

  // accept terms and conditions and click button to confirm order
  const termsAndConditions = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  await user.click(termsAndConditions);

  const confirmButton = await screen.findByRole("button", {
    name: /confirm order/i,
  });

  await user.click(confirmButton);

  // expect "loading" to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = screen.getByText(/Your order number is /i, {
    exact: false,
  });
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", {
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

test.only("토핑 미선택 시 토핑 헤더가 나오지 않는지 테스트", async () => {
  const user = userEvent.setup();
  render(<App />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");

  const orderButton = screen.getByRole("button", { name: /order sundae/i });

  await user.click(orderButton);

  const toppingsHeader = screen.queryByRole("heading", { name: /toppings/i });

  expect(toppingsHeader).not.toBeInTheDocument();
});

test.only("토핑 선택 후 제거했을 때 토핑 헤더가 나오지 않는지 테스트", async () => {
  const user = userEvent.setup();
  render(<App />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");

  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  const mnmsTopping = await screen.findByRole("checkbox", { name: "M&Ms" });

  await user.click(cherriesTopping);
  await user.click(mnmsTopping);

  await user.click(cherriesTopping);
  await user.click(mnmsTopping);

  const orderButton = screen.getByRole("button", { name: /order sundae/i });

  await user.click(orderButton);

  const scoopsHeader = screen.queryByRole("heading", { name: /scoops/i });
  const toppingsHeader = screen.queryByRole("heading", { name: /toppings/i });

  expect(toppingsHeader).not.toBeInTheDocument();
  expect(scoopsHeader).toBeInTheDocument();
});
