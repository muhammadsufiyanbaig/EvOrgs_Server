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
exports.createContext = createContext;
const db_1 = require("../../Config/db");
const JWT_1 = require("../../Config/auth/JWT");
const Schema_1 = require("../../Schema");
const Schema_2 = require("../../Schema");
const Schema_3 = require("../../Schema"); // Import admins schema
const drizzle_orm_1 = require("drizzle-orm");
function createContext(_a) {
    return __awaiter(this, arguments, void 0, function* ({ req }) {
        var _b;
        // Get token from Authorization header
        const token = ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) || '';
        let user;
        let vendor;
        let Admin; // Add admin to the context
        if (token) {
            try {
                // Verify token and get payload
                const decoded = (0, JWT_1.verifyToken)(token);
                if (decoded && typeof decoded !== 'string') {
                    // Check if this is a user token
                    if (decoded.type === 'user') {
                        const userRecord = yield db_1.db.select()
                            .from(Schema_1.users)
                            .where((0, drizzle_orm_1.eq)(Schema_1.users.id, decoded.userId))
                            .limit(1);
                        if (userRecord.length > 0) {
                            user = userRecord[0];
                        }
                    }
                    // Check if this is a vendor token
                    else if (decoded.type === 'vendor') {
                        const vendorRecord = yield db_1.db.select()
                            .from(Schema_2.vendors)
                            .where((0, drizzle_orm_1.eq)(Schema_2.vendors.id, decoded.userId))
                            .limit(1);
                        if (vendorRecord.length > 0) {
                            vendor = vendorRecord[0];
                        }
                    }
                    // Check if this is an admin token
                    else if (decoded.type === 'admin') {
                        const adminRecord = yield db_1.db.select()
                            .from(Schema_3.admin)
                            .where((0, drizzle_orm_1.eq)(Schema_3.admin.id, decoded.userId))
                            .limit(1);
                        if (adminRecord.length > 0) {
                            Admin = adminRecord[0];
                        }
                    }
                }
            }
            catch (error) {
                // Token invalid or expired
                console.error('Invalid token:', error);
            }
        }
        return { user, vendor, Admin, db: db_1.db }; // Include admin in the returned context
    });
}
