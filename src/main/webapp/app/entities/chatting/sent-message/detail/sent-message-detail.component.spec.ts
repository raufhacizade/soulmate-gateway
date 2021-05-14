import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SentMessageDetailComponent } from './sent-message-detail.component';

describe('Component Tests', () => {
  describe('SentMessage Management Detail Component', () => {
    let comp: SentMessageDetailComponent;
    let fixture: ComponentFixture<SentMessageDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SentMessageDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ sentMessage: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SentMessageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SentMessageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sentMessage on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sentMessage).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
