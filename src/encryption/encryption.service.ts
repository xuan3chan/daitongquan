import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class EncryptionService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor() {
    if (!fs.existsSync('private.pem') || !fs.existsSync('public.pem')) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });

      fs.writeFileSync('private.pem', privateKey.export({ type: 'pkcs1', format: 'pem' }));
      fs.writeFileSync('public.pem', publicKey.export({ type: 'spki', format: 'pem' }));
    }

    this.privateKey = fs.readFileSync('private.pem', 'utf8');
    this.publicKey = fs.readFileSync('public.pem', 'utf8');
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