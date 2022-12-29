import { Description } from "@entities/userTable/description";
import { Email } from "@entities/userTable/email";
import { Name } from "@entities/userTable/name";
import { OTP } from "@entities/userTable/OTP";
import { Password } from "@entities/userTable/password";
import { Props, Users } from "@entities/userTable/_users";

export type ToDomainPropsCache = Props & { id: string; cachedAt: Date };

export interface CacheProps {
  id: string;
  active: boolean;
  idToken?: string | null;
  name: string;
  email: string;
  description?: string | null;
  password: string;
  admin: boolean;
  photo?: string | null;

  accept2FA: boolean;
  OTP?: string | null;
  OTPissued?: number | null;
  OTPexpires?: number | null;

  createdAt: Date;
  updatedAt: Date;
  cachedAt: Date;
}

export class UserObject {
  static toDomain(data: CacheProps): ToDomainPropsCache {
    return {
      id: data.id,
      active: data.active,
      photo: data.photo,
      name: new Name(data.name),
      email: new Email(data.email),
      description: new Description(data.description ?? null),
      password: new Password(data.password),
      admin: data.admin,
      accept2FA: data.accept2FA,
      idToken: data.idToken,
      OTPissued: data.OTPissued,
      OTPexpires: data.OTPexpires,
      OTP: new OTP(data.OTP ?? null),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      cachedAt: data.cachedAt,
    };
  }

  static toUsersOnDB(data: ToDomainPropsCache): Users {
    return new Users(
      {
        active: data.active,
        photo: data.photo,
        name: new Name(data.name.value),
        email: new Email(data.email.value),
        description: new Description(data.description?.value ?? null),
        password: new Password(data.password.value),
        admin: data.admin,
        accept2FA: data.accept2FA,
        idToken: data.idToken,
        OTPissued: data.OTPissued,
        OTPexpires: data.OTPexpires,
        OTP: new OTP(data.OTP?.value ?? null),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id
    );
  }

  static toRedis(data: Props & { id: string; cachedAt?: Date }) {
    return {
      id: data.id,
      active: data.active,
      photo: data.photo,
      name: data.name.value,
      email: data.email.value,
      description: data.description?.value ?? null,
      password: data.password.value,
      admin: data.admin,
      accept2FA: data.accept2FA,
      idToken: data.idToken,
      OTPissued: data.OTPissued,
      OTPexpires: data.OTPexpires,
      OTP: data.OTP?.value ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      cachedAt: new Date(),
    };
  }
}
