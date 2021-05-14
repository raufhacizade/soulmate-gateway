import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISentMessage } from '../sent-message.model';
import { SentMessageService } from '../service/sent-message.service';
import { SentMessageDeleteDialogComponent } from '../delete/sent-message-delete-dialog.component';

@Component({
  selector: 'jhi-sent-message',
  templateUrl: './sent-message.component.html',
})
export class SentMessageComponent implements OnInit {
  sentMessages?: ISentMessage[];
  isLoading = false;

  constructor(protected sentMessageService: SentMessageService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sentMessageService.query().subscribe(
      (res: HttpResponse<ISentMessage[]>) => {
        this.isLoading = false;
        this.sentMessages = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISentMessage): number {
    return item.id!;
  }

  delete(sentMessage: ISentMessage): void {
    const modalRef = this.modalService.open(SentMessageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sentMessage = sentMessage;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
