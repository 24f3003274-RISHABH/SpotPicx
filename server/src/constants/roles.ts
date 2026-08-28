export const USER_ROLES = {
  USER: 'USER',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;
// inside this folder all the constraints of the website is written, till now no need of the Business owner role , will implement in the future 

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
