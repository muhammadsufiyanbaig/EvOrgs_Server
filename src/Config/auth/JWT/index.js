"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
// src/auth/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || '$Uf!y@n3';
const JWT_EXPIRES_IN = '7d';
function generateToken(user) {
    const payload = {
        userId: user.id,
        email: 'vendorEmail' in user ? user.vendorEmail : user.email,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return Object.assign({ type: 'user' }, decoded);
    }
    catch (error) {
        return null;
    }
}
