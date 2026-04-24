const { By, until } = require("selenium-webdriver");

class InventoryPage {
  constructor(driver) {
    this.driver = driver;

    // Locators
    this.sortDropdown = By.css(".product_sort_container");
    this.productNames = By.css(".inventory_item_name");
    this.inventoryList = By.id("inventory_container");
  }

  async waitForLoad() {
    await this.driver.wait(
      until.elementLocated(this.inventoryList),
      10000
    );
  }

  async selectSortOption(optionValue) {
    const dropdown = await this.driver.findElement(this.sortDropdown);
    await dropdown.click();

    // Pilih option berdasarkan value
    const option = await this.driver.findElement(
      By.css(`option[value="${optionValue}"]`)
    );
    await option.click();
  }

  async sortByNameAZ() {
    await this.selectSortOption("az");
  }

  async getProductNames() {
    await this.driver.wait(until.elementLocated(this.productNames), 5000);
    const elements = await this.driver.findElements(this.productNames);
    const names = [];
    for (const el of elements) {
      names.push(await el.getText());
    }
    return names;
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }
}

module.exports = InventoryPage;
