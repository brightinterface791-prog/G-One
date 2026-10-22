// Backwards-compatible facade: LoginPage and existing callers need no UI changes.
import { authService } from '../features/auth';

export const login = authService.login.bind(authService);
export const logout = authService.logout.bind(authService);
