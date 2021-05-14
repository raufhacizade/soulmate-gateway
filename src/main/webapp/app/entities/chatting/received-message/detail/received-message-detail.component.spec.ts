import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReceivedMessageDetailComponent } from './received-message-detail.component';

describe('Component Tests', () => {
  describe('ReceivedMessage Management Detail Component', () => {
    let comp: ReceivedMessageDetailComponent;
    let fixture: ComponentFixture<ReceivedMessageDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReceivedMessageDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ receivedMessage: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ReceivedMessageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReceivedMessageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load receivedMessage on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.receivedMessage).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
