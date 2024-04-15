import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumEditComponent } from './curriculum-edit.component';

describe('CurriculumEditComponent', () => {
  let component: CurriculumEditComponent;
  let fixture: ComponentFixture<CurriculumEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurriculumEditComponent]
    });
    fixture = TestBed.createComponent(CurriculumEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
