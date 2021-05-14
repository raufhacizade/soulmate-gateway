import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISentMessage } from '../sent-message.model';

@Component({
  selector: 'jhi-sent-message-detail',
  templateUrl: './sent-message-detail.component.html',
})
export class SentMessageDetailComponent implements OnInit {
  sentMessage: ISentMessage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sentMessage }) => {
      this.sentMessage = sentMessage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
