// src/encryption/encryption.service.ts

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    this.privateKey = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();
    this.publicKey = publicKey.export({ type: 'spki', format: 'pem' }).toString(); // Convert Buffer to string
  }

  encrypt(text: string): string {
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(this.publicKey, buffer);
    return encrypted.toString('base64');
  }

  decrypt(encryptedText: string): string {
    const buffer = Buffer.from(encryptedText, 'base64');
    const decrypted = crypto.privateDecrypt(this.privateKey, buffer);
    return decrypted.toString('utf8');
  }
}