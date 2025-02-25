import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateCategoryComponent } from './operate-category.component';

describe('OperateCategoryComponent', () => {
  let component: OperateCategoryComponent;
  let fixture: ComponentFixture<OperateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperateCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
