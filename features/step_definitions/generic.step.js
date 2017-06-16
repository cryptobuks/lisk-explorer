const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  waitForElemAndCheckItsText,
  waitForElemAndClickIt,
  waitForElemAndSendKeys,
  checkAlertDialog,
  waitTime,
  urlChanged,
} = require('../support/util.js');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const baseURL = 'http://localhost:6040';

defineSupportCode(({ Given, When, Then, setDefaultTimeout }) => {
  setDefaultTimeout(20 * 1000);
  
  Given('I\'m on page "{pageAddess}"', (pageAddess, callback) => {
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(1000, 1000);
    browser.driver.get('about:blank');
    browser.get(baseURL + pageAddess).then(callback);
  });

  Given('I should be on page "{pageAddess}"', (pageAddess, callback) => {
    browser.wait(urlChanged(baseURL + pageAddess), waitTime, `waiting for page ${pageAddess}`);
    callback();
  });

  When('I fill in "{value}" to "{fieldName}" field', (value, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    waitForElemAndSendKeys(`input${selectorClass}, textarea${selectorClass}`, value, callback);
  });

  When('I hit "enter" in "{fieldName}" field', (fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    waitForElemAndSendKeys(`input${selectorClass}, textarea${selectorClass}`, protractor.Key.ENTER, callback);
  });

  Then('I should see "{value}" in "{fieldName}" field', (value, fieldName, callback) => {
    const elem = element(by.css(`.${fieldName.replace(/ /g, '-')}`));
    expect(elem.getAttribute('value')).to.eventually.equal(value)
      .and.notify(callback);
  });

  When('I click "{elementName}"', (elementName, callback) => {
    const selector = `.${elementName.replace(/\s+/g, '-')}`;
    waitForElemAndClickIt(selector, callback);
  });

  Then('I should see table with {lineCount} lines', (lineCount, callback) => {
    browser.sleep(500);
    expect(element.all(by.css('table tbody tr')).count()).to.eventually.equal(parseInt(lineCount, 10))
      .and.notify(callback);
  });

  Then('I should see "{elementName}"', (elementName, callback) => {
    expect(element.all(by.css(`.${elementName.replace(/ /g, '-')}`)).count()).to.eventually.equal(1)
      .and.notify(callback);
  });

  Then('I should see "{text}" error message', (text, callback) => {
    waitForElemAndCheckItsText('.md-input-message-animation', text, callback);
  });

  Then('I should see "{text}" in "{elementName}" element', (text, elementName, callback) => {
    const selector = `.${elementName.replace(/\s+/g, '-')}`;
    waitForElemAndCheckItsText(selector, text, callback);
  });

});

