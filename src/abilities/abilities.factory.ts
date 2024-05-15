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
        cannot(action, subject);
      });
    });
  }

 private getPermissionsForRole(permissionIDs: number[]) {
  let allPermissions;
  try {
    const filePath = path.resolve(__dirname, '../permission.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    allPermissions = JSON.parse(fileData);
  } catch (error) {
    throw new NotFoundException(error.message);
  }

  // Filter the permissions based on the permissionIDs
  const rolePermissions = allPermissions.filter(permission => permissionIDs.includes(permission.id));
 

  return rolePermissions;
}
}