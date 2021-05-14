import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SentMessageComponent } from './list/sent-message.component';
import { SentMessageDetailComponent } from './detail/sent-message-detail.component';
import { SentMessageUpdateComponent } from './update/sent-message-update.component';
import { SentMessageDeleteDialogComponent } from './delete/sent-message-delete-dialog.component';
import { SentMessageRoutingModule } from './route/sent-message-routing.module';

@NgModule({
  imports: [SharedModule, SentMessageRoutingModule],
  declarations: [SentMessageComponent, SentMessageDetailComponent, SentMessageUpdateComponent, SentMessageDeleteDialogComponent],
  entryComponents: [SentMessageDeleteDialogComponent],
})
export class ChattingSentMessageModule {}
