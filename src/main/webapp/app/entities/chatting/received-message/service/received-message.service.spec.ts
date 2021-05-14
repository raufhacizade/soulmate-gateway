import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IReceivedMessage, ReceivedMessage } from '../received-message.model';

import { ReceivedMessageService } from './received-message.service';

describe('Service Tests', () => {
  describe('ReceivedMessage Service', () => {
    let service: ReceivedMessageService;
    let httpMock: HttpTestingController;
    let elemDefault: IReceivedMessage;
    let expectedResult: IReceivedMessage | IReceivedMessage[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ReceivedMessageService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        receiverId: 0,
        fromPersonId: 0,
        message: 'AAAAAAA',
        receivedDate: currentDate,
        isDeleted: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            receivedDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ReceivedMessage', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            receivedDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            receivedDate: currentDate,
          },
          returnedFromService
        );

        service.create(new ReceivedMessage()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ReceivedMessage', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            receiverId: 1,
            fromPersonId: 1,
            message: 'BBBBBB',
            receivedDate: currentDate.format(DATE_FORMAT),
            isDeleted: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            receivedDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ReceivedMessage', () => {
        const patchObject = Object.assign(
          {
            message: 'BBBBBB',
            receivedDate: currentDate.format(DATE_FORMAT),
          },
          new ReceivedMessage()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            receivedDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ReceivedMessage', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            receiverId: 1,
            fromPersonId: 1,
            message: 'BBBBBB',
            receivedDate: currentDate.format(DATE_FORMAT),
            isDeleted: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            receivedDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ReceivedMessage', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addReceivedMessageToCollectionIfMissing', () => {
        it('should add a ReceivedMessage to an empty array', () => {
          const receivedMessage: IReceivedMessage = { id: 123 };
          expectedResult = service.addReceivedMessageToCollectionIfMissing([], receivedMessage);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(receivedMessage);
        });

        it('should not add a ReceivedMessage to an array that contains it', () => {
          const receivedMessage: IReceivedMessage = { id: 123 };
          const receivedMessageCollection: IReceivedMessage[] = [
            {
              ...receivedMessage,
            },
            { id: 456 },
          ];
          expectedResult = service.addReceivedMessageToCollectionIfMissing(receivedMessageCollection, receivedMessage);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ReceivedMessage to an array that doesn't contain it", () => {
          const receivedMessage: IReceivedMessage = { id: 123 };
          const receivedMessageCollection: IReceivedMessage[] = [{ id: 456 }];
          expectedResult = service.addReceivedMessageToCollectionIfMissing(receivedMessageCollection, receivedMessage);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(receivedMessage);
        });

        it('should add only unique ReceivedMessage to an array', () => {
          const receivedMessageArray: IReceivedMessage[] = [{ id: 123 }, { id: 456 }, { id: 86658 }];
          const receivedMessageCollection: IReceivedMessage[] = [{ id: 123 }];
          expectedResult = service.addReceivedMessageToCollectionIfMissing(receivedMessageCollection, ...receivedMessageArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const receivedMessage: IReceivedMessage = { id: 123 };
          const receivedMessage2: IReceivedMessage = { id: 456 };
          expectedResult = service.addReceivedMessageToCollectionIfMissing([], receivedMessage, receivedMessage2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(receivedMessage);
          expect(expectedResult).toContain(receivedMessage2);
        });

        it('should accept null and undefined values', () => {
          const receivedMessage: IReceivedMessage = { id: 123 };
          expectedResult = service.addReceivedMessageToCollectionIfMissing([], null, receivedMessage, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(receivedMessage);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
