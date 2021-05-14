import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SentMessageService } from '../service/sent-message.service';

import { SentMessageComponent } from './sent-message.component';

describe('Component Tests', () => {
  describe('SentMessage Management Component', () => {
    let comp: SentMessageComponent;
    let fixture: ComponentFixture<SentMessageComponent>;
    let service: SentMessageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SentMessageComponent],
      })
        .overrideTemplate(SentMessageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SentMessageComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SentMessageService);

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
      expect(comp.sentMessages?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
