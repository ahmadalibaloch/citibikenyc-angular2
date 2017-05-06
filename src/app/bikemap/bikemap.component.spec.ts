import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikemapComponent } from './bikemap.component';

describe('BikemapComponent', () => {
  let component: BikemapComponent;
  let fixture: ComponentFixture<BikemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
