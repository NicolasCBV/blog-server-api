import { Replace } from "@utils/replace";
import { randomUUID } from "node:crypto";
import { Description } from "./description";
import { Email } from "./email";
import { Name } from "./name";
import { OTP } from "./OTP";
import { Password } from "./password";

export interface Props {
  active: boolean;
  idToken?: string | null;
  name: Name;
  email: Email;
  description?: Description | null;
  password: Password;
  admin: boolean;
  photo?: string | null;

  accept2FA: boolean;
  OTP?: OTP | null;
  OTPissued?: number | null;
  OTPexpires?: number | null;

  createdAt: Date;
  updatedAt: Date;
}

export class Users {
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

  // idToken
  public get idToken(): string | undefined | null {
    return this.props.idToken;
  }

  public set idToken(idToken: string | undefined | null) {
    this.props.idToken = idToken;
  }

  // active
  public get active(): boolean {
    return this.props.active;
  }

  public set active(active: boolean) {
    this.props.active = active;
  }

  // name
  public get name(): Name {
    return this.props.name;
  }

  public set name(name: Name) {
    this.props.name = name;
  }

  // email
  public get email(): Email {
    return this.props.email;
  }

  public set email(email: Email) {
    this.props.email = email;
  }

  // description
  public get description(): Description | null | undefined {
    return this.props.description;
  }

  public set description(description: Description | null | undefined) {
    this.props.description = description;
  }

  // password
  public get password(): Password {
    return this.props.password;
  }

  public set password(password: Password) {
    this.props.password = password;
  }

  // admin
  public get admin(): boolean {
    return this.props.admin;
  }

  public set admin(admin: boolean) {
    this.props.admin = admin;
  }

  // accept2FA
  public get accept2FA(): boolean {
    return this.props.accept2FA;
  }

  public set accept2FA(accept2FA: boolean) {
    this.props.accept2FA = accept2FA;
  }

  // photo
  public get photo(): string | undefined | null {
    return this.props.photo;
  }

  public set photo(photo: string | undefined | null) {
    this.props.photo = photo;
  }

  // OTP
  public get OTP(): OTP | null | undefined {
    return this.props.OTP;
  }

  public set OTP(otp: OTP | null | undefined) {
    this.props.OTP = otp;
  }

  // OTPissued
  public get OTPissued(): number | undefined | null {
    return this.props.OTPissued;
  }

  public set OTPissued(OTPissued: number | undefined | null) {
    this.props.OTPissued = OTPissued;
  }

  // OTPexpires
  public get OTPexpires(): number | undefined | null {
    return this.props.OTPexpires;
  }

  public set OTPexpires(OTPexpires: number | undefined | null) {
    this.props.OTPexpires = OTPexpires;
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
