export type Replace<T, R1, R2> = Omit<T, keyof R1 | keyof R2> & R1 & R2;
