import fetch from 'node-fetch';
import { FCMPayload, FCMResponse, NotificationPriority } from '../Types';

// Service account configuration (same as before, used for OAuth2)
const serviceAccount = {
  project_id: "evorgs",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQUW3YTHSbczH2\nGZqkORUfuumV+cxJTonBjdu9jV8wktC6+0b3rMwvXElo01SKPhEyjjMUqQ3krq0G\nLHxWJCvw0FT42ffC3FqjqCMqUoS3hTp3XNdNhfu42mkQsjy4PfJI6ic7CpCkwlra\n7cvnNSlQ0TyEr9v2ITTbCjtOvI0kwtIVxsN6ZVByfxikiqW79Y71be40MMLpEKXz\nhiQIE2Ovb0M+WxeBZ4U90SdR+2BrW2TGTzDZlRFxwa6Smrj9hNrUDmcZm4CstCaB\nBHJ1EjRM4H+rSRZWHwE9tFW1EmumUAV3pLISidEMr1GC0BKRzTl2EeO1DbgTEHaJ\ncnRLOzepAgMBAAECggEAClq5zIIEW8OujI56PsZtk92tBZzceBpUw4+jB/lybU4m\n3NxniyEGJyZ9qZ2zeomaPjqONG0wuRirlf55EakLnBUm3BWteHyObssJMG3Yleyj\n2tH9C6fouqf0h/VsCjZeCBzHZWphhSb58B7Yvz3Ht3InAWtiUgoVf/uytfeuRlDn\nvj41CgNJc21wFTD6IyHNczpibBscUJRAqN/OyFOeEhan3U3221kcvjp2N1CZjery\n0PdoMUtng94Uk5G35D+TIGB5H/9nl1T3gBsAMpBgRHWzzrJax54C8jOpNQCBDmAG\nwQjJZyxcoAwnnl2/rsS1RmAELUpuiIXSbWuZx7l+wQKBgQDoE72UAvRQZVE0SwLI\n45oz2TOTbYYmeFtuSAKpu66MUkrojqRUz84nMyIi0kIZInwKAnVnEZ9EN31tm0Sr\ngad1gI4pY6r8qkZBprbK1JgFxTvChEAswKfMg+liXshJ419EPXYzDdYAfooMsrm5\nIlL2lR7loEmzA39zA7mfWb/r8QKBgQDlyrbDjFH1+bK+ddFRB1ttk3Vw3ChboTD5\nfztcbKl+77DLYm+qRIWESYmxVMo5c6nRXF9L6CJgPoC7RsPr7fAR/M+JPGaqYY4q\n3m3aHU7usKszjZRKNbkEsRmz52Kvn0FMFlekT7umZmW8sm5JDG0YKN+d031sIeOI\n8g2cxEWfOQKBgHtTEij3MPEQBgjt23r5R9ZJk5jCWMlUp/GAnrmnnGfAy0GtmzHe\ng8Rc7cTnSmyk4JlJGS4+NQ5BFowKOIGTEnPkbqcb6Z7+tPrqJrS+KFLYrpr9QEUH\n06NgbcLybyikhNl0d71FmvUESUPaLcttq/yQ3axUcxWHxFBQKHG/dbdhAoGBALED\n4Jhw3q5iZNwtPEp0JW0au8xt/DThzi1UYrEHD+a10/ZI5QY/9K58S7KsQ3/QZs/d\nnZeGwfxsCZS6pbB4QYhJvMHWIqw7rF2/rNXp3+UleSykcshb7CP+HXOl2jK5tn5b\nc7YiqcY8eUDMHwLsrJmA2wnkYmjLDlFvTScnVw6ZAoGAFaMbhVz+ZMsCN8+ZUAsZ\nQa96mN6a5kOIgGiWyZ+2oCQboGm66tWhTPLnX+u1G+f4Jy9yg8vPKrq50JlS3ZKI\nkp7WTGDE7MnoOOBj2HcRSp+Emc5mX5v9xo5oK0ReV1wvx4IwGkM9GsE9NN/EfCpD\nYFk1awO4bVyaxouACNzPI0k=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@evorgs.iam.gserviceaccount.com",
  token_uri: "https://oauth2.googleapis.com/token"
};

export class FCMService {
  private projectId: string = serviceAccount.project_id;
  private tokenUri: string = serviceAccount.token_uri;
  private clientEmail: string = serviceAccount.client_email;
  private privateKey: string = serviceAccount.private_key;
  private accessToken: string | null = null;
  private tokenExpiration: number = 0;

  constructor() {}

  /**
   * Get OAuth2 access token
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiration > Date.now()) {
      return this.accessToken;
    }

    try {
      const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64');
      const jwtPayload = Buffer.from(JSON.stringify({
        iss: this.clientEmail,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: this.tokenUri,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      })).toString('base64');

      const { createSign } = await import('crypto');
      const sign = createSign('RSA-SHA256');
      sign.write(`${jwtHeader}.${jwtPayload}`);
      sign.end();
      const signature = sign.sign(this.privateKey, 'base64');
      const jwt = `${jwtHeader}.${jwtPayload}.${signature}`;

      const response = await fetch(this.tokenUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      const data = await response.json() as { access_token: string, expires_in: number };
      this.accessToken = data.access_token;
      this.tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety
      return this.accessToken;
    } catch (error: any) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  /**
   * Send notification to single device
   */
  async sendToDevice(token: string, payload: FCMPayload): Promise<FCMResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const message = {
        message: {
          token,
          notification: payload.notification,
          data: payload.data,
          android: payload.android,
          apns: payload.apns
        }
      };

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return {
        success: true,
        message: 'Notification sent successfully',
        successCount: 1,
        failureCount: 0
      };
    } catch (error: any) {
      console.error('FCM Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send notification',
        failedTokens: [token],
        successCount: 0,
        failureCount: 1
      };
    }
  }

  /**
   * Send notification to multiple devices
   */
  async sendToMultipleDevices(tokens: string[], payload: FCMPayload): Promise<FCMResponse> {
    if (!tokens || tokens.length === 0) {
      return {
        success: false,
        message: 'No tokens provided',
        successCount: 0,
        failureCount: 0
      };
    }

    const results: FCMResponse = {
      success: false,
      message: '',
      failedTokens: [],
      successCount: 0,
      failureCount: 0
    };

    try {
      for (const token of tokens) {
        const result = await this.sendToDevice(token, payload);
        if (result.success) {
          results.successCount = (results.successCount || 0) + 1;
        } else {
          results.failedTokens!.push(token);
          results.failureCount = (results.failureCount || 0) + 1;
        }
      }

      results.success = (results.successCount || 0) > 0;
      results.message = `Sent to ${results.successCount}/${tokens.length} devices`;
      return results;
    } catch (error: any) {
      console.error('FCM Multicast Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send notifications',
        failedTokens: tokens,
        successCount: 0,
        failureCount: tokens.length
      };
    }
  }

  /**
   * Send notification to topic
   */
  async sendToTopic(topic: string, payload: FCMPayload): Promise<FCMResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const message = {
        message: {
          topic,
          notification: payload.notification,
          data: payload.data,
          android: payload.android,
          apns: payload.apns
        }
      };

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return {
        success: true,
        message: 'Topic notification sent successfully',
        successCount: 1,
        failureCount: 0
      };
    } catch (error: any) {
      console.error('FCM Topic Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send topic notification',
        successCount: 0,
        failureCount: 1
      };
    }
  }

  /**
   * Subscribe device to topic
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<FCMResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://iid.googleapis.com/iid/v1:batchAdd`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: `/topics/${topic}`,
            registration_tokens: tokens
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json() as { results: Array<{ error?: any }>, failureCount?: number };
      const failedTokens = tokens.filter((_, index) => data.results[index]?.error);

      return {
        success: failedTokens.length < tokens.length,
        message: `Subscribed ${tokens.length - failedTokens.length}/${tokens.length} devices to ${topic}`,
        successCount: tokens.length - failedTokens.length,
        failureCount: failedTokens.length
      };
    } catch (error: any) {
      console.error('FCM Subscribe Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to subscribe to topic',
        successCount: 0,
        failureCount: tokens.length
      };
    }
  }

  /**
   * Unsubscribe device from topic
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<FCMResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://iid.googleapis.com/iid/v1:batchRemove`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: `/topics/${topic}`,
            registration_tokens: tokens
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json() as { results: Array<{ error?: any }>, failureCount?: number };
      const failedTokens = tokens.filter((_, index) => data.results[index]?.error);

      return {
        success: failedTokens.length < tokens.length,
        message: `Unsubscribed ${tokens.length - failedTokens.length}/${tokens.length} devices from ${topic}`,
        successCount: tokens.length - failedTokens.length,
        failureCount: failedTokens.length
      };
    } catch (error: any) {
      console.error('FCM Unsubscribe Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to unsubscribe from topic',
        successCount: 0,
        failureCount: tokens.length
      };
    }
  }

  /**
   * Create FCM payload from notification data
   */
  createPayload(
    title: string,
    message: string,
    priority: NotificationPriority = 'medium',
    data?: any,
    linkTo?: string
  ): FCMPayload {
    const androidPriority = priority === 'urgent' || priority === 'high' ? 'high' : 'normal';
    
    return {
      notification: {
        title,
        body: message
      },
      data: {
        ...data,
        linkTo: linkTo || '',
        priority,
        timestamp: new Date().toISOString()
      },
      android: {
        priority: androidPriority,
        notification: {
          sound: 'default',
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };
  }
}

export const fcmService = new FCMService();