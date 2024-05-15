import { BadRequestException, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';


@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<Role>,
    ) {}
    async createRoleService(name:string,permissionID:number[]): Promise<Role> {
        const role = await this.roleModel.findOne
        ({
            name
        }).exec();
        if(role){
            throw new BadRequestException('Role already exists');
        }
        const newRole = new this.roleModel({
            name,
            permissionID
        });
        return newRole.save();
    }
}
