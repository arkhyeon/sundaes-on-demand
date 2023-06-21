import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderConfirmation from "../OrderConfirmation";
import { server } from "../../../mocks/server";
import { rest } from "msw";

test("주문서 작성 후 주문 통신 에러", async () => {
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  const alert = await screen.findByRole("alert");
  expect(alert).toBeInTheDocument();
});
