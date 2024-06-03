import { BadRequestException, Injectable } from '@nestjs/common';
import { Debt, DebtDocument } from './schema/debt.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class DebtService {
  constructor(
    @InjectModel(Debt.name) private debtModel: Model<DebtDocument>,
    private readonly encryptionService: EncryptionService,
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
    //date must be in the future or today
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
    debt.debtor = debtor || debt.debtor;
    debt.creditor = creditor || debt.creditor;
    debt.amount = amount || debt.amount;
    debt.type = type || debt.type;
    debt.dueDate = dueDate || debt.dueDate;
    debt.description = description || debt.description;
    return debt.save();
  }

  async deleteDebtService(debtId: string, userId: string): Promise<any> {
    const debt = await this.debtModel.findOneAndDelete({ _id: debtId, userId });
    if (!debt) {
      throw new BadRequestException('Debt not found');
    }
    return { massage: 'Debt deleted successfully' };
  }

  async getDebtByTypeService(userId: string, type: string): Promise<Debt[]> {
    return this.debtModel.find({ userId, type: type });
  }

  async getDebtWhenDueService(userId: string): Promise<Debt[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.debtModel.find({ userId, dueDate: { $lt: tomorrow } });
  }

  async enableAndEncryptDebtService(
    debtId: string,
    userId: string,
    encryptKey: string,
  ): Promise<Debt> {
    const debt = await this.debtModel.findOne({ _id: debtId, userId });
    if (!debt) {
      throw new BadRequestException('Debt not found');
    }

    const encryptedDebtor = await this.encryptionService.encrypt(
      debt.debtor,
      encryptKey,
    );
    const encryptedCreditor = await this.encryptionService.encrypt(
      debt.creditor,
      encryptKey,
    );
    let encryptedDescription: { content: any; iv?: string };
    if (debt.description) {
      encryptedDescription = await this.encryptionService.encrypt(
        debt.description,
        encryptKey,
      );
    }

    debt.debtor = encryptedDebtor.content;
    debt.creditor = encryptedCreditor.content;
    debt.description = encryptedDescription
      ? encryptedDescription.content
      : undefined;
    debt.isEncrypted = true;
    debt.encryptKey = encryptKey;
    return debt.save();
  }
  //decrypt debt change save key
}
