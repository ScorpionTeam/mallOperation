import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    //noinspection TypeScriptUnresolvedFunction
    return element(by.css('app-root h1')).getText();
  }
}
