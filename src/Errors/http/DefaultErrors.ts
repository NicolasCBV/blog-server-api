import { HttpProtocol } from "./httpErrors";

export function inconsistentError() {
  return new HttpProtocol(
    "Inconsistent data's",
    process.env.CONFLICT as string,
    "It looks like your JSON object was not populated correctly"
  );
}

export function isNotItem(name: string) {
  return new HttpProtocol(
    `${name} doesn't exist`,
    process.env.CONFLICT as string,
    "The item were you are looking for doesn't exist"
  );
}

export function isItem(name: string) {
  return new HttpProtocol(
    `${name} doesn't exist`,
    process.env.CONFLICT as string,
    "Cannot create this item because it has been created"
  );
}
