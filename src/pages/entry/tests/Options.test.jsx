import { render, screen } from "@testing-library/react";
import Options from "../Options";

test("displays image for each scoop option from server", async () => {
  render(<Options optionType="scoops" />);
  console.log("port" + location);
  // find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  // confirm alt text of images
  const altText = scoopImages.map((element) => element.alt);
  /**
   * toBe : 일반 적인 숫자나 문자
   * toEqual : 배열과 객체
   */
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});
