import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonListItemComponent } from './common-list-item.component';

describe('CommonListItemComponent', () => {
  let component: CommonListItemComponent;
  let fixture: ComponentFixture<CommonListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
