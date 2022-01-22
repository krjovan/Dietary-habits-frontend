import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndAddNutritionComponent } from './search-and-add-nutrition.component';

describe('SearchAndAddNutritionComponent', () => {
  let component: SearchAndAddNutritionComponent;
  let fixture: ComponentFixture<SearchAndAddNutritionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAndAddNutritionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAndAddNutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
