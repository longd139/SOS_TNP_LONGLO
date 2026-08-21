import { resolveAppRole } from './authRole';

describe('resolveAppRole', () => {
  test.each([
    [{ roles: 'CHUYEN_VIEN' }, 'OFFICER'],
    [{ roles: 'LANH_DAO' }, 'LEADER'],
    [{ roles: 'CAN_BO, LANH_DAO' }, 'LEADER'],
    [{ roles: ['ADMIN'] }, 'ADMIN'],
    [{ role: 'OFFICER', roles: 'LANH_DAO' }, 'OFFICER'],
  ])('maps backend token payload %p to %s', (payload, expected) => {
    expect(resolveAppRole(payload)).toBe(expected);
  });

  test('uses the supplied fallback for an unknown backend role', () => {
    expect(resolveAppRole({ roles: 'CONG_DAN' }, 'CITIZEN')).toBe('CITIZEN');
  });
});
