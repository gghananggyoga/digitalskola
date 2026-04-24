const assert = require("assert");
const { createDriver } = require("../helpers/driver");
const LoginPage = require("../pages/LoginPage");

describe("Login Test - SauceDemo", function () {
  this.timeout(30000);

  let driver;
  let loginPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    await loginPage.open();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("TC-01: Sukses Login dengan kredensial valid", async function () {
    // Arrange
    const username = "standard_user";
    const password = "secret_sauce";

    // Act
    await loginPage.login(username, password);

    // Assert
    const isSuccess = await loginPage.isLoginSuccessful();
    const currentUrl = await loginPage.getCurrentUrl();

    assert.strictEqual(isSuccess, true, "Inventory container harus tampil setelah login");
    assert.ok(
      currentUrl.includes("/inventory.html"),
      `URL harus redirect ke inventory, tapi URL saat ini: ${currentUrl}`
    );

    console.log("✅ Login berhasil! URL:", currentUrl);
  });
});
