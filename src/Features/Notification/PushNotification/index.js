"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmService = exports.FCMService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
// Service account configuration (same as before, used for OAuth2)
const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    token_uri: process.env.FIREBASE_TOKEN_URI,
};
class FCMService {
    constructor() {
        this.projectId = serviceAccount.project_id || '';
        this.tokenUri = serviceAccount.token_uri || '';
        this.clientEmail = serviceAccount.client_email || '';
        this.privateKey = serviceAccount.private_key || '';
        this.accessToken = null;
        this.tokenExpiration = 0;
    }
    /**
     * Get OAuth2 access token
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const { createSign } = yield Promise.resolve().then(() => __importStar(require('crypto')));
                const sign = createSign('RSA-SHA256');
                sign.write(`${jwtHeader}.${jwtPayload}`);
                sign.end();
                const signature = sign.sign(this.privateKey, 'base64');
                const jwt = `${jwtHeader}.${jwtPayload}.${signature}`;
                const response = yield (0, node_fetch_1.default)(this.tokenUri, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
                });
                const data = yield response.json();
                this.accessToken = data.access_token;
                this.tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety
                return this.accessToken;
            }
            catch (error) {
                throw new Error(`Failed to get access token: ${error.message}`);
            }
        });
    }
    /**
     * Send notification to single device
     */
    sendToDevice(token, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const message = {
                    message: {
                        token,
                        notification: payload.notification,
                        data: payload.data,
                        android: payload.android,
                        apns: payload.apns
                    }
                };
                const response = yield (0, node_fetch_1.default)(`https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${yield response.text()}`);
                }
                return {
                    success: true,
                    message: 'Notification sent successfully',
                    successCount: 1,
                    failureCount: 0
                };
            }
            catch (error) {
                console.error('FCM Error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send notification',
                    failedTokens: [token],
                    successCount: 0,
                    failureCount: 1
                };
            }
        });
    }
    /**
     * Send notification to multiple devices
     */
    sendToMultipleDevices(tokens, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tokens || tokens.length === 0) {
                return {
                    success: false,
                    message: 'No tokens provided',
                    successCount: 0,
                    failureCount: 0
                };
            }
            const results = {
                success: false,
                message: '',
                failedTokens: [],
                successCount: 0,
                failureCount: 0
            };
            try {
                for (const token of tokens) {
                    const result = yield this.sendToDevice(token, payload);
                    if (result.success) {
                        results.successCount = (results.successCount || 0) + 1;
                    }
                    else {
                        results.failedTokens.push(token);
                        results.failureCount = (results.failureCount || 0) + 1;
                    }
                }
                results.success = (results.successCount || 0) > 0;
                results.message = `Sent to ${results.successCount}/${tokens.length} devices`;
                return results;
            }
            catch (error) {
                console.error('FCM Multicast Error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send notifications',
                    failedTokens: tokens,
                    successCount: 0,
                    failureCount: tokens.length
                };
            }
        });
    }
    /**
     * Send notification to topic
     */
    sendToTopic(topic, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const message = {
                    message: {
                        topic,
                        notification: payload.notification,
                        data: payload.data,
                        android: payload.android,
                        apns: payload.apns
                    }
                };
                const response = yield (0, node_fetch_1.default)(`https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${yield response.text()}`);
                }
                return {
                    success: true,
                    message: 'Topic notification sent successfully',
                    successCount: 1,
                    failureCount: 0
                };
            }
            catch (error) {
                console.error('FCM Topic Error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send topic notification',
                    successCount: 0,
                    failureCount: 1
                };
            }
        });
    }
    /**
     * Subscribe device to topic
     */
    subscribeToTopic(tokens, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const response = yield (0, node_fetch_1.default)(`https://iid.googleapis.com/iid/v1:batchAdd`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: `/topics/${topic}`,
                        registration_tokens: tokens
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${yield response.text()}`);
                }
                const data = yield response.json();
                const failedTokens = tokens.filter((_, index) => { var _a; return (_a = data.results[index]) === null || _a === void 0 ? void 0 : _a.error; });
                return {
                    success: failedTokens.length < tokens.length,
                    message: `Subscribed ${tokens.length - failedTokens.length}/${tokens.length} devices to ${topic}`,
                    successCount: tokens.length - failedTokens.length,
                    failureCount: failedTokens.length
                };
            }
            catch (error) {
                console.error('FCM Subscribe Error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to subscribe to topic',
                    successCount: 0,
                    failureCount: tokens.length
                };
            }
        });
    }
    /**
     * Unsubscribe device from topic
     */
    unsubscribeFromTopic(tokens, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const response = yield (0, node_fetch_1.default)(`https://iid.googleapis.com/iid/v1:batchRemove`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: `/topics/${topic}`,
                        registration_tokens: tokens
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${yield response.text()}`);
                }
                const data = yield response.json();
                const failedTokens = tokens.filter((_, index) => { var _a; return (_a = data.results[index]) === null || _a === void 0 ? void 0 : _a.error; });
                return {
                    success: failedTokens.length < tokens.length,
                    message: `Unsubscribed ${tokens.length - failedTokens.length}/${tokens.length} devices from ${topic}`,
                    successCount: tokens.length - failedTokens.length,
                    failureCount: failedTokens.length
                };
            }
            catch (error) {
                console.error('FCM Unsubscribe Error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to unsubscribe from topic',
                    successCount: 0,
                    failureCount: tokens.length
                };
            }
        });
    }
    /**
     * Create FCM payload from notification data
     */
    createPayload(title, message, priority = 'medium', data, linkTo) {
        const androidPriority = priority === 'urgent' || priority === 'high' ? 'high' : 'normal';
        return {
            notification: {
                title,
                body: message
            },
            data: Object.assign(Object.assign({}, data), { linkTo: linkTo || '', priority, timestamp: new Date().toISOString() }),
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
exports.FCMService = FCMService;
exports.fcmService = new FCMService();
