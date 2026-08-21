import {
  getSelectableReceptionOfficers,
  normalizeReceptionOfficers,
} from './receptionOfficerMapper';

describe('normalizeReceptionOfficers', () => {
  test('keeps active officers, maps snake_case fields and removes leaders', () => {
    const result = normalizeReceptionOfficers([
      { id: '1', ten_dang_nhap: 'canbo1', ho_va_ten: 'Nguyễn Văn An', vai_tro: 'CHUYEN_VIEN', is_active: true },
      { id: '2', ten_dang_nhap: 'lanhdao1', ho_va_ten: 'Lãnh đạo 01', vai_tro: 'LANH_DAO', is_active: true },
      { id: '3', ten_dang_nhap: 'canbo2', ho_va_ten: 'Trần Thị Bình', vai_tro: 'CAN_BO', is_active: false },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: '1',
      fullName: 'Nguyễn Văn An',
      username: 'canbo1',
    });
  });
});

describe('getSelectableReceptionOfficers', () => {
  test('hides officers assigned to other counters but keeps the current selection', () => {
    const officers = [{ id: '1' }, { id: '2' }, { id: '3' }];

    const result = getSelectableReceptionOfficers(
      officers,
      { counter1: '1', counter2: '2' },
      '2'
    );

    expect(result.map((officer) => officer.id)).toEqual(['2', '3']);
  });
});
