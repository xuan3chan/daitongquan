import { defineAbility } from '@casl/ability';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';



@Injectable()
export class AbilityFactory {

  createForUser(permissions: any) {
    if (!Array.isArray(permissions)) {
      console.log(permissions);
      throw new Error('Permissions is undefined or not an array');
    }

    const rolePermissions = permissions.reduce((acc, permission) => {
      const permissionForRole = this.getPermissionsForRole(permission.toString()); // Convert permission to string
      return acc.concat(permissionForRole);
    }, []);

    return defineAbility((can, cannot) => {
      rolePermissions.forEach(({ action, subject }) => {
        can(action, subject);
      });
    });
  }

  private getPermissionsForRole(permissionID: number) {
    console.log(permissionID);
    let allPermissions;
    try {
      const filePath = path.resolve(__dirname, './config/permission.json');
      const fileData = fs.readFileSync(filePath, 'utf-8');
      allPermissions = JSON.parse(fileData);

      
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    // Assuming each role has a specific set of permissions, you need to filter the permissions based on the permissionID
    const rolePermissions = allPermissions.filter(permission => permission.permissionID === permissionID);

    return rolePermissions;
  }
}