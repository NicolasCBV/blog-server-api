import { randomUUID } from "crypto";
import { Posts } from "@entities/postTable/_posts";
import { Name } from "@entities/postTable/name";
import { Description } from "@entities/postTable/description";

type OverrideProps = Partial<Posts>;

export function postsFactory(override: OverrideProps = {}) {
  return new Posts({
    id: randomUUID(),
    name: new Name("default"),
    description: new Description("teste"),
    content: "random content",
    creatorId: randomUUID(),
    ...override,
  });
}
