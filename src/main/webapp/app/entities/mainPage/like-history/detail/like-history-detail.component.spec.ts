import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LikeHistoryDetailComponent } from './like-history-detail.component';

describe('Component Tests', () => {
  describe('LikeHistory Management Detail Component', () => {
    let comp: LikeHistoryDetailComponent;
    let fixture: ComponentFixture<LikeHistoryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LikeHistoryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ likeHistory: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LikeHistoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LikeHistoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load likeHistory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.likeHistory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
