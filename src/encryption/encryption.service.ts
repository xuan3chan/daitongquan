import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';

const ALGORITHM = 'aes-256-ecb';
const ENCODING = 'base64';

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
  updateEncryptKey(password: string, decryptedKey: string): string {
    const cipher = this.createCipher(password);
    let encryptedKey = cipher.update(Buffer.from(decryptedKey, ENCODING));
    encryptedKey = Buffer.concat([encryptedKey, cipher.final()]);
    return encryptedKey.toString(ENCODING);
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
  rsaEncrypt(text: string): string {
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(this.publicKey, buffer);
    return encrypted.toString('base64');
  }

  rsaDecrypt(text: string): string {
    try{
    const buffer = Buffer.from(text, 'base64');
    const decrypted = crypto.privateDecrypt(this.privateKey, buffer);
    return decrypted.toString('utf8');
    }catch(e){
      
      return text;
    }
  }
}
