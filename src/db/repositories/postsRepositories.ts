import { Posts } from "@entities/postTable/_posts";

export abstract class PostsRepositories {
  create: (data: Posts) => Promise<Posts>;
  delete: (id: string) => Promise<void>;

  search: (name: string) => Promise<Posts | null>;
  searchForId: (id: string) => Promise<Posts | null>;
  getGroup: () => Promise<Posts[] | []>;
  searchFor: (input: string) => Promise<Posts[] | null>;

  update: (data: Posts) => Promise<void>;
}
