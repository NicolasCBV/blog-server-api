import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

import { HttpProtocol } from "@errors/http/httpErrors";

function setMulter(mainName: string) {
  // Get dir of user photos or create the same
  const dir = path.resolve(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "posts",
    mainName
  );

  fs.mkdir(dir, "0777", (err) => {
    if (err && err?.message.includes("file already exists")) {
      return;
    }

    if (err) console.error(err);
  });

  // Configure the multer instance
  const upload = multer({
    dest: path.resolve(__dirname, "..", "public", "uploads", "posts", mainName),
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(
          null,
          path.resolve(
            __dirname,
            "..",
            "..",
            "public",
            "uploads",
            "posts",
            mainName
          )
        );
      },

      filename: (req, file, callback) => {
        const originalName = file.originalname.replaceAll(" ", "_");

        callback(null, `${randomUUID()}-${mainName}-${originalName}`);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      const allowedMimes = [
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/gif",
      ];

      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(
          new HttpProtocol(
            "Invalid file type.",
            process.env.CONFLICT as string,
            "This file is not supported by the server"
          )
        );
      }
    },
  });

  return upload;
}

export { setMulter };
