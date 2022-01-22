import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDietComponent } from './my-diet.component';

describe('MyDietComponent', () => {
  let component: MyDietComponent;
  let fixture: ComponentFixture<MyDietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
