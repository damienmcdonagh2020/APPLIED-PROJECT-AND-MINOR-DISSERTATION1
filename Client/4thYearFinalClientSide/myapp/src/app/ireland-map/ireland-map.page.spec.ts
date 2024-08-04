import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrelandMapPage } from './ireland-map.page';

describe('IrelandMapPage', () => {
  let component: IrelandMapPage;
  let fixture: ComponentFixture<IrelandMapPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IrelandMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
