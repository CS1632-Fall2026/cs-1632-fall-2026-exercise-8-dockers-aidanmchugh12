import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=false";
    document.cookie = "3=false";
  });
});

test("TEST-1-RESET", async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  await page.getByRole("link", { name: "Reset" }).click();

  await expect(
    page.getByRole("list", { name: "Cat names" }).getByRole("listitem"),
  ).toHaveText([
    "ID 1. Jennyanydots",
    "ID 2. Old Deuteronomy",
    "ID 3. Mistoffelees",
  ]);
});

test("TEST-2-CATALOG", async ({ page }) => {
  await page.getByRole("link", { name: "Catalog" }).click();

  await expect(
    page.getByRole("list", { name: "Cat photos" }).getByRole("img").nth(1),
  ).toHaveAttribute("src", "/images/cat2.jpg");
});

test("TEST-3-LISTING", async ({ page }) => {
  await page.getByRole("link", { name: "Catalog" }).click();

  const listing = await page
    .getByRole("list", { name: "Cat names" })
    .getByRole("listitem");

  await expect(listing).toHaveCount(3);
  await expect(listing.nth(2)).toHaveText("ID 3. Mistoffelees");
});

test("TEST-4-RENT-A-CAT", async ({ page }) => {
  await page.getByRole("link", { name: "Rent-A-Cat" }).click();

  await expect(page.getByRole("button", { name: "Rent" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Return" })).toBeVisible();
});

test("TEST-5-RENT", async ({ page }) => {
  await page.getByRole("link", { name: "Rent-A-Cat" }).click();

  await page
    .getByRole("textbox", { name: "Enter the ID of the cat to rent:" })
    .fill("1");
  await page.getByRole("button", { name: "Rent" }).click();

  const listing = page
    .getByRole("list", { name: "Cat names" })
    .getByRole("listitem");
  await expect(listing).toHaveText([
    "Rented out",
    "ID 2. Old Deuteronomy",
    "ID 3. Mistoffelees",
  ]);
  await expect(page.getByText("Success!")).toBeVisible();
});

test("TEST-6-RETURN", async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
  await page.getByRole("link", { name: "Rent-A-Cat" }).click();

  await page
    .getByRole("textbox", { name: "Enter the ID of the cat to return:" })
    .fill("2");
  await page.getByRole("button", { name: "Return" }).click();

  const listing = page
    .getByRole("list", { name: "Cat names" })
    .getByRole("listitem");
  await expect(listing).toHaveText([
    "ID 1. Jennyanydots",
    "ID 2. Old Deuteronomy",
    "Rented out",
  ]);
  await expect(page.getByText("Success!")).toBeVisible();
});

test("TEST-7-FEED-A-CAT", async ({ page }) => {
  await page.getByRole("link", { name: "Feed-A-Cat" }).click();

  await expect(page.getByRole("button", { name: "Feed" })).toBeVisible();
});

test("TEST-8-FEED", async ({ page }) => {
  await page.getByRole("link", { name: "Feed-A-Cat" }).click();

  await page
    .getByRole("textbox", { name: "Number of catnips to feed:" })
    .fill("6");
  await page.getByRole("button", { name: "Feed" }).click();

  await expect(page.getByText("Nom, nom, nom.")).toBeVisible({ timeout: 10000 });
});

test("TEST-9-GREET-A-CAT", async ({ page }) => {
  await page.getByRole("link", { name: "Greet-A-Cat" }).click();

  await expect(page.getByText("Meow!Meow!Meow!")).toBeVisible();
});

test("TEST-10-GREET-A-CAT-WITH-NAME", async ({ page }) => {
  await page.goto("http://localhost:8080/greet-a-cat/Jennyanydots");

  await expect(page.getByText("Meow! from Jennyanydots.")).toBeVisible();
});

test("TEST-11-FEED-A-CAT-SCREENSHOT", async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
  await page.getByRole("link", { name: "Feed-A-Cat" }).click();

  await expect(page.locator("body")).toHaveScreenshot();
});