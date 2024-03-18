import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCatalogueComponent } from './book-catalogue.component';

describe('BookCatalogueComponent', () => {
  let component: BookCatalogueComponent;
  let fixture: ComponentFixture<BookCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
