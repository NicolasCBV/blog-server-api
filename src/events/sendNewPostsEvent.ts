import { EventEmitter } from "node:events";

import { MailAdapter } from "@adapters/mailAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { Email } from "@entities/userTable/email";
import { UsersRepositories } from "@repositories/usersRepositories";
import { PostsRepositories } from "@repositories/postsRepositories";

class NewEventEmitter extends EventEmitter {}

const eventEmitterSendPosts = new NewEventEmitter();

async function sendNewPostEvent(
  postId: string,
  userAdapter: UsersRepositories,
  postAdapter: PostsRepositories,
  mailAdapter: MailAdapter
): Promise<void> {
  // Search for post and your creator
  const post = await postAdapter.searchForId(postId);

  if (!post) throw inconsistentError();

  const user = await userAdapter.searchForId(post!.creatorId);

  // Get all users email on database
  const allUsers: Email[] | null = await userAdapter.GetAllEmailUsers();

  if (!allUsers)
    throw new HttpProtocol(
      "The database don't have any users",
      process.env.CONFLICT as string
    );

  // Send email for all users
  allUsers.forEach(async (email) => {
    await mailAdapter.sendMail({
      from: `${user!.name} <${process.env.EMAIL_SENDER as string}>`,
      to: email.value,
      subject: post.description.value,
      body: post.content,
    });
  });
}

eventEmitterSendPosts.on(
  "send",
  async (postId, userAdapter, postAdapter, mailAdapter): Promise<void> => {
    sendNewPostEvent(postId, userAdapter, postAdapter, mailAdapter).catch(
      (err) => console.error(err)
    );
  }
);

export { eventEmitterSendPosts };
