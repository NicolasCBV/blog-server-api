export function generateRandomString(): string {
  const codeArray: string[] = [];

  for (let char = 0; char <= 6; char++) {
    const isLetter = Boolean(Math.floor(Math.random() * 2));
    if (isLetter) {
      const charInAscii = Math.floor(Math.random() * (1 + 90 - 65) + 65);
      const asciiCharDecoded = String.fromCharCode(charInAscii);
      codeArray.push(asciiCharDecoded);
    } else {
      const randomNumber = String(Math.floor(Math.random() * 10));
      codeArray.push(randomNumber);
    }
  }
  const code = codeArray.join("");
  return code;
}
