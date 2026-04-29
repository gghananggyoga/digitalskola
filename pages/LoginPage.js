const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://www.saucedemo.com/';
    this.usernameField = By.id('user-name');
    this.passwordField = By.id('password');
    this.loginButton = By.id('login-button');
    this.pageTitle = By.className('title');
  }

  async open() {
    await this.driver.get(this.url);
  }

  async inputUsername(username) {
    await this.driver.findElement(this.usernameField).sendKeys(username);
  }

  async inputPassword(password) {
    await this.driver.findElement(this.passwordField).sendKeys(password);
  }

  async clickLoginButton() {
    await this.driver.findElement(this.loginButton).click();
  }

  async login(username, password) {
    await this.inputUsername(username);
    await this.inputPassword(password);
    await this.clickLoginButton();
  }

  async getErrorMessage() {
    await this.driver.sleep(1000);
    const el = await this.driver.findElement(By.css('[data-test="error"]'));
    return await el.getText();
  }

  async getPageTitle() {
    await this.driver.wait(until.elementLocated(this.pageTitle), 5000);
    return await this.driver.findElement(this.pageTitle).getText();
  }

  async assertLoginSuccess(expectedTitle) {
    const title = await this.getPageTitle();
    assert.strictEqual(title, expectedTitle);
    console.log(`Login success - Page title: ${title}`);
  }

  async assertLoginFailed(expectedError) {
    const error = await this.getErrorMessage();
    assert.ok(error.includes(expectedError), `Expected: ${expectedError}, Got: ${error}`);
    console.log(`Login failed as expected - Error: ${error}`);
  }

  async takeScreenshot(filename) {
    const actualDir = path.join(__dirname, '..', 'screenshots', 'actual');
    if (!fs.existsSync(actualDir)) {
      fs.mkdirSync(actualDir, { recursive: true });
    }
    const screenshot = await this.driver.takeScreenshot();
    const filepath = path.join(actualDir, `${filename}.png`);
    fs.writeFileSync(filepath, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}.png`);
    return filepath;
  }
}

module.exports = LoginPage;