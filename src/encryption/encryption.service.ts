// src/encryption/encryption.service.ts

import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr';

  private async generateKey(password: string): Promise<Buffer> {
    return (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  }

  async encrypt(text: string, password: string): Promise<{ iv: string, content: string }> {
    const iv = randomBytes(16);
    const key = await this.generateKey(password);
    const cipher = createCipheriv(this.algorithm, key, iv);
    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: iv.toString('hex'),
      content: encryptedText.toString('hex')
    };
  }

  async decrypt(encrypted: { iv: string, content: string }, password: string): Promise<string> {
  const iv = encrypted.iv ? Buffer.from(encrypted.iv, 'hex') : null;
  if (iv && iv.length !== 16) {
    throw new Error('Invalid initialization vector');
  }
  const key = await this.generateKey(password);
  const decipher = createDecipheriv(this.algorithm, key, iv || Buffer.alloc(16, 0));
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(encrypted.content, 'hex')),
    decipher.final()
  ]);
  return decryptedText.toString();
}
}
