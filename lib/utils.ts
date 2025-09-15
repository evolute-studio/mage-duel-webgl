// hex to ulong

export const hexToUlong = (hex: string): number => {
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }
  // Pad the hex string to ensure it's 16 characters long (8 bytes)
  hex = hex.padStart(16, "0");
  const high = parseInt(hex.slice(0, 8), 16);
  const low = parseInt(hex.slice(8, 16), 16);
  return high * 0x100000000 + low;
}

// ulong to hex

export const ulongToHex = (num: number): string => {
  if (num < 0) {
    throw new Error("Number must be non-negative");
  }
  const high = Math.floor(num / 0x100000000);
  const low = num % 0x100000000;
  return "0x" + high.toString(16).padStart(8, "0") + low.toString(16).padStart(8, "0");
}