/**
 * Shared password validation for the forgot-password reset screen
 * (NewPasswordScreen) and the in-app change password screen (ChangePassword).
 *
 * Extracted as pure functions so the rules are unit-testable without a
 * device. Regression: NewPasswordScreen previously compared the confirm
 * string directly (`confirmPassword >= 6`), which is always false for
 * non-numeric strings, so every valid password was rejected.
 */

export const PASSWORD_MIN_LENGTH = 6;

export const PASSWORD_EMPTY_MESSAGE = 'Please enter a valid password';
export const PASSWORD_TOO_SHORT_MESSAGE = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
export const PASSWORD_MISMATCH_MESSAGE =
  "Password & Confirm Password doesn't match";
export const PASSWORD_REUSE_MESSAGE =
  'Your new password must be different from previous password';

const isLongEnough = value =>
  typeof value === 'string' && value.length >= PASSWORD_MIN_LENGTH;

/**
 * Validates the forgot-password reset form.
 * Returns an error message string, or null when valid.
 */
export const validateNewPassword = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return PASSWORD_EMPTY_MESSAGE;
  }
  if (!isLongEnough(password) || !isLongEnough(confirmPassword)) {
    return PASSWORD_TOO_SHORT_MESSAGE;
  }
  if (password !== confirmPassword) {
    return PASSWORD_MISMATCH_MESSAGE;
  }
  return null;
};

/**
 * Validates the in-app change password form.
 * Returns an error message string, or null when valid.
 */
export const validateChangePassword = (
  oldPassword,
  password,
  confirmPassword,
) => {
  if (!oldPassword || !password || !confirmPassword) {
    return PASSWORD_EMPTY_MESSAGE;
  }
  if (
    !isLongEnough(oldPassword) ||
    !isLongEnough(password) ||
    !isLongEnough(confirmPassword)
  ) {
    return PASSWORD_TOO_SHORT_MESSAGE;
  }
  if (password !== confirmPassword) {
    return PASSWORD_MISMATCH_MESSAGE;
  }
  if (password === oldPassword) {
    return PASSWORD_REUSE_MESSAGE;
  }
  return null;
};
