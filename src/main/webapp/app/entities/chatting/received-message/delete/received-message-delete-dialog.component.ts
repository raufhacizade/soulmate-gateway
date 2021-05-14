import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReceivedMessage } from '../received-message.model';
import { ReceivedMessageService } from '../service/received-message.service';

@Component({
  templateUrl: './received-message-delete-dialog.component.html',
})
export class ReceivedMessageDeleteDialogComponent {
  receivedMessage?: IReceivedMessage;

  constructor(protected receivedMessageService: ReceivedMessageService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.receivedMessageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
