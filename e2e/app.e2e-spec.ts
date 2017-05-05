import { NYBikeSharingPage } from './app.po';

describe('ny-bike-sharing App', () => {
  let page: NYBikeSharingPage;

  beforeEach(() => {
    page = new NYBikeSharingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
