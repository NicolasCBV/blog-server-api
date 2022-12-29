import { Replace } from "@utils/replace";
import { randomUUID } from "node:crypto";
import { Description } from "./description";
import { Name } from "./name";

export interface Props {
  name: Name;
  imageUrl?: string | null;
  content: string;
  description: Description;
  creatorId: string;

  createdAt: Date;
  updatedAt: Date;
}

export class Posts {
  private _id: string;
  private props: Props;

  constructor(
    props: Replace<Props, { createdAt?: Date }, { updatedAt?: Date }>,
    id?: string
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  // props
  public get value(): Props {
    return this.props;
  }

  // id
  public get id(): string {
    return this._id;
  }

  // creatorId
  public get creatorId(): string {
    return this.props.creatorId;
  }

  public set creatorId(creatorId: string) {
    this.props.creatorId = creatorId;
  }

  // name
  public get name(): Name {
    return this.props.name;
  }

  public set name(name: Name) {
    this.props.name = name;
  }

  // content
  public get content(): string {
    return this.props.content;
  }

  public set content(content: string) {
    this.props.content = content;
  }

  // description
  public get description(): Description {
    return this.props.description;
  }

  public set description(description: Description) {
    this.props.description = description;
  }

  // imageUrl
  public get imageUrl(): string | undefined | null {
    return this.props.imageUrl;
  }

  public set imageUrl(imageUrl: string | undefined | null) {
    this.props.imageUrl = imageUrl;
  }

  // createdAt
  public get createdAt(): Date {
    return this.props.createdAt;
  }

  // updatedAt
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
