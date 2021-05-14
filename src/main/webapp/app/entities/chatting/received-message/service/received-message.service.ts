import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReceivedMessage, getReceivedMessageIdentifier } from '../received-message.model';

export type EntityResponseType = HttpResponse<IReceivedMessage>;
export type EntityArrayResponseType = HttpResponse<IReceivedMessage[]>;

@Injectable({ providedIn: 'root' })
export class ReceivedMessageService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/received-messages', 'chatting');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(receivedMessage: IReceivedMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(receivedMessage);
    return this.http
      .post<IReceivedMessage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(receivedMessage: IReceivedMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(receivedMessage);
    return this.http
      .put<IReceivedMessage>(`${this.resourceUrl}/${getReceivedMessageIdentifier(receivedMessage) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(receivedMessage: IReceivedMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(receivedMessage);
    return this.http
      .patch<IReceivedMessage>(`${this.resourceUrl}/${getReceivedMessageIdentifier(receivedMessage) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IReceivedMessage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IReceivedMessage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReceivedMessageToCollectionIfMissing(
    receivedMessageCollection: IReceivedMessage[],
    ...receivedMessagesToCheck: (IReceivedMessage | null | undefined)[]
  ): IReceivedMessage[] {
    const receivedMessages: IReceivedMessage[] = receivedMessagesToCheck.filter(isPresent);
    if (receivedMessages.length > 0) {
      const receivedMessageCollectionIdentifiers = receivedMessageCollection.map(
        receivedMessageItem => getReceivedMessageIdentifier(receivedMessageItem)!
      );
      const receivedMessagesToAdd = receivedMessages.filter(receivedMessageItem => {
        const receivedMessageIdentifier = getReceivedMessageIdentifier(receivedMessageItem);
        if (receivedMessageIdentifier == null || receivedMessageCollectionIdentifiers.includes(receivedMessageIdentifier)) {
          return false;
        }
        receivedMessageCollectionIdentifiers.push(receivedMessageIdentifier);
        return true;
      });
      return [...receivedMessagesToAdd, ...receivedMessageCollection];
    }
    return receivedMessageCollection;
  }

  protected convertDateFromClient(receivedMessage: IReceivedMessage): IReceivedMessage {
    return Object.assign({}, receivedMessage, {
      receivedDate: receivedMessage.receivedDate?.isValid() ? receivedMessage.receivedDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.receivedDate = res.body.receivedDate ? dayjs(res.body.receivedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((receivedMessage: IReceivedMessage) => {
        receivedMessage.receivedDate = receivedMessage.receivedDate ? dayjs(receivedMessage.receivedDate) : undefined;
      });
    }
    return res;
  }
}
