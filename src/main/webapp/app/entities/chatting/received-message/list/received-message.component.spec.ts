import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReceivedMessageService } from '../service/received-message.service';

import { ReceivedMessageComponent } from './received-message.component';

describe('Component Tests', () => {
  describe('ReceivedMessage Management Component', () => {
    let comp: ReceivedMessageComponent;
    let fixture: ComponentFixture<ReceivedMessageComponent>;
    let service: ReceivedMessageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReceivedMessageComponent],
      })
        .overrideTemplate(ReceivedMessageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReceivedMessageComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ReceivedMessageService);

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
      expect(comp.receivedMessages?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
