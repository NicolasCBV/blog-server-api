import { Posts } from "@entities/postTable/_posts";
import { PostsRepositories } from "@repositories/postsRepositories";

export class PostsDatabase implements PostsRepositories {
  PostsDatabase: Posts[] = [];

  async create(data: Posts): Promise<Posts> {
    if (
      this.PostsDatabase.find((key) => key.name.value === data.name.value) ||
      this.PostsDatabase.find((key) => key.id === data.id)
    )
      throw new Error("This post already exists");

    this.PostsDatabase.push(data);
    return data;
  }

  async delete(id: string): Promise<void> {
    const index = this.PostsDatabase.findIndex((key) => key.id === id);

    this.PostsDatabase.splice(index, 1);
  }

  async search(name: string): Promise<Posts | null> {
    const post = this.PostsDatabase.find((key) => {
      return key.name.value === name;
    });

    return post ?? null;
  }

  async getGroup(): Promise<Posts[] | []> {
    const posts = this.PostsDatabase.filter((item, index) => index < 5);
    const minimalPosts: Posts[] = posts.map((item) => {
      return new Posts(
        {
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
          content: "oculted",
          creatorId: item.creatorId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
        item.id
      );
    });

    return minimalPosts;
  }

  async searchFor(input: string): Promise<Posts[] | null> {
    const posts = this.PostsDatabase.filter((key) => {
      return (
        key.name.value.includes(input) ||
        key.description?.value?.includes(input) ||
        key.content.includes(input) ||
        key.imageUrl?.includes(input)
      );
    });

    return posts ?? null;
  }

  async searchForId(id: string): Promise<Posts | null> {
    const posts = this.PostsDatabase.find((key) => key.id === id);

    return posts ?? null;
  }

  async update(data: Posts): Promise<void> {
    const postIndex = this.PostsDatabase.findIndex((key) => key.id === data.id);

    if (postIndex === undefined || postIndex === null || postIndex === -1)
      throw new Error("Post doesn't exists");

    this.PostsDatabase[postIndex] = data;
  }
}
