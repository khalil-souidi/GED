import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDocumentUserComponent } from './all-document-user.component';

describe('AllDocumentUserComponent', () => {
  let component: AllDocumentUserComponent;
  let fixture: ComponentFixture<AllDocumentUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllDocumentUserComponent]
    });
    fixture = TestBed.createComponent(AllDocumentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
