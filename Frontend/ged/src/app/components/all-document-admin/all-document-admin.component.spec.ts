import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDocumentAdminComponent } from './all-document-admin.component';

describe('AllDocumentAdminComponent', () => {
  let component: AllDocumentAdminComponent;
  let fixture: ComponentFixture<AllDocumentAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllDocumentAdminComponent]
    });
    fixture = TestBed.createComponent(AllDocumentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
