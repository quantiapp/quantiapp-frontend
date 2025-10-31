import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPasswordResetPage } from './request-password-reset.page';
import { provideZonelessChangeDetection } from '@angular/core';

describe('RequestPasswordResetPage', () => {
  let component: RequestPasswordResetPage;
  let fixture: ComponentFixture<RequestPasswordResetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPasswordResetPage],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPasswordResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
