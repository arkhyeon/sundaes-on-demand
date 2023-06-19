import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";
import { logRoles } from "@testing-library/react";

// scoops 는 Options 컴포넌트 내에 있기에 최소한의 컴포넌트 만을 테스트하여 성능을 내도록 하자.
test("update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out at $0.00
  //exact 문자열의 일정 부분이 동일한 텍스트 찾기
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  //update vanilla scoops to 1, and check subtotal
  //텍스트 요소를 업데이트할 때는 무엇이 들어있을지 모르니 clear 진행을 먼저 하자.
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("토핑 수정에 따른 토핑 소계 업데이트 테스트", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  const toppingSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingSubtotal).toHaveTextContent("0.00");

  const mnms = await screen.findByRole("checkbox", { name: "M&Ms" });

  await user.click(mnms);
  expect(toppingSubtotal).toHaveTextContent("1.50");

  const hotFudge = await screen.findByRole("checkbox", { name: "Hot fudge" });

  await user.click(hotFudge);
  expect(toppingSubtotal).toHaveTextContent("3.00");

  await user.click(hotFudge);
  expect(toppingSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at $0.00", async () => {
    const { unmount, container } = render(<OrderEntry />);
    // screen.debug(screen.getByText("Grand total: $", { exact: false }));
    logRoles(
      await screen.findByRole("spinbutton", {
        name: "Vanilla",
      })
    );

    const grandTotal = screen.getByText("Grand total: $", { exact: false });
    expect(grandTotal).toHaveTextContent("0.00");

    unmount();
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();

    // Test that the total starts out at $0.00
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("0.00");

    // update vanilla scoops to 2 and check grand total
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    // add cherries and check grand total
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if toppings is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByText("Grand total:", { exact: false });

    const hotFudge = await screen.findByRole("checkbox", { name: "Hot fudge" });

    await user.click(hotFudge);

    expect(grandTotal).toHaveTextContent("1.50");
  });
  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByText("Grand total:", { exact: false });

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    const hotFudge = await screen.findByRole("checkbox", { name: "Hot fudge" });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");
    await user.click(hotFudge);
    await user.click(hotFudge);

    expect(grandTotal).toHaveTextContent("0.00");
  });
});
