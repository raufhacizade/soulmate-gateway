import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LikeHistoryService } from '../service/like-history.service';

import { LikeHistoryComponent } from './like-history.component';

describe('Component Tests', () => {
  describe('LikeHistory Management Component', () => {
    let comp: LikeHistoryComponent;
    let fixture: ComponentFixture<LikeHistoryComponent>;
    let service: LikeHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LikeHistoryComponent],
      })
        .overrideTemplate(LikeHistoryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LikeHistoryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LikeHistoryService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.likeHistories?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
