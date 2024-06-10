import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-ecb';
const ENCODING = 'base64';

@Injectable()
export class EncryptionService {
  constructor() {}

  private createCipher(password: string) {
    return crypto.createCipheriv(ALGORITHM, password.substr(0, 32), '');
  }

  private createDecipher(password: string) {
    return crypto.createDecipheriv(ALGORITHM, password.substr(0, 32), '');
  }

  createEncryptKey(password: string): string {
    const keyA = crypto.randomBytes(32);
    const cipher = this.createCipher(password);
    let keyB = cipher.update(keyA);
    keyB = Buffer.concat([keyB, cipher.final()]);
    return keyB.toString(ENCODING);
  }

  decryptEncryptKey(encryptKey: string, password: string): string {
    const decipher = this.createDecipher(password);
    let decryptedKey = decipher.update(Buffer.from(encryptKey, ENCODING));
    decryptedKey = Buffer.concat([decryptedKey, decipher.final()]);
    return decryptedKey.toString(ENCODING);
  }

  encryptData(data: string, key: string): string {
    const cipher = this.createCipher(key);
    let encryptedData = cipher.update(data);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    return encryptedData.toString(ENCODING);
  }

  decryptData(data: string, key: string): string {
    const decipher = this.createDecipher(key);
    let decryptedData = decipher.update(Buffer.from(data, ENCODING));
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    return decryptedData.toString();
  }
}