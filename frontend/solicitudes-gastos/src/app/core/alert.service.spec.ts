import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should show and clear alerts', async () => {
    const emissions: Array<string | null> = [];

    service.alert$.subscribe(a => {
      emissions.push(a.message);
    });

    service.show('test', 'info', 10);
    await new Promise(resolve => setTimeout(resolve, 11));

    expect(emissions).toEqual([null, 'test', null]);
  });
});
