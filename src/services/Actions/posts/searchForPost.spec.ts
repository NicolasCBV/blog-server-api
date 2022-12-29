import { Name } from "@entities/postTable/name";
import { postsFactory } from "@tests/factories/postsFactory";
import { usersFactory } from "@tests/factories/userFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { SearchForPostService } from "./SearchForPostService";

describe("Get test", () => {
  it("should be able to search for posts", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory());
    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("test name") })
    );

    const searchForPost = new SearchForPostService(postsDatabase);

    const data = await searchForPost.exec({ input: "test" });

    expect(data).toBeTruthy();
  });
});
