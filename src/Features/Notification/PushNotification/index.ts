import fetch from 'node-fetch';
import { FCMPayload, FCMResponse, NotificationPriority } from '../Types';

// Service account configuration (same as before, used for OAuth2)
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  token_uri: process.env.FIREBASE_TOKEN_URI,
};


export class FCMService {
  private projectId: string = serviceAccount.project_id || '';
  private tokenUri: string = serviceAccount.token_uri || '';
  private clientEmail: string = serviceAccount.client_email || '';
  private privateKey: string = serviceAccount.private_key || '';
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