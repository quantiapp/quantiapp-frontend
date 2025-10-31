import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLayout } from './master.layout';
import { provideZonelessChangeDetection } from '@angular/core';

describe('MasterLayout', () => {
  let component: MasterLayout;
  let fixture: ComponentFixture<MasterLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterLayout],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
