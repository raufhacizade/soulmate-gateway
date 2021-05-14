import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILikeHistory } from '../like-history.model';
import { LikeHistoryService } from '../service/like-history.service';
import { LikeHistoryDeleteDialogComponent } from '../delete/like-history-delete-dialog.component';

@Component({
  selector: 'jhi-like-history',
  templateUrl: './like-history.component.html',
})
export class LikeHistoryComponent implements OnInit {
  likeHistories?: ILikeHistory[];
  isLoading = false;

  constructor(protected likeHistoryService: LikeHistoryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.likeHistoryService.query().subscribe(
      (res: HttpResponse<ILikeHistory[]>) => {
        this.isLoading = false;
        this.likeHistories = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILikeHistory): number {
    return item.id!;
  }

  delete(likeHistory: ILikeHistory): void {
    const modalRef = this.modalService.open(LikeHistoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.likeHistory = likeHistory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
