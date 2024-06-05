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
  const debts = await this.debtModel.find({ userId, type: type });
  return debts.map(debt => {
    if (debt.isEncrypted) {
      debt.debtor = this.encryptionService.decrypt(debt.debtor);
      debt.creditor = this.encryptionService.decrypt(debt.creditor);
      debt.description = debt.description ? this.encryptionService.decrypt(debt.description) : undefined;
    }
    return debt;
  });
}

  async getDebtWhenDueService(userId: string): Promise<Debt[]> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const debts = await this.debtModel.find({ userId, dueDate: { $lt: tomorrow } });
  return debts.map(debt => {
    if (debt.isEncrypted) {
      debt.debtor = this.encryptionService.decrypt(debt.debtor);
      debt.creditor = this.encryptionService.decrypt(debt.creditor);
      debt.description = debt.description ? this.encryptionService.decrypt(debt.description) : undefined;
    }
    return debt;
  });
}

  async enableEncryptService(debtId: string, userId: string): Promise<Debt> {
    const debt = await this.debtModel.findOne({ _id: debtId, userId });
    if (!debt) {
      throw new BadRequestException('Debt not found');
    }

    // Kiểm tra xem đã được mã hóa chưa
    if (debt.isEncrypted) {
      throw new BadRequestException('Debt is already encrypted');
    }

    // Mã hóa thông tin
    const encryptedDebtor = this.encryptionService.encrypt(debt.debtor);
    const encryptedCreditor = this.encryptionService.encrypt(debt.creditor);
    const encryptedDescription = debt.description ? this.encryptionService.encrypt(debt.description) : undefined;

    // Cập nhật thông tin và cờ isEncrypted
    debt.debtor = encryptedDebtor;
    debt.creditor = encryptedCreditor;
    debt.description = encryptedDescription;
    debt.isEncrypted = true;

    // Lưu lại vào cơ sở dữ liệu
    return debt.save();
  }

  async disableEncryptService(debtId: string, userId: string): Promise<Debt> {
    const debt = await this.debtModel.findOne({ _id: debtId, userId });
    if (!debt) {
      throw new BadRequestException('Debt not found');
    }

    // Kiểm tra xem đã được giải mã chưa
    if (!debt.isEncrypted) {
      throw new BadRequestException('Debt is already decrypted');
    }

    // Giải mã thông tin
    const decryptedDebtor = this.encryptionService.decrypt(debt.debtor);
    const decryptedCreditor = this.encryptionService.decrypt(debt.creditor);
    const decryptedDescription = debt.description ? this.encryptionService.decrypt(debt.description) : undefined;

    // Cập nhật thông tin và cờ isEncrypted
    debt.debtor = decryptedDebtor;
    debt.creditor = decryptedCreditor;
    debt.description = decryptedDescription;
    debt.isEncrypted = false;

    // Lưu lại vào cơ sở dữ liệu
    return debt.save();
  }
  
}
