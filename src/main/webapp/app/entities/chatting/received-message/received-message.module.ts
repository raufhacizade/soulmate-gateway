import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ReceivedMessageComponent } from './list/received-message.component';
import { ReceivedMessageDetailComponent } from './detail/received-message-detail.component';
import { ReceivedMessageUpdateComponent } from './update/received-message-update.component';
import { ReceivedMessageDeleteDialogComponent } from './delete/received-message-delete-dialog.component';
import { ReceivedMessageRoutingModule } from './route/received-message-routing.module';

@NgModule({
  imports: [SharedModule, ReceivedMessageRoutingModule],
  declarations: [
    ReceivedMessageComponent,
    ReceivedMessageDetailComponent,
    ReceivedMessageUpdateComponent,
    ReceivedMessageDeleteDialogComponent,
  ],
  entryComponents: [ReceivedMessageDeleteDialogComponent],
})
export class ChattingReceivedMessageModule {}
