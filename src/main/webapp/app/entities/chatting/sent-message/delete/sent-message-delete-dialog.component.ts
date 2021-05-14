import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISentMessage } from '../sent-message.model';
import { SentMessageService } from '../service/sent-message.service';

@Component({
  templateUrl: './sent-message-delete-dialog.component.html',
})
export class SentMessageDeleteDialogComponent {
  sentMessage?: ISentMessage;

  constructor(protected sentMessageService: SentMessageService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sentMessageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
