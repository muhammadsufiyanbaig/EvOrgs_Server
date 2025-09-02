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
exports.UserModel = void 0;
// utils/models/UserModel.ts
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const Schema_1 = require("../../../../Schema");
// UserModel class to handle user-related database operations
class UserModel {
    constructor(db) {
        this.db = db;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.email, email))
                .limit(1);
            return result.length > 0 ? result[0] : null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, id))
                .limit(1);
            return result.length > 0 ? result[0] : null;
        });
    }
    emailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select({ id: Schema_1.users.id })
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.email, email))
                .limit(1);
            return result.length > 0;
        });
    }
    create(input, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, uuid_1.v4)();
            const dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;
            const newUser = {
                id: userId,
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                phone: input.phone || null,
                address: input.address || null,
                fcmToken: [],
                passwordHash,
                profileImage: input.profileImage || null,
                dateOfBirth,
                gender: input.gender,
                createdAt: new Date(),
                isVerified: false,
            };
            yield this.db.insert(Schema_1.users).values(newUser);
            return userId;
        });
    }
    setVerified(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.users)
                .set({ isVerified: true })
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId));
        });
    }
    updateProfile(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const updateData = {};
            if (input.firstName)
                updateData.firstName = input.firstName;
            if (input.lastName)
                updateData.lastName = input.lastName;
            if (input.phone)
                updateData.phone = input.phone;
            if (input.address)
                updateData.address = input.address;
            if (input.profileImage)
                updateData.profileImage = input.profileImage;
            if (input.dateOfBirth)
                updateData.dateOfBirth = new Date(input.dateOfBirth);
            if (input.gender)
                updateData.gender = input.gender;
            if (input.fcmToken) {
                const currentTokens = user.fcmToken || [];
                if (!currentTokens.includes(input.fcmToken)) {
                    updateData.fcmToken = [...currentTokens, input.fcmToken];
                }
            }
            yield this.db.update(Schema_1.users)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId));
            const updatedUser = yield this.findById(userId);
            return updatedUser;
        });
    }
    updatePassword(userId, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.users)
                .set({ passwordHash })
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId));
        });
    }
    updatePasswordByEmail(email, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.users)
                .set({ passwordHash })
                .where((0, drizzle_orm_1.eq)(Schema_1.users.email, email));
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId));
        });
    }
    getAllUsers() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            // Get total count
            const totalResult = yield this.db.select({ count: Schema_1.users.id }).from(Schema_1.users);
            const total = totalResult.length;
            // Get paginated users
            const result = yield this.db.select()
                .from(Schema_1.users)
                .limit(limit)
                .offset(offset);
            return {
                users: result,
                total
            };
        });
    }
    searchUsers(searchTerm_1) {
        return __awaiter(this, arguments, void 0, function* (searchTerm, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            // For search, we'll use a simple approach - in a real app you might want to use full-text search
            const searchPattern = `%${searchTerm}%`;
            const result = yield this.db.select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(Schema_1.users.firstName, searchPattern), (0, drizzle_orm_1.like)(Schema_1.users.lastName, searchPattern), (0, drizzle_orm_1.like)(Schema_1.users.email, searchPattern)))
                .limit(limit)
                .offset(offset);
            return {
                users: result,
                total: result.length
            };
        });
    }
}
exports.UserModel = UserModel;
