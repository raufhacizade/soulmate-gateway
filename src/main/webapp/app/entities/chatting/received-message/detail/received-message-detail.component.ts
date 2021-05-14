import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReceivedMessage } from '../received-message.model';

@Component({
  selector: 'jhi-received-message-detail',
  templateUrl: './received-message-detail.component.html',
})
export class ReceivedMessageDetailComponent implements OnInit {
  receivedMessage: IReceivedMessage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receivedMessage }) => {
      this.receivedMessage = receivedMessage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
