const normalizeReason = (reason) => String(reason || '').trim();

export const addSuggestionToComment = (comment, reason, maxLength = 2000) => {
  const currentComment = String(comment || '');
  const suggestion = normalizeReason(reason);
  if (!suggestion) return currentComment;

  const alreadyIncluded = currentComment
    .split(/\r?\n/)
    .some((line) => line.trim() === suggestion);
  if (alreadyIncluded) return currentComment;

  const separator = currentComment && !currentComment.endsWith('\n') ? '\n' : '';
  return `${currentComment}${separator}${suggestion}`.slice(0, maxLength);
};

export const removeSuggestionFromComment = (comment, reason) => {
  const suggestion = normalizeReason(reason);
  if (!suggestion) return String(comment || '');

  return String(comment || '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== suggestion)
    .join('\n')
    .replace(/^\n+|\n+$/g, '');
};

export const removeSuggestionsFromComment = (comment, reasons) =>
  (reasons || []).reduce(
    (currentComment, reason) => removeSuggestionFromComment(currentComment, reason),
    String(comment || '')
  );
