import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReceptionKiosk from './ReceptionKiosk';
import RECEPTION_API from '../../apis/reception';

jest.mock('../../apis/reception', () => ({
  __esModule: true,
  default: {
    getRatingConfiguration: jest.fn(),
    lookupRegistrationForRating: jest.fn(),
    createRating: jest.fn(),
  },
}));

describe('ReceptionKiosk suggestion interaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RECEPTION_API.getRatingConfiguration.mockResolvedValue({
      commentMaxLength: 2000,
      suggestionsByScore: {
        4: [
          'Cán bộ nhiệt tình và tôn trọng',
          'Hướng dẫn rõ ràng, dễ hiểu',
        ],
      },
    });
    RECEPTION_API.lookupRegistrationForRating.mockResolvedValue({
      registrationId: 'registration-1',
      receptionCode: 'TD-0001',
      applicant: { fullName: 'Nguyễn Văn A', phoneNumber: '0900000000' },
      topic: 'Hướng dẫn thủ tục',
      receptionDate: '2026-08-21',
      timeSlot: '15:30 - 16:30',
    });
  });

  it('adds a selected suggestion to the textarea and removes it on the second click', async () => {
    render(<ReceptionKiosk />);

    fireEvent.change(screen.getByPlaceholderText('VD: PA-1001'), {
      target: { value: 'TD-0001' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tra cứu hồ sơ' }));

    await screen.findByText('Hồ sơ hợp lệ');
    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục/i }));
    fireEvent.click(screen.getByRole('button', { name: '4 trên 5 sao' }));
    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục/i }));

    const suggestion = await screen.findByRole('button', {
      name: 'Cán bộ nhiệt tình và tôn trọng',
    });
    const textarea = screen.getByPlaceholderText(
      'Chia sẻ điều bạn muốn chúng tôi cải thiện...'
    );

    fireEvent.click(suggestion);
    expect(textarea).toHaveValue('Cán bộ nhiệt tình và tôn trọng');
    expect(suggestion).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(suggestion);
    await waitFor(() => {
      expect(textarea).toHaveValue('');
      expect(suggestion).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
