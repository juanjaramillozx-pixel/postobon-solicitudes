import { TestBed } from '@angular/core/testing';
import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmService);
  });

  it('should resolve confirm promises', async () => {
    const p = service.confirm('ok?');
    setTimeout(() => service.resolve(true), 10);
    const res = await p;
    expect(res).toBe(true);
  });
});
