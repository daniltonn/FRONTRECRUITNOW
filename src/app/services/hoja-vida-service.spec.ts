import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HojaVidaService } from './hoja-vida-service';

describe('HojaVidaService', () => {
  let service: HojaVidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HojaVidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});