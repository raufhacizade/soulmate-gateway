jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReceivedMessageService } from '../service/received-message.service';
import { IReceivedMessage, ReceivedMessage } from '../received-message.model';

import { ReceivedMessageUpdateComponent } from './received-message-update.component';

describe('Component Tests', () => {
  describe('ReceivedMessage Management Update Component', () => {
    let comp: ReceivedMessageUpdateComponent;
    let fixture: ComponentFixture<ReceivedMessageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let receivedMessageService: ReceivedMessageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReceivedMessageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReceivedMessageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReceivedMessageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      receivedMessageService = TestBed.inject(ReceivedMessageService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const receivedMessage: IReceivedMessage = { id: 456 };

        activatedRoute.data = of({ receivedMessage });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(receivedMessage));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const receivedMessage = { id: 123 };
        spyOn(receivedMessageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ receivedMessage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: receivedMessage }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(receivedMessageService.update).toHaveBeenCalledWith(receivedMessage);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const receivedMessage = new ReceivedMessage();
        spyOn(receivedMessageService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ receivedMessage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: receivedMessage }));
        saveSubject.complete();

        // THEN
        expect(receivedMessageService.create).toHaveBeenCalledWith(receivedMessage);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const receivedMessage = { id: 123 };
        spyOn(receivedMessageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ receivedMessage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(receivedMessageService.update).toHaveBeenCalledWith(receivedMessage);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
