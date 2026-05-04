export enum LanguageCode {
  DE_DE = 'de-DE',
  EN_US = 'en-US',
  ES_ES = 'es-ES',
  FR_FR = 'fr-FR',
  IT_IT = 'it-IT',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR',
  NL_NL = 'nl-NL',
  PL_PL = 'pl-PL',
  PT_PT = 'pt-PT',
  RU_RU = 'ru-RU',
  ZH_CN = 'zh-CN',
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const PREDEFINED_LANGUAGES: LanguageOption[] = [
  {
    code: LanguageCode.ZH_CN,
    name: '简体中文',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: LanguageCode.EN_US,
    name: '英语',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: LanguageCode.DE_DE,
    name: '德语',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
  },
  {
    code: LanguageCode.FR_FR,
    name: '法语',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
  {
    code: LanguageCode.ES_ES,
    name: '西班牙语',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: LanguageCode.IT_IT,
    name: '意大利语',
    nativeName: 'Italiano',
    flag: '🇮🇹',
  },
  {
    code: LanguageCode.PT_PT,
    name: '葡萄牙语',
    nativeName: 'Português',
    flag: '🇵🇹',
  },
  {
    code: LanguageCode.NL_NL,
    name: '荷兰语',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
  },
  {
    code: LanguageCode.PL_PL,
    name: '波兰语',
    nativeName: 'Polski',
    flag: '🇵🇱',
  },
  {
    code: LanguageCode.RU_RU,
    name: '俄语',
    nativeName: 'Русский',
    flag: '🇷🇺',
  },
  {
    code: LanguageCode.JA_JP,
    name: '日语',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
  {
    code: LanguageCode.KO_KR,
    name: '韩语',
    nativeName: '한국어',
    flag: '🇰🇷',
  },
];

export function getLanguageByCode(code: string): LanguageOption | undefined {
  return PREDEFINED_LANGUAGES.find((lang) => lang.code === code);
}

export function isValidLanguageCode(code: string): boolean {
  return PREDEFINED_LANGUAGES.some((lang) => lang.code === code);
}
