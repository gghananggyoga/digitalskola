const assert = require("assert");
const { createDriver } = require("../helpers/driver");
const LoginPage = require("../pages/LoginPage");
const InventoryPage = require("../pages/InventoryPage");

describe("Sort Product Test - SauceDemo", function () {
  this.timeout(30000);

  let driver;
  let loginPage;
  let inventoryPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);

    // Login dulu sebelum test
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.waitForLoad();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("TC-02: Urutkan Produk dari A-Z", async function () {
    // Act - Pilih sort A to Z
    await inventoryPage.sortByNameAZ();

    // Assert - Ambil semua nama produk
    const productNames = await inventoryPage.getProductNames();

    console.log("📦 Produk setelah diurutkan A-Z:");
    productNames.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));

    // Verifikasi urutan sudah A-Z
    const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
    assert.deepStrictEqual(
      productNames,
      sortedNames,
      "Produk harus terurut dari A-Z"
    );

    console.log("✅ Produk berhasil diurutkan dari A-Z!");
  });
});
