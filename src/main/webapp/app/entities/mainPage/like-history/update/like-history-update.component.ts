import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILikeHistory, LikeHistory } from '../like-history.model';
import { LikeHistoryService } from '../service/like-history.service';
import { IPerson } from 'app/entities/registration/person/person.model';
import { PersonService } from 'app/entities/registration/person/service/person.service';

@Component({
  selector: 'jhi-like-history-update',
  templateUrl: './like-history-update.component.html',
})
export class LikeHistoryUpdateComponent implements OnInit {
  isSaving = false;

  peopleSharedCollection: IPerson[] = [];

  editForm = this.fb.group({
    id: [],
    whoLikeId: [null, [Validators.required]],
    likedPersonId: [null, [Validators.required]],
    sendDate: [],
    whoLiked: [],
    likedPerson: [],
  });

  constructor(
    protected likeHistoryService: LikeHistoryService,
    protected personService: PersonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likeHistory }) => {
      this.updateForm(likeHistory);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const likeHistory = this.createFromForm();
    if (likeHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.likeHistoryService.update(likeHistory));
    } else {
      this.subscribeToSaveResponse(this.likeHistoryService.create(likeHistory));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILikeHistory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(likeHistory: ILikeHistory): void {
    this.editForm.patchValue({
      id: likeHistory.id,
      whoLikeId: likeHistory.whoLikeId,
      likedPersonId: likeHistory.likedPersonId,
      sendDate: likeHistory.sendDate,
      whoLiked: likeHistory.whoLiked,
      likedPerson: likeHistory.likedPerson,
    });

    this.peopleSharedCollection = this.personService.addPersonToCollectionIfMissing(
      this.peopleSharedCollection,
      likeHistory.whoLiked,
      likeHistory.likedPerson
    );
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query()
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(
        map((people: IPerson[]) =>
          this.personService.addPersonToCollectionIfMissing(
            people,
            this.editForm.get('whoLiked')!.value,
            this.editForm.get('likedPerson')!.value
          )
        )
      )
      .subscribe((people: IPerson[]) => (this.peopleSharedCollection = people));
  }

  protected createFromForm(): ILikeHistory {
    return {
      ...new LikeHistory(),
      id: this.editForm.get(['id'])!.value,
      whoLikeId: this.editForm.get(['whoLikeId'])!.value,
      likedPersonId: this.editForm.get(['likedPersonId'])!.value,
      sendDate: this.editForm.get(['sendDate'])!.value,
      whoLiked: this.editForm.get(['whoLiked'])!.value,
      likedPerson: this.editForm.get(['likedPerson'])!.value,
    };
  }
}
