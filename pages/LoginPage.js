const { By, until } = require("selenium-webdriver");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = "https://www.saucedemo.com";

    // Locators
    this.usernameInput = By.id("user-name");
    this.passwordInput = By.id("password");
    this.loginButton = By.id("login-button");
    this.errorMessage = By.css("[data-test='error']");
    this.inventoryContainer = By.id("inventory_container");
  }

  async open() {
    await this.driver.get(this.url);
  }

  async enterUsername(username) {
    const field = await this.driver.findElement(this.usernameInput);
    await field.clear();
    await field.sendKeys(username);
  }

  async enterPassword(password) {
    const field = await this.driver.findElement(this.passwordInput);
    await field.clear();
    await field.sendKeys(password);
  }

  async clickLogin() {
    await this.driver.findElement(this.loginButton).click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async isLoginSuccessful() {
    try {
      await this.driver.wait(
        until.elementLocated(this.inventoryContainer),
        5000
      );
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage() {
    try {
      const el = await this.driver.findElement(this.errorMessage);
      return await el.getText();
    } catch {
      return null;
    }
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }
}

module.exports = LoginPage;
