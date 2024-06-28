import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Debt, DebtDocument } from './schema/debt.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptionService } from '../encryption/encryption.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DebtService {
  constructor(
    @InjectModel(Debt.name) private debtModel: Model<DebtDocument>,
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
  ) {}

  async createDebtService(
    debtor: string,
    creditor: string,
    userId: string,
    amount: number,
    status: string,
    type: string,
    dueDate: Date,
    description?: string,
  ): Promise<Debt> {
    if (dueDate && dueDate < new Date()) {
      throw new BadRequestException('Due date must be in the future or today');
    }

    const newDebt = new this.debtModel({
      debtor,
      creditor,
      userId,
      amount,
      description,
      status,
      type,
      dueDate,
    });

    return newDebt.save();
  }

  async updateDebtService(
    debtId: string,
    userId: string,
    debtor?: string,
    creditor?: string,
    amount?: number,
    type?: string,
    dueDate?: Date,
    description?: string,
  ): Promise<Debt> {
    const debt = await this.debtModel.findById({ _id: debtId, userId });
    if (!debt) {
      throw new BadRequestException('Debt not found');
    }
    if (dueDate && dueDate < new Date()) {
      throw new BadRequestException('Due date must be in the future or today');
    }
   if (debtor) {
      debt.debtor = debtor;
    }
    if (creditor) {
      debt.creditor = creditor;
    }
    if (amount) {
      debt.amount = amount;
    }
    if (type) {
      debt.type = type;
    }
    if (dueDate) {
      debt.dueDate = dueDate;
    }
    if (description) {
      debt.description = description;
    }
    return debt.save();
  }

  async deleteDebtService(debtId: string, userId: string): Promise<{ message: string }> {
    const debt = await this.debtModel.findOneAndDelete({ _id: debtId, userId });
    if (!debt) {
      throw new BadRequestException('Debt not found');
    }
    return { message: 'Debt deleted successfully' };
  }

  private async decryptDebtData(debt: Debt, userId: string): Promise<Debt> {
    const findUser = await this.usersService.findUserByIdService(userId);
    const encryptedKey = findUser.encryptKey;
    const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);

    debt.isEncrypted = debt.isEncrypted;
    debt.debtor = this.encryptionService.decryptData(debt.debtor, decryptedKey);
    debt.creditor = this.encryptionService.decryptData(debt.creditor, decryptedKey);
    debt.description = debt.description
      ? this.encryptionService.decryptData(debt.description, decryptedKey)
      : undefined;

    return debt;
  }

  async getDebtByTypeService(userId: string, type: string): Promise<Debt[]> {
    const debts = await this.debtModel.find({ userId, type });
    const findUser = await this.usersService.findUserByIdService(userId);

    const decryptedDebts = await Promise.all(
      debts.map((debt) => (debt.isEncrypted ? this.decryptDebtData(debt, findUser._id) : debt))
    );

    return decryptedDebts;
  }

  async getDebtWhenDueService(userId: string): Promise<Debt[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const debts = await this.debtModel.find({ userId, dueDate: { $lt: tomorrow } });
    const findUser = await this.usersService.findUserByIdService(userId);

    return Promise.all(debts.map((debt) => (debt.isEncrypted ? this.decryptDebtData(debt, findUser._id) : Promise.resolve(debt))));
  }

  private async changeEncryptionState(debtId: string, userId: string, encrypt: boolean): Promise<Debt> {
    const debt = await this.debtModel.findById(debtId);
    if (!debt || debt.isEncrypted === encrypt) {
      throw new BadRequestException(`Debt not found or already ${encrypt ? 'encrypted' : 'decrypted'}`);
    }

    const findUser = await this.usersService.findUserByIdService(userId);
    const encryptedKey = findUser.encryptKey;
    const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);

    debt.isEncrypted = encrypt;
    debt.debtor = encrypt
      ? this.encryptionService.encryptData(debt.debtor, decryptedKey)
      : this.encryptionService.decryptData(debt.debtor, decryptedKey);
    debt.creditor = encrypt
      ? this.encryptionService.encryptData(debt.creditor, decryptedKey)
      : this.encryptionService.decryptData(debt.creditor, decryptedKey);
    debt.description = debt.description
      ? encrypt
        ? this.encryptionService.encryptData(debt.description, decryptedKey)
        : this.encryptionService.decryptData(debt.description, decryptedKey)
      : undefined;

    return debt.save();
  }

  async enableEncryptionService(debtId: string, userId: string): Promise<Debt> {
    return this.changeEncryptionState(debtId, userId, true);
  }

  async disableEncryptionService(debtId: string, userId: string): Promise<Debt> {
    return this.changeEncryptionState(debtId, userId, false);
  }
}
