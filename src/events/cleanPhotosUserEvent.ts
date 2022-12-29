import { EventEmitter } from "node:events";
import fs from "fs";
import path from "path";

import { UsersResultInCache } from "../db/cache/cacheDBAdapter";

class NewEventEmitter extends EventEmitter {}

const eventEmitterCleanPhotosUser = new NewEventEmitter();

async function cleanPhotos(
  user: UsersResultInCache,
  url: string,
  filename: string
): Promise<void> {
  // Try find some data in photos user folder
  const files = fs.readdirSync(url);
  user.photo = null;

  // If is empty throw one error
  if (files.length <= 1 && files[0] === null) {
    throw new Error("This folder is empty");
  }

  // Else delete all files
  for (const file of files) {
    if (file !== filename) fs.rmSync(path.join(url, file));
  }
}

eventEmitterCleanPhotosUser.on(
  "clean",
  async (user, url, filename): Promise<void> => {
    cleanPhotos(user, url, filename).catch((err) => console.error(err));
  }
);

export { eventEmitterCleanPhotosUser };
