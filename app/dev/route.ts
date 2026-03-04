import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'MageDuelAndroidDev.apk');

  const file = await readFile(filePath);

  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="MageDuelAndroidDev.apk"',
      'Content-Length': file.byteLength.toString(),
    },
  });
}
