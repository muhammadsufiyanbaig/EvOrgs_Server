"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const JWT_1 = require("../../Config/auth/JWT");
const db_1 = require("../../Config/db"); // Import your Drizzle DB connection
const Schema_1 = require("../../Schema");
const drizzle_orm_1 = require("drizzle-orm");
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                const decoded = (0, JWT_1.verifyToken)(token);
                if (decoded) {
                    const user = yield db_1.db.select().from(Schema_1.users).where((0, drizzle_orm_1.eq)(Schema_1.users.id, decoded.userId)).limit(1);
                    if (user && user.length > 0) {
                        req.user = user[0];
                    }
                }
            }
            next();
        }
        catch (error) {
            next();
        }
    });
}
