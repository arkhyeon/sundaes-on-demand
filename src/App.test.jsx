import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  it("renders App", () => {
    render(<App />);

    expect(screen.getByText("Vite + React")).toBeInTheDocument();
  });

  const user = userEvent.setup();

  it("click count button", async () => {
    render(<App />);

    await user.click(screen.getByText(/count is /i));
    await user.click(screen.getByText(/count is /i));
    await user.click(screen.getByText(/count is /i));
    await user.click(screen.getByText(/count is /i));
    await user.click(screen.getByText(/count is /i));
    await user.click(screen.getByText(/count is /i));

    await waitFor(() => {
      expect(screen.getByText("count is 6")).toBeInTheDocument();
    });
  });
});
