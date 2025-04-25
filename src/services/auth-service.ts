/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { User, UserManager } from 'oidc-client-ts';
import { authConfig } from '@/config/auth-config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Token } from '@/enum/storage';

class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor() {
    this.userManager = new UserManager(authConfig);
  }

  public async getUser(): Promise<User | null> {
    if (this.user && !this.user.expired) {
      return this.user;
    }

    try {
      this.user = await this.userManager.getUser();
      return this.user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  public async login(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // New method for direct login without redirection
  public async directLogin(email: string, password: string): Promise<any> {
    try {
      const tokenEndpoint = `${authConfig.authority}/connect/token`;
      
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('client_id', authConfig.client_id!);
      if (authConfig.client_secret) {
        params.append('client_secret', authConfig.client_secret);
      }
      params.append('username', email);
      params.append('password', password);
      params.append('scope', authConfig.scope!);
      
      const response = await axios.post(tokenEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Process the received token
      if (response.data.access_token) {
        // Create a user object similar to what you'd get from OIDC
        // This is a simplified version
        const tokenData = response.data;
        
        // You might need to fetch user info separately
        return tokenData;
      }
      
      throw new Error('Failed to get access token');
    } catch (error) {
      console.error('Direct login failed:', error);
      throw error;
    }
  }

  public async completeLogin(): Promise<User> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Complete login failed:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public async completeLogout(): Promise<void> {
    try {
      await this.userManager.signoutRedirectCallback();
      this.user = null;
    } catch (error) {
      console.error('Complete logout failed:', error);
      throw error;
    }
  }

  public async getAccessToken(): Promise<string | null> {
    try {
      const user = await this.getUser();
      return user?.access_token || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    // Kiểm tra từ OIDC User Manager
    const user = await this.getUser();
    
    // Nếu có user từ OIDC và chưa hết hạn
    if (user && !user.expired) {
      return true;
    }
    
    // Nếu không có user từ OIDC, kiểm tra JWT token trong cookies
    const jwtToken = Cookies.get(Token.JWT_TOKEN);
    return !!jwtToken;
  }
}

const authService = new AuthService();
export default authService;