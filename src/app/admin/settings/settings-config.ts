import {
  SettingKey,
  SettingType,
  SETTING_DEFINITIONS,
} from '@kylliangautier/authora-types';
import type { SettingMeta } from '@kylliangautier/authora-types';

export { SettingKey, SettingType, SETTING_DEFINITIONS };
export type { SettingMeta };

export interface SettingCategory {
  path: string;
  labelKey: string;
  keys: SettingKey[];
}

export const SETTING_CATEGORIES: SettingCategory[] = [
  {
    path: 'authentication',
    labelKey: 'settings.categories.authentication',
    keys: [
      SettingKey.AuthAccessTokenTtlSec,
      SettingKey.AuthRefreshTokenShortTtlSec,
      SettingKey.AuthRefreshTokenLongTtlSec,
      SettingKey.AuthMagicLinkTokenTtlSec,
      SettingKey.AuthMagicLinkRefreshTokenTtlSec,
    ],
  },
  {
    path: 'password',
    labelKey: 'settings.categories.password',
    keys: [
      SettingKey.PasswordMinLength,
      SettingKey.PasswordRequireDigit,
      SettingKey.PasswordRequireSpecialChar,
      SettingKey.PasswordRequireLowercase,
      SettingKey.PasswordRequireUppercase,
      SettingKey.PasswordForbidSequentialChars,
      SettingKey.PasswordForbidRepeatedChars,
      SettingKey.PasswordForbidKeyboardSequence,
      SettingKey.PasswordForbidUserInfo,
      SettingKey.PasswordForbidCommonPassword,
      SettingKey.PasswordForgotTokenTtlSec,
    ],
  },
  {
    path: 'account',
    labelKey: 'settings.categories.account',
    keys: [
      SettingKey.AccountEmailVerificationTokenTtlSec,
      SettingKey.AccountDeletionTokenTtlSec,
    ],
  },
  {
    path: 'mfa',
    labelKey: 'settings.categories.mfa',
    keys: [
      SettingKey.MfaVerifyTokenTtlSec,
      SettingKey.MfaValidateTokenTtlSec,
      SettingKey.MfaDisablingTokenTtlSec,
    ],
  },
  {
    path: 'security',
    labelKey: 'settings.categories.security',
    keys: [
      SettingKey.SecurityHashMemoryCost,
      SettingKey.SecurityHashTimeCost,
      SettingKey.SecurityHashParallelism,
      SettingKey.SecurityThrottleTtlSec,
      SettingKey.SecurityThrottleOriginLimit,
      SettingKey.SecurityThrottleIdentityLimit,
      SettingKey.SecurityThrottleCombinedLimit,
      SettingKey.SecurityEndpointDelayMinMs,
      SettingKey.SecurityEndpointDelayMaxMs,
    ],
  },
];
