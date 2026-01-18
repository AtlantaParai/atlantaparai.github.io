declare global {
  interface Window {
    google: any;
  }
}

export class MemberSignInService {
  private static CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private static user: any = null;
  private static tokenClient: any = null;

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
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets openid email profile',
      callback: (response: any) => {
        if (response.access_token) {
          // Store the access token for Sheets access
          localStorage.setItem('google_access_token', response.access_token);
          localStorage.setItem('google_sheets_token', response.access_token);
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
      
      // Check if user is a valid member
      const { adults2025 } = await import('@/data/2025Adults');
      const { kidsTeens2025 } = await import('@/data/2025KidsTeens');
      const { coreAdults } = await import('@/data/CoreAdults');
      const { coreTeensKids } = await import('@/data/CoreTeensKids');
      
      const allMembers = [
        ...adults2025,
        ...kidsTeens2025,
        ...coreAdults,
        ...coreTeensKids
      ];
      
      if (!allMembers.includes(userInfo.name)) {
        alert('Access denied. You are not a registered member.');
        return;
      }
      
      this.user = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        userType: 'member'
      };
      
      localStorage.setItem('google_user', JSON.stringify(this.user));
      
      setTimeout(() => {
        window.location.href = '/member-info';
      }, 500);
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  }

  static async signIn() {
    if (!window.google?.accounts) {
      await this.initialize();
    }
    
    if (!this.CLIENT_ID) {
      alert('Google Client ID not configured.');
      return;
    }
    
    if (!this.tokenClient) {
      alert('Authentication system not ready. Please refresh and try again.');
      return;
    }
    
    this.tokenClient.requestAccessToken();
  }
}