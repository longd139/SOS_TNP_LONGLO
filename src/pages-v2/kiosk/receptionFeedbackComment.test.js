import {
  addSuggestionToComment,
  removeSuggestionFromComment,
  removeSuggestionsFromComment,
} from './receptionFeedbackComment';

describe('reception feedback comment suggestions', () => {
  it('adds each selected suggestion as a separate line without duplication', () => {
    const first = addSuggestionToComment('', 'Cán bộ nhiệt tình', 2000);
    const second = addSuggestionToComment(first, 'Hướng dẫn rõ ràng', 2000);

    expect(second).toBe('Cán bộ nhiệt tình\nHướng dẫn rõ ràng');
    expect(addSuggestionToComment(second, 'Cán bộ nhiệt tình', 2000)).toBe(second);
  });

  it('removes only the deselected suggestion and preserves citizen text', () => {
    const comment = 'Nội dung người dân tự nhập\nCán bộ nhiệt tình\nHướng dẫn rõ ràng';

    expect(removeSuggestionFromComment(comment, 'Cán bộ nhiệt tình')).toBe(
      'Nội dung người dân tự nhập\nHướng dẫn rõ ràng'
    );
  });

  it('removes old score suggestions when the rating changes', () => {
    const comment = 'Nội dung riêng\nGợi ý 1\nGợi ý 2';

    expect(removeSuggestionsFromComment(comment, ['Gợi ý 1', 'Gợi ý 2'])).toBe(
      'Nội dung riêng'
    );
  });

  it('separates suggestions from the citizen comment before submission', () => {
    const displayedComment = 'Cán bộ nhiệt tình\nNội dung người dân tự nhập';

    expect(removeSuggestionsFromComment(displayedComment, ['Cán bộ nhiệt tình'])).toBe(
      'Nội dung người dân tự nhập'
    );
  });

  it('respects the configured comment length', () => {
    expect(addSuggestionToComment('1234', '5678', 7)).toHaveLength(7);
  });
});
