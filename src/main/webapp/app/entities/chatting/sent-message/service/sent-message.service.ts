import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISentMessage, getSentMessageIdentifier } from '../sent-message.model';

export type EntityResponseType = HttpResponse<ISentMessage>;
export type EntityArrayResponseType = HttpResponse<ISentMessage[]>;

@Injectable({ providedIn: 'root' })
export class SentMessageService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/sent-messages', 'chatting');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(sentMessage: ISentMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sentMessage);
    return this.http
      .post<ISentMessage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sentMessage: ISentMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sentMessage);
    return this.http
      .put<ISentMessage>(`${this.resourceUrl}/${getSentMessageIdentifier(sentMessage) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sentMessage: ISentMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sentMessage);
    return this.http
      .patch<ISentMessage>(`${this.resourceUrl}/${getSentMessageIdentifier(sentMessage) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISentMessage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISentMessage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSentMessageToCollectionIfMissing(
    sentMessageCollection: ISentMessage[],
    ...sentMessagesToCheck: (ISentMessage | null | undefined)[]
  ): ISentMessage[] {
    const sentMessages: ISentMessage[] = sentMessagesToCheck.filter(isPresent);
    if (sentMessages.length > 0) {
      const sentMessageCollectionIdentifiers = sentMessageCollection.map(sentMessageItem => getSentMessageIdentifier(sentMessageItem)!);
      const sentMessagesToAdd = sentMessages.filter(sentMessageItem => {
        const sentMessageIdentifier = getSentMessageIdentifier(sentMessageItem);
        if (sentMessageIdentifier == null || sentMessageCollectionIdentifiers.includes(sentMessageIdentifier)) {
          return false;
        }
        sentMessageCollectionIdentifiers.push(sentMessageIdentifier);
        return true;
      });
      return [...sentMessagesToAdd, ...sentMessageCollection];
    }
    return sentMessageCollection;
  }

  protected convertDateFromClient(sentMessage: ISentMessage): ISentMessage {
    return Object.assign({}, sentMessage, {
      sendDate: sentMessage.sendDate?.isValid() ? sentMessage.sendDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.sendDate = res.body.sendDate ? dayjs(res.body.sendDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sentMessage: ISentMessage) => {
        sentMessage.sendDate = sentMessage.sendDate ? dayjs(sentMessage.sendDate) : undefined;
      });
    }
    return res;
  }
}
