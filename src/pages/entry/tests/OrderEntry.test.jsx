import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import userEvent from "@testing-library/user-event";

test.skip("handles error for scoops and toppings routes", async () => {
  //MSW Response 재정의 사용
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500))
    )
  ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    );

  render(<OrderEntry setOrderPhase={jest.fn()} />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("스쿱 유효성 검사", async () => {
  const user = userEvent.setup();
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  const orderButton = screen.getByRole("button", { name: /order sundae/i });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");
  expect(orderButton).toBeEnabled();

  await user.type(vanillaInput, "0");
  expect(orderButton).toBeDisabled();
});
