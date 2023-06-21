import ScoopOptions from "../ScoopOption";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test-utils/testing-library-utils";

test("스쿱 옵션의 값 유효성 검사", async () => {
  const user = userEvent.setup();
  render(<ScoopOptions />);

  const vanillaInput = screen.getByRole("spinbutton");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "-1");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2.5");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "11");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "a");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "3");

  expect(vanillaInput).not.toHaveClass("is-invalid");
});
