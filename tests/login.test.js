require('chromedriver');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const LoginPage = require('../pages/LoginPage');  

// Helper: Compare screenshot dengan baseline
async function compareScreenshot(screenshotName) {
  const baselineDir = path.join(__dirname, '..', 'screenshots', 'baseline');
  const actualDir = path.join(__dirname, '..', 'screenshots', 'actual');
  const diffDir = path.join(__dirname, '..', 'screenshots', 'diff');

  [baselineDir, actualDir, diffDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const baselinePath = path.join(baselineDir, `${screenshotName}.png`);
  const actualPath = path.join(actualDir, `${screenshotName}.png`);
  const diffPath = path.join(diffDir, `${screenshotName}.png`);

  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    console.log(`Baseline created: ${screenshotName}.png`);
    return 0;
  }

  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(fs.readFileSync(actualPath));
  const { width, height } = baseline;
  const diff = new PNG({ width, height });

  const mismatch = pixelmatch(
    baseline.data, actual.data, diff.data,
    width, height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`Visual diff pixels: ${mismatch} - ${screenshotName}`);
  return mismatch;
}

describe('Login - Saucedemo', () => {
  let driver;
  let loginPage;

  // Browser dibuka tiap test agar lebih stabil (ikuti pola kode pembanding)
  beforeEach(async () => {
    const options = new chrome.Options();
    options.addArguments('--incognito');
    options.addArguments('--disable-save-password-bubble');
    options.addArguments('--disable-notifications');
    options.addArguments('--disable-extensions');
    options.addArguments('--no-first-run');

    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    loginPage = new LoginPage(driver);
    await loginPage.open();
    console.log('Browser opened & Navigated to saucedemo.com');
  });

  afterEach(async () => {
    await driver.quit();
    console.log('Browser closed');
  });

  // POSITIVE CASE
  it('Login with valid credentials', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.takeScreenshot('01_valid_login');
    const diff = await compareScreenshot('01_valid_login');
    assert.ok(diff < 100, `Visual regression failed: ${diff} pixels changed`);
    await loginPage.assertLoginSuccess('Products');
  });

  // NEGATIVE CASE 1: Invalid username
  it('Login with invalid username', async () => {
    await loginPage.login('wrong_user', 'secret_sauce');
    await loginPage.takeScreenshot('02_invalid_username');
    const diff = await compareScreenshot('02_invalid_username');
    assert.ok(diff < 100, `Visual regression failed: ${diff} pixels changed`);
    await loginPage.assertLoginFailed('do not match');
  });

  // NEGATIVE CASE 2: Wrong password
  it('Login with wrong password', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.takeScreenshot('03_wrong_password');
    const diff = await compareScreenshot('03_wrong_password');
    assert.ok(diff < 100, `Visual regression failed: ${diff} pixels changed`);
    await loginPage.assertLoginFailed('do not match');
  });

  // NEGATIVE CASE 3: Locked out user
  it('Login with locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.takeScreenshot('04_locked_out_user');
    const diff = await compareScreenshot('04_locked_out_user');
    assert.ok(diff < 100, `Visual regression failed: ${diff} pixels changed`);
    await loginPage.assertLoginFailed('locked out');
  });

  // NEGATIVE CASE 4: Empty fields
  it('Login with empty fields', async () => {
    await loginPage.clickLoginButton();
    await loginPage.takeScreenshot('05_empty_fields');
    const diff = await compareScreenshot('05_empty_fields');
    assert.ok(diff < 100, `Visual regression failed: ${diff} pixels changed`);
    await loginPage.assertLoginFailed('Username is required');
  });
});