import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReceivedMessage } from '../received-message.model';
import { ReceivedMessageService } from '../service/received-message.service';
import { ReceivedMessageDeleteDialogComponent } from '../delete/received-message-delete-dialog.component';

@Component({
  selector: 'jhi-received-message',
  templateUrl: './received-message.component.html',
})
export class ReceivedMessageComponent implements OnInit {
  receivedMessages?: IReceivedMessage[];
  isLoading = false;

  constructor(protected receivedMessageService: ReceivedMessageService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.receivedMessageService.query().subscribe(
      (res: HttpResponse<IReceivedMessage[]>) => {
        this.isLoading = false;
        this.receivedMessages = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IReceivedMessage): number {
    return item.id!;
  }

  delete(receivedMessage: IReceivedMessage): void {
    const modalRef = this.modalService.open(ReceivedMessageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.receivedMessage = receivedMessage;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
