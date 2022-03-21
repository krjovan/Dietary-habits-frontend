import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeFoodCreationComponent } from './composite-food-creation.component';

describe('CompositeFoodCreationComponent', () => {
  let component: CompositeFoodCreationComponent;
  let fixture: ComponentFixture<CompositeFoodCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeFoodCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeFoodCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
