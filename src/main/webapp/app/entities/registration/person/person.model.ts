import * as dayjs from 'dayjs';

export interface IPerson {
  id?: number;
  name?: string | null;
  password?: string | null;
  email?: string | null;
  birthDate?: dayjs.Dayjs;
  gender?: string;
  shortBio?: string | null;
  interests?: string | null;
  imagePath?: string | null;
  nationality?: string | null;
}

export class Person implements IPerson {
  constructor(
    public id?: number,
    public name?: string | null,
    public password?: string | null,
    public email?: string | null,
    public birthDate?: dayjs.Dayjs,
    public gender?: string,
    public shortBio?: string | null,
    public interests?: string | null,
    public imagePath?: string | null,
    public nationality?: string | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
