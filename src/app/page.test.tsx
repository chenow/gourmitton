import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "bun:test";
import HomePage from "./page";

import { TestAppWrapper } from "@/tests/utils";

describe("HomePage", () => {
  test("renders title correctly", () => {
    render(<HomePage />, { wrapper: TestAppWrapper });
    expect(screen.getByText("Toutes les recettes")).toBeDefined();
  });

  test("renders recipe cards", () => {
    render(<HomePage />, { wrapper: TestAppWrapper });

    const recipeElements = screen.queryAllByText("Test Recipe");
    expect(recipeElements.length).toBeGreaterThan(0);

    const descriptionElements = screen.queryAllByText(
      "A test recipe description"
    );
    expect(descriptionElements.length).toBeGreaterThan(0);
  });
});
