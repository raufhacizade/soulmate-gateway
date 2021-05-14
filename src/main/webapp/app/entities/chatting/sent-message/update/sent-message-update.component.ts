import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISentMessage, SentMessage } from '../sent-message.model';
import { SentMessageService } from '../service/sent-message.service';

@Component({
  selector: 'jhi-sent-message-update',
  templateUrl: './sent-message-update.component.html',
})
export class SentMessageUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    senderId: [null, [Validators.required]],
    toPersonId: [null, [Validators.required]],
    message: [],
    sendDate: [],
    isDeleted: [],
  });

  constructor(protected sentMessageService: SentMessageService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sentMessage }) => {
      this.updateForm(sentMessage);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sentMessage = this.createFromForm();
    if (sentMessage.id !== undefined) {
      this.subscribeToSaveResponse(this.sentMessageService.update(sentMessage));
    } else {
      this.subscribeToSaveResponse(this.sentMessageService.create(sentMessage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISentMessage>>): void {
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

  protected updateForm(sentMessage: ISentMessage): void {
    this.editForm.patchValue({
      id: sentMessage.id,
      senderId: sentMessage.senderId,
      toPersonId: sentMessage.toPersonId,
      message: sentMessage.message,
      sendDate: sentMessage.sendDate,
      isDeleted: sentMessage.isDeleted,
    });
  }

  protected createFromForm(): ISentMessage {
    return {
      ...new SentMessage(),
      id: this.editForm.get(['id'])!.value,
      senderId: this.editForm.get(['senderId'])!.value,
      toPersonId: this.editForm.get(['toPersonId'])!.value,
      message: this.editForm.get(['message'])!.value,
      sendDate: this.editForm.get(['sendDate'])!.value,
      isDeleted: this.editForm.get(['isDeleted'])!.value,
    };
  }
}
