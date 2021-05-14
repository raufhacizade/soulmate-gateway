import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IReceivedMessage, ReceivedMessage } from '../received-message.model';
import { ReceivedMessageService } from '../service/received-message.service';

@Component({
  selector: 'jhi-received-message-update',
  templateUrl: './received-message-update.component.html',
})
export class ReceivedMessageUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    receiverId: [null, [Validators.required]],
    fromPersonId: [null, [Validators.required]],
    message: [],
    receivedDate: [],
    isDeleted: [],
  });

  constructor(
    protected receivedMessageService: ReceivedMessageService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receivedMessage }) => {
      this.updateForm(receivedMessage);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const receivedMessage = this.createFromForm();
    if (receivedMessage.id !== undefined) {
      this.subscribeToSaveResponse(this.receivedMessageService.update(receivedMessage));
    } else {
      this.subscribeToSaveResponse(this.receivedMessageService.create(receivedMessage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReceivedMessage>>): void {
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

  protected updateForm(receivedMessage: IReceivedMessage): void {
    this.editForm.patchValue({
      id: receivedMessage.id,
      receiverId: receivedMessage.receiverId,
      fromPersonId: receivedMessage.fromPersonId,
      message: receivedMessage.message,
      receivedDate: receivedMessage.receivedDate,
      isDeleted: receivedMessage.isDeleted,
    });
  }

  protected createFromForm(): IReceivedMessage {
    return {
      ...new ReceivedMessage(),
      id: this.editForm.get(['id'])!.value,
      receiverId: this.editForm.get(['receiverId'])!.value,
      fromPersonId: this.editForm.get(['fromPersonId'])!.value,
      message: this.editForm.get(['message'])!.value,
      receivedDate: this.editForm.get(['receivedDate'])!.value,
      isDeleted: this.editForm.get(['isDeleted'])!.value,
    };
  }
}
