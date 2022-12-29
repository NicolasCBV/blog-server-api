export interface CacheDBSet {
  key: string;
  value: string;
}

export interface CacheDBGet {
  key: string;
}

export interface CacheDBDel {
  key: string | string[];
}

export type UsersResultInCache = {
  active: boolean;
  id: string;
  idToken: string | null;
  admin: boolean;
  name: string;
  email: string;
  password: string;
  photo: string | null;
  description: string | null;
  accept2FA: boolean;
  OTPissued: null | number;
  OTPexpires: null | number;
  OTP: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface CacheDBAdapter {
  set: ({ key, value }: CacheDBSet) => Promise<string | null>;
  get: ({ key }: CacheDBGet) => Promise<string | null>;
  del: ({ key }: CacheDBDel) => Promise<void>;
}
