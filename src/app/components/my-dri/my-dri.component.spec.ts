import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDriComponent } from './my-dri.component';

describe('MyDriComponent', () => {
  let component: MyDriComponent;
  let fixture: ComponentFixture<MyDriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
