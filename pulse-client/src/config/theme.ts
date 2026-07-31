/**
 * Переключатель темы интерфейса.
 *
 * 'default' — исходный standalone-дизайн (тёмный хедер, карточки).
 * 'sfa'     — стилистика встраивания в SFA (как на референсе).
 *
 * Чтобы откатить: смените значение на 'default' и перезапустите dev-сервер.
 */
export type AppTheme = 'default' | 'sfa';

export const APP_THEME: AppTheme = 'sfa';

export const isSfaTheme = (): boolean => APP_THEME === 'sfa';
