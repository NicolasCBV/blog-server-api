import { EventEmitter } from "node:events";
import fs from "fs";
import path from "path";

class NewEventEmitter extends EventEmitter {}

const eventEmitterCleanPhotoPost = new NewEventEmitter();

async function cleanPhoto(url: string, filename: string): Promise<void> {
  // Try find some data in photos post folder
  const files = fs.readdirSync(url);

  // If is empty throw one error
  if (files.length <= 1 && files[0] === null) {
    throw new Error("This folder is empty");
  }

  // Else delete all files
  for (const file of files) {
    if (file !== filename) fs.rmSync(path.join(url, file));
  }
}

eventEmitterCleanPhotoPost.on("clean", async (url, filename): Promise<void> => {
  cleanPhoto(url, filename).catch((err) => {
    if (err && !err.message.includes("no such file or directory"))
      console.error(err.name);
  });
});

export { eventEmitterCleanPhotoPost };
