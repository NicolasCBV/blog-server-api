import { Description } from "@entities/userTable/description";
import { Name } from "@entities/userTable/name";
import { Password } from "@entities/userTable/password";
import { Email } from "@entities/userTable/email";
import { Users } from "@entities/userTable/_users";
import { randomUUID } from "crypto";

type OverrideProps = Partial<Users>;

export function usersFactory(override: OverrideProps = {}) {
  return new Users({
    id: randomUUID(),
    admin: true,
    name: new Name("default"),
    email: new Email("email"),
    active: true,
    description: new Description("teste"),
    password: new Password("1234"),
    accept2FA: false,
    ...override,
  });
}
