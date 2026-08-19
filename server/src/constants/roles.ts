export const USER_ROLES = {
  USER: 'USER',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
