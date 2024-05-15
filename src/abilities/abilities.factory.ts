import { defineAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Admin } from '../admin/schema/admin.schema';
import { User } from '../users/schema/user.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AbilityFactory {

  createForUser(user: User | Admin) {
    const { role } = user;
    const permissionID = typeof role === 'string' ? role : role.toString(); // Convert permissionID to a string
    const permissions = this.getPermissionsForRole(permissionID);

    return defineAbility((can, cannot) => {
      permissions.forEach(({ action, subject }) => {
        can(action, subject);
      });
    });
  }

  private getPermissionsForRole(permissionID: string) {
    const allPermissions = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `../permission.json`), 'utf-8'),
    );

    // Assuming each role has a specific set of permissions, you need to filter the permissions based on the roleId
    const rolePermissions = allPermissions.filter(permission => permission.permissionID === permissionID);

    return rolePermissions;
  }
}