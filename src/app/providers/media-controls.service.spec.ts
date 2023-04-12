import { TestBed } from '@angular/core/testing';

import { MediaControlsService } from './media-controls.service';

describe('MediaControlsService', () => {
  let service: MediaControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
