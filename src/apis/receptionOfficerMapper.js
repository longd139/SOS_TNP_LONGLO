const OFFICER_ROLES = new Set([
  "CHUYEN_VIEN",
  "CAN_BO",
  "OFFICER",
  "RECEPTION_OFFICER",
  "PROCESSING_OFFICER",
]);

export const normalizeReceptionOfficers = (users) => {
  if (!Array.isArray(users)) return [];

  return users
    .filter((user) => {
      const roles = String(user.vai_tro || user.roles || "")
        .toUpperCase()
        .split(/[\s,]+/)
        .filter(Boolean);
      return user.is_active !== false && roles.some((role) => OFFICER_ROLES.has(role));
    })
    .map((user) => ({
      ...user,
      id: user.id || user._id,
      fullName: user.ho_va_ten || user.fullName || user.ten_dang_nhap,
      username: user.ten_dang_nhap || user.tenDangNhap || user.username,
    }))
    .filter((user) => user.id && user.username)
    .sort((left, right) => left.fullName.localeCompare(right.fullName, "vi"));
};

export const getSelectableReceptionOfficers = (
  officers,
  counterAssignmentsMap,
  currentOfficerId
) => {
  const assignedOfficerIds = new Set(
    Object.values(counterAssignmentsMap || {}).filter(Boolean)
  );
  return (Array.isArray(officers) ? officers : []).filter((officer) => {
    const officerId = officer.id || officer._id;
    return officerId === currentOfficerId || !assignedOfficerIds.has(officerId);
  });
};
