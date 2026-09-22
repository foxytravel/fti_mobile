/**
 * Unit tests for the shared password validation used by NewPasswordScreen
 * (forgot-password reset) and ChangePassword (in-app drawer screen).
 *
 * Regression covered here: NewPasswordScreen used to evaluate
 * `confirmPassword >= 6` (string vs number) instead of
 * `confirmPassword.length >= 6`. Non-numeric strings coerce to NaN, so the
 * check was always false and every valid password was rejected with
 * "Password Must of atlease 6 Characters" — the exact user bug report.
 * @format
 */

import {
  PASSWORD_EMPTY_MESSAGE,
  PASSWORD_MISMATCH_MESSAGE,
  PASSWORD_REUSE_MESSAGE,
  PASSWORD_TOO_SHORT_MESSAGE,
  validateChangePassword,
  validateNewPassword,
} from '../Screens/Auth/passwordValidation';

describe('validateNewPassword', () => {
  it('accepts the valid 8-character password from the bug report', () => {
    // "Fticoach" / "Fticoach" was rejected before the fix.
    expect(validateNewPassword('Fticoach', 'Fticoach')).toBeNull();
  });

  it('accepts a password of exactly the minimum length', () => {
    expect(validateNewPassword('abcdef', 'abcdef')).toBeNull();
  });

  it('accepts a purely numeric password of sufficient length', () => {
    expect(validateNewPassword('123456', '123456')).toBeNull();
  });

  it('rejects empty fields', () => {
    expect(validateNewPassword('', '')).toBe(PASSWORD_EMPTY_MESSAGE);
    expect(validateNewPassword('Fticoach', '')).toBe(PASSWORD_EMPTY_MESSAGE);
    expect(validateNewPassword('', 'Fticoach')).toBe(PASSWORD_EMPTY_MESSAGE);
  });

  it('rejects a short new password', () => {
    expect(validateNewPassword('Ftic', 'Ftic')).toBe(
      PASSWORD_TOO_SHORT_MESSAGE,
    );
  });

  it('rejects a short confirmation even when the password is valid', () => {
    // This is the exact comparison that was broken: the confirm value.
    expect(validateNewPassword('Fticoach', 'Fti')).toBe(
      PASSWORD_TOO_SHORT_MESSAGE,
    );
  });

  it('rejects a short numeric string (old code let "7" through by coercion)', () => {
    expect(validateNewPassword('7', '7')).toBe(PASSWORD_TOO_SHORT_MESSAGE);
  });

  it('rejects mismatched passwords', () => {
    expect(validateNewPassword('Fticoach', 'Fticoach2')).toBe(
      PASSWORD_MISMATCH_MESSAGE,
    );
  });
});

describe('validateChangePassword', () => {
    it('accepts a valid change', () => {
    expect(
      validateChangePassword('Oldpass1', 'Newpass1', 'Newpass1'),
    ).toBeNull();
  });

  it('rejects empty fields', () => {
    expect(validateChangePassword('', 'Newpass1', 'Newpass1')).toBe(
      PASSWORD_EMPTY_MESSAGE,
    );
    expect(validateChangePassword('Oldpass1', '', 'Newpass1')).toBe(
      PASSWORD_EMPTY_MESSAGE,
    );
    expect(validateChangePassword('Oldpass1', 'Newpass1', '')).toBe(
      PASSWORD_EMPTY_MESSAGE,
    );
  });

  it('rejects when any field is too short', () => {
    expect(validateChangePassword('Old', 'Newpass1', 'Newpass1')).toBe(
      PASSWORD_TOO_SHORT_MESSAGE,
    );
    expect(validateChangePassword('Oldpass1', 'New', 'New')).toBe(
      PASSWORD_TOO_SHORT_MESSAGE,
    );
    expect(validateChangePassword('Oldpass1', 'Newpass1', 'New')).toBe(
      PASSWORD_TOO_SHORT_MESSAGE,
    );
  });

  it('rejects mismatched new passwords', () => {
    expect(validateChangePassword('Oldpass1', 'Newpass1', 'Newpass2')).toBe(
      PASSWORD_MISMATCH_MESSAGE,
    );
  });

  it('rejects reusing the old password', () => {
    expect(validateChangePassword('Samepass', 'Samepass', 'Samepass')).toBe(
      PASSWORD_REUSE_MESSAGE,
    );
  });
});
