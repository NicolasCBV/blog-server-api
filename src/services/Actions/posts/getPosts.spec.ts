import { Name } from "@entities/postTable/name";
import { postsFactory } from "@tests/factories/postsFactory";
import { usersFactory } from "@tests/factories/userFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { GetPostsService } from "./GetPostsService";

describe("Get test", () => {
  it("should be able to get posts", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = usersFactory();
    await userDatabase.create(user);

    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 1") })
    );

    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 2") })
    );

    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 3") })
    );

    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 4") })
    );

    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 5") })
    );

    await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 6") })
    );

    const getPosts = new GetPostsService(postsDatabase);

    const data = await getPosts.exec();

    expect(data).toHaveLength(5);
  });
});
