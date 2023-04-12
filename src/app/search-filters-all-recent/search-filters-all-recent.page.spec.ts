import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchFiltersAllRecentPage } from './search-filters-all-recent.page';

describe('SearchFiltersAllRecentPage', () => {
  let component: SearchFiltersAllRecentPage;
  let fixture: ComponentFixture<SearchFiltersAllRecentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFiltersAllRecentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFiltersAllRecentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
