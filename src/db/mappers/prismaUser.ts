import { Description } from "@entities/userTable/description";
import { Email } from "@entities/userTable/email";
import { Name } from "@entities/userTable/name";
import { OTP } from "@entities/userTable/OTP";
import { Password } from "@entities/userTable/password";
import { Users } from "@entities/userTable/_users";
import { users } from "@prisma/client";

export class PrismaUser {
  static toPrisma(data: Users) {
    return {
      active: data.active,
      photo: data.photo ?? null,
      name: data.name.value,
      email: data.email.value,
      description: data.description?.value ?? null,
      password: data.password.value,
      admin: data.admin,
      accept2FA: data.accept2FA,
      idToken: data.idToken ?? null,
      OTPissued: data.OTPissued ? BigInt(data.OTPissued) : null,
      OTPexpires: data.OTPexpires ? BigInt(data.OTPexpires) : null,
      OTP: data.OTP?.value ?? null,
    };
  }

  static toDomain(data: users): Users {
    return new Users(
      {
        active: data.active,
        photo: data.photo,
        name: new Name(data.name),
        email: new Email(data.email),
        description: new Description(data.description ?? null),
        password: new Password(data.password),
        admin: data.admin,
        accept2FA: data.accept2FA,
        idToken: data.idToken,
        OTPissued: Number(data.OTPissued),
        OTPexpires: Number(data.OTPexpires),
        OTP: new OTP(data.OTP ?? null),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id
    );
  }
}
