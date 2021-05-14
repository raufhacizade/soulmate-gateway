jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SentMessageService } from '../service/sent-message.service';
import { ISentMessage, SentMessage } from '../sent-message.model';

import { SentMessageUpdateComponent } from './sent-message-update.component';

describe('Component Tests', () => {
  describe('SentMessage Management Update Component', () => {
    let comp: SentMessageUpdateComponent;
    let fixture: ComponentFixture<SentMessageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sentMessageService: SentMessageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SentMessageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SentMessageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SentMessageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sentMessageService = TestBed.inject(SentMessageService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const sentMessage: ISentMessage = { id: 456 };

        activatedRoute.data = of({ sentMessage });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sentMessage));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sentMessage = { id: 123 };
        spyOn(sentMessageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sentMessage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sentMessage }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sentMessageService.update).toHaveBeenCalledWith(sentMessage);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sentMessage = new SentMessage();
        spyOn(sentMessageService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sentMessage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sentMessage }));
        saveSubject.complete();

        // THEN
        expect(sentMessageService.create).toHaveBeenCalledWith(sentMessage);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sentMessage = { id: 123 };
        spyOn(sentMessageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sentMessage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sentMessageService.update).toHaveBeenCalledWith(sentMessage);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
