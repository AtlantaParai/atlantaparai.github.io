declare global {
  interface Window {
    google: any;
  }
}

export class GoogleOAuthService {
  private static CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private static SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
  private static tokenClient: any = null;
  private static accessToken: string | null = null;

  static async initialize() {
    return new Promise<void>((resolve) => {
      if (window.google?.accounts) {
        this.setupTokenClient();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        this.setupTokenClient();
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  private static setupTokenClient() {
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
        }
      },
    });
  }

  static async getAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }

    return new Promise((resolve) => {
      if (!this.tokenClient) {
        resolve(null);
        return;
      }

      const originalCallback = this.tokenClient.callback;
      this.tokenClient.callback = (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          resolve(response.access_token);
        } else {
          resolve(null);
        }
        this.tokenClient.callback = originalCallback;
      };

      this.tokenClient.requestAccessToken();
    });
  }

  static revokeToken() {
    if (this.accessToken) {
      window.google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
    }
  }
}