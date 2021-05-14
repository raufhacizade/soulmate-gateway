import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILikeHistory } from '../like-history.model';
import { LikeHistoryService } from '../service/like-history.service';

@Component({
  templateUrl: './like-history-delete-dialog.component.html',
})
export class LikeHistoryDeleteDialogComponent {
  likeHistory?: ILikeHistory;

  constructor(protected likeHistoryService: LikeHistoryService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.likeHistoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
