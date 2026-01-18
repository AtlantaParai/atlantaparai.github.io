declare global {
  interface Window {
    google: any;
  }
}

export class GoogleSignInService {
  private static CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private static SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
  private static user: any = null;
  private static tokenClient: any = null;
  private static accessToken: string | null = null;
  private static isProcessingSignIn: boolean = false;

  static async initialize() {
    return new Promise<void>((resolve) => {
      if (window.google?.accounts) {
        this.setupSignIn();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        this.setupSignIn();
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  private static setupSignIn() {
    // Setup OAuth token client for Sheets access (includes user info)
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES + ' openid email profile',
      callback: (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          localStorage.setItem('google_access_token', response.access_token);
          localStorage.setItem('google_sheets_token', response.access_token);
          
          // Get user info from the access token
          this.getUserInfo(response.access_token);
        }
      },
    });
  }

  private static async getUserInfo(accessToken: string) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const userInfo = await response.json();
      
      // Check if user is authorized
      const { isUserAuthorized } = await import('./auth');
      if (!isUserAuthorized(userInfo.email)) {
        alert('Access denied. You are not authorized to use this system.');
        this.signOut();
        return;
      }
      
      this.user = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
      
      localStorage.setItem('google_user', JSON.stringify(this.user));
      
      // Trigger a page reload to update AuthContext
      window.location.reload();
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  }

  static async signIn() {
    console.log('SignIn called');
    
    if (!window.google?.accounts) {
      console.log('Google accounts not available, initializing...');
      await this.initialize();
    }
    
    if (!this.CLIENT_ID) {
      alert('Google Client ID not configured. Please check environment variables.');
      return;
    }
    
    // Check if running in standalone mode (iOS web app)
    const isStandalone = (navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
    
    if (isStandalone) {
      alert('Please open this website in Safari browser to sign in. OAuth authentication is not supported in standalone mode.');
      return;
    }
    
    console.log('Requesting access token...');
    
    // Check if tokenClient is available
    if (!this.tokenClient) {
      console.error('Token client not initialized');
      alert('Authentication system not ready. Please refresh the page and try again.');
      return;
    }
    
    // Use OAuth flow directly to get both user info and Sheets access
    this.tokenClient.requestAccessToken();
  }

  static signOut() {
    this.user = null;
    this.accessToken = null;
    localStorage.removeItem('google_user');
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_sheets_token');
    window.google?.accounts.id.disableAutoSelect();
    
    // Use the correct base path for GitHub Pages
    window.location.href = '/';
  }

  static getCurrentUser() {
    if (this.user) return this.user;
    
    const stored = localStorage.getItem('google_user');
    if (stored) {
      this.user = JSON.parse(stored);
      return this.user;
    }
    
    return null;
  }

  static getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    
    // Try multiple storage keys
    const stored = localStorage.getItem('google_access_token') || localStorage.getItem('google_sheets_token');
    if (stored) {
      this.accessToken = stored;
      return stored;
    }
    
    return null;
  }
}