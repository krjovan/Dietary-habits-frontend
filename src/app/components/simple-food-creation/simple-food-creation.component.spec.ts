import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFoodCreationComponent } from './simple-food-creation.component';

describe('SimpleFoodCreationComponent', () => {
  let component: SimpleFoodCreationComponent;
  let fixture: ComponentFixture<SimpleFoodCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleFoodCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFoodCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
