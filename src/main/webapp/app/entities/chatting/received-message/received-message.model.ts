import * as dayjs from 'dayjs';

export interface IReceivedMessage {
  id?: number;
  receiverId?: number;
  fromPersonId?: number;
  message?: string | null;
  receivedDate?: dayjs.Dayjs | null;
  isDeleted?: boolean | null;
}

export class ReceivedMessage implements IReceivedMessage {
  constructor(
    public id?: number,
    public receiverId?: number,
    public fromPersonId?: number,
    public message?: string | null,
    public receivedDate?: dayjs.Dayjs | null,
    public isDeleted?: boolean | null
  ) {
    this.isDeleted = this.isDeleted ?? false;
  }
}

export function getReceivedMessageIdentifier(receivedMessage: IReceivedMessage): number | undefined {
  return receivedMessage.id;
}
