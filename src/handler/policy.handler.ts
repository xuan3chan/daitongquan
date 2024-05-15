// policy.handler.ts
import { Ability } from '@casl/ability';

export type PolicyHandler = (ability: Ability) => boolean;