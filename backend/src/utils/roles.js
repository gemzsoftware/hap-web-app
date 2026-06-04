export const USER_ROLES = ['investor', 'admin', 'super_admin', 'staff'];
export const ADMIN_ROLES = ['admin', 'super_admin', 'staff'];
export const ADMIN_OWNER_ROLES = ADMIN_ROLES;

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function isSuperAdminRole(role) {
  return role === 'super_admin';
}
