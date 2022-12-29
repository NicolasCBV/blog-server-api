import { Name } from "@entities/postTable/name";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Search test", () => {
  it("should be able to search for posts", async () => {
    const postsDatabase = new PostsDatabase();

    await postsDatabase.create(
      postsFactory({ name: new Name("wqdub hosnczakj42qgxjbd") })
    );

    await postsDatabase.create(postsFactory({ name: new Name("wqdub") }));
    await postsDatabase.create(postsFactory());

    const post = await postsDatabase.searchFor("wqdub");

    expect(post).toHaveLength(2);
  });
});
