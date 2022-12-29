import multer from "multer";
import fs from "fs";
import path from "path";
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
    "users",
    mainName
  );

  fs.mkdir(dir, "0777", (err) => {
    if (!err?.message.includes("file already exists")) {
      console.error(err);
    }
  });

  // Configure the multer instance
  const upload = multer({
    dest: path.resolve(__dirname, "..", "public", "uploads", "users", mainName),
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
            "users",
            mainName
          )
        );
      },

      filename: (req, file, callback) => {
        const formatedName = file.originalname.replaceAll(" ", "_");
        callback(null, `${randomUUID()}-${mainName}-${formatedName}`);
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
