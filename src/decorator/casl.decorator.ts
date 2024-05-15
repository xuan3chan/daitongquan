// // casl.decorator.ts
// import { SetMetadata } from '@nestjs/common';
// import { Ability } from '@casl/ability';

// export const CHECK_POLICIES_KEY = 'CHECK_POLICIES_KEY';

// export type PolicyHandler = (ability: Ability) => boolean;

// export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);