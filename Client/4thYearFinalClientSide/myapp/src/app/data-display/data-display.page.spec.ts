import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataDisplayPage } from './data-display.page';

describe('DataDisplayPage', () => {
  let component: DataDisplayPage;
  let fixture: ComponentFixture<DataDisplayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
