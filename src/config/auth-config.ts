import { UserManagerSettings } from 'oidc-client-ts';

// Cấu hình kết nối với Duende Identity Server
export const authConfig: UserManagerSettings = {
  authority: import.meta.env.VITE_IDENTITY_SERVER_URL || "https://localhost:5001",
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: `${window.location.origin}/signin-callback`,
  post_logout_redirect_uri: `${window.location.origin}/signout-callback`,
  response_type: "code",
  scope: "openid profile api",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  silentRequestTimeoutInSeconds: 10000,
  client_secret: import.meta.env.VITE_CLIENT_SECRET
};