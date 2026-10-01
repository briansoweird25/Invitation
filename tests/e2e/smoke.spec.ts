import { expect, test } from "@playwright/test";
import { installMockSupabase, login, seedRow, trackErrors } from "./helpers/mockSupabase";

test("signs in, lists a saved invitation and opens it in the editor", async ({ page, context }) => {
  const errors = trackErrors(page);
  const mock = await installMockSupabase(context);
  const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  mock.db.set(id, seedRow(id, "Our wedding", "Ava & Noah"));

  await login(page);
  await page.goto("/dashboard");
  await expect(page.locator("article h2")).toHaveText("Our wedding");

  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page.locator("#event-hostNames")).toHaveValue("Ava & Noah");
  await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
  expect(errors).toEqual([]);
});
