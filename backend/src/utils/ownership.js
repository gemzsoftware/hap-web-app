export function assertOwnerOrStaff(request, userId) {
  const currentUser = request.user;
  if (!currentUser) {
    throw request.server.httpErrors.unauthorized('Authentication required');
  }
  if (['admin', 'staff'].includes(currentUser.role)) return;
  if (currentUser.id !== userId?.toString()) {
    throw request.server.httpErrors.forbidden('You do not have access to this resource');
  }
}
