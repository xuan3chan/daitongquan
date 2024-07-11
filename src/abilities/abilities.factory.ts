import { defineAbility } from '@casl/ability';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AbilityFactory {
  createForUser(permissions: number[]) {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions is undefined or not an array');
    }

    const rolePermissions = permissions.reduce((acc, permission) => {
      const permissionForRole = this.getPermissionsForRole([permission]);
      return acc.concat(permissionForRole);
    }, []);
    // console.log(rolePermissions);
    return defineAbility((can, cannot) => {
      rolePermissions.forEach(({ action, subject }) => {
        can(action, subject);
      });
    });
  }
  private getPermissionsForRole(permissionIDs: number[]) {
    // console.log(permissionIDs);
    let allPermissions;
    try {
      const filePath = path.resolve('./src/config/permission.json');
      const fileData = fs.readFileSync(filePath, 'utf-8');
      allPermissions = JSON.parse(fileData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    // Ensure permissionIDs is an array
    if (!Array.isArray(permissionIDs)) {
      throw new Error('permissionIDs is not an array');
    }

    // Filter the permissions based on the permissionIDs
    const rolePermissions = allPermissions.filter((permission) =>
      permissionIDs.includes(permission.id),
    );
    // console.log('factory'+rolePermissions);

    return rolePermissions;
  }
}