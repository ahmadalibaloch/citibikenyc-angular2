import { TestBed, inject } from '@angular/core/testing';

import { NYCBikeDataService } from './nycbike-data.service';

describe('NYCBikeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NYCBikeDataService]
    });
  });

  it('should ...', inject([NYCBikeDataService], (service: NYCBikeDataService) => {
    expect(service).toBeTruthy();
  }));
});
