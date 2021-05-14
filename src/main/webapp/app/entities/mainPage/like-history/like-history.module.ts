import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LikeHistoryComponent } from './list/like-history.component';
import { LikeHistoryDetailComponent } from './detail/like-history-detail.component';
import { LikeHistoryUpdateComponent } from './update/like-history-update.component';
import { LikeHistoryDeleteDialogComponent } from './delete/like-history-delete-dialog.component';
import { LikeHistoryRoutingModule } from './route/like-history-routing.module';

@NgModule({
  imports: [SharedModule, LikeHistoryRoutingModule],
  declarations: [LikeHistoryComponent, LikeHistoryDetailComponent, LikeHistoryUpdateComponent, LikeHistoryDeleteDialogComponent],
  entryComponents: [LikeHistoryDeleteDialogComponent],
})
export class MainPageLikeHistoryModule {}
