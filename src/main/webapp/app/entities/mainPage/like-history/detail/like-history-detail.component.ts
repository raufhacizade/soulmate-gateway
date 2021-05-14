import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILikeHistory } from '../like-history.model';

@Component({
  selector: 'jhi-like-history-detail',
  templateUrl: './like-history-detail.component.html',
})
export class LikeHistoryDetailComponent implements OnInit {
  likeHistory: ILikeHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likeHistory }) => {
      this.likeHistory = likeHistory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
