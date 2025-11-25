import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostulacionService } from './postulacion-service';

describe('PostulacionService', () => {
  let service: PostulacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PostulacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});