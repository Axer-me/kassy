import { isSfaTheme } from '../../config/theme';
import { LayoutDefault } from './LayoutDefault';
import { LayoutSfa } from './LayoutSfa';

export function Layout() {
  return isSfaTheme() ? <LayoutSfa /> : <LayoutDefault />;
}
