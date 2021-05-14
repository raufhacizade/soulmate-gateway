jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LikeHistoryService } from '../service/like-history.service';
import { ILikeHistory, LikeHistory } from '../like-history.model';
import { IPerson } from 'app/entities/registration/person/person.model';
import { PersonService } from 'app/entities/registration/person/service/person.service';

import { LikeHistoryUpdateComponent } from './like-history-update.component';

describe('Component Tests', () => {
  describe('LikeHistory Management Update Component', () => {
    let comp: LikeHistoryUpdateComponent;
    let fixture: ComponentFixture<LikeHistoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let likeHistoryService: LikeHistoryService;
    let personService: PersonService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LikeHistoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LikeHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LikeHistoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      likeHistoryService = TestBed.inject(LikeHistoryService);
      personService = TestBed.inject(PersonService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Person query and add missing value', () => {
        const likeHistory: ILikeHistory = { id: 456 };
        const whoLiked: IPerson = { id: 89018 };
        likeHistory.whoLiked = whoLiked;
        const likedPerson: IPerson = { id: 35750 };
        likeHistory.likedPerson = likedPerson;

        const personCollection: IPerson[] = [{ id: 41668 }];
        spyOn(personService, 'query').and.returnValue(of(new HttpResponse({ body: personCollection })));
        const additionalPeople = [whoLiked, likedPerson];
        const expectedCollection: IPerson[] = [...additionalPeople, ...personCollection];
        spyOn(personService, 'addPersonToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ likeHistory });
        comp.ngOnInit();

        expect(personService.query).toHaveBeenCalled();
        expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, ...additionalPeople);
        expect(comp.peopleSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const likeHistory: ILikeHistory = { id: 456 };
        const whoLiked: IPerson = { id: 53468 };
        likeHistory.whoLiked = whoLiked;
        const likedPerson: IPerson = { id: 32450 };
        likeHistory.likedPerson = likedPerson;

        activatedRoute.data = of({ likeHistory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(likeHistory));
        expect(comp.peopleSharedCollection).toContain(whoLiked);
        expect(comp.peopleSharedCollection).toContain(likedPerson);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const likeHistory = { id: 123 };
        spyOn(likeHistoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ likeHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: likeHistory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(likeHistoryService.update).toHaveBeenCalledWith(likeHistory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const likeHistory = new LikeHistory();
        spyOn(likeHistoryService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ likeHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: likeHistory }));
        saveSubject.complete();

        // THEN
        expect(likeHistoryService.create).toHaveBeenCalledWith(likeHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const likeHistory = { id: 123 };
        spyOn(likeHistoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ likeHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(likeHistoryService.update).toHaveBeenCalledWith(likeHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPersonById', () => {
        it('Should return tracked Person primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPersonById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
