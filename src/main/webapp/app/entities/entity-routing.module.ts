import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'person',
        data: { pageTitle: 'People' },
        loadChildren: () => import('./registration/person/person.module').then(m => m.RegistrationPersonModule),
      },
      {
        path: 'like-history',
        data: { pageTitle: 'LikeHistories' },
        loadChildren: () => import('./mainPage/like-history/like-history.module').then(m => m.MainPageLikeHistoryModule),
      },
      {
        path: 'received-message',
        data: { pageTitle: 'ReceivedMessages' },
        loadChildren: () => import('./chatting/received-message/received-message.module').then(m => m.ChattingReceivedMessageModule),
      },
      {
        path: 'sent-message',
        data: { pageTitle: 'SentMessages' },
        loadChildren: () => import('./chatting/sent-message/sent-message.module').then(m => m.ChattingSentMessageModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
