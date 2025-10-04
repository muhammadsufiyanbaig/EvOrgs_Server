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
exports.VendorModel = void 0;
// src/services/VendorService.ts
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../Schema");
const uuid_1 = require("uuid");
class VendorModel {
    constructor(db) {
        this.db = db;
    }
    findVendorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorRecord = yield this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, id))
                .limit(1);
            return vendorRecord.length > 0 ? vendorRecord[0] : null;
        });
    }
    findVendorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorRecord = yield this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorEmail, email))
                .limit(1);
            return vendorRecord.length > 0 ? vendorRecord[0] : null;
        });
    }
    vendorExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingVendor = yield this.db.select({ id: Schema_1.vendors.id })
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorEmail, email))
                .limit(1);
            return existingVendor.length > 0;
        });
    }
    createVendor(input, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorId = (0, uuid_1.v4)();
            const socialLinks = input.vendorSocialLinks || [];
            const newVendor = {
                id: vendorId,
                vendorName: input.vendorName,
                vendorEmail: input.vendorEmail,
                vendorPhone: input.vendorPhone || null,
                fcmToken: [],
                vendorAddress: input.vendorAddress || null,
                vendorProfileDescription: input.vendorProfileDescription || null,
                vendorWebsite: input.vendorWebsite || null,
                vendorSocialLinks: socialLinks,
                passwordHash,
                profileImage: input.profileImage || null,
                bannerImage: input.bannerImage || null,
                vendorType: input.vendorType,
                vendorStatus: 'Pending',
                vendorTypeId: input.vendorTypeId || null,
                rating: null,
                reviewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            yield this.db.insert(Schema_1.vendors).values(newVendor);
            return vendorId;
        });
    }
    updateVendorEmail(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vendors)
                .set({ updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId));
        });
    }
    updateVendorProfile(vendorId_1, input_1) {
        return __awaiter(this, arguments, void 0, function* (vendorId, input, currentFcmTokens = []) {
            const updateData = {};
            if (input.vendorName)
                updateData.vendorName = input.vendorName;
            if (input.vendorPhone)
                updateData.vendorPhone = input.vendorPhone;
            if (input.vendorAddress)
                updateData.vendorAddress = input.vendorAddress;
            if (input.vendorProfileDescription)
                updateData.vendorProfileDescription = input.vendorProfileDescription;
            if (input.vendorWebsite)
                updateData.vendorWebsite = input.vendorWebsite;
            if (input.vendorSocialLinks)
                updateData.vendorSocialLinks = input.vendorSocialLinks;
            if (input.profileImage)
                updateData.profileImage = input.profileImage;
            if (input.bannerImage)
                updateData.bannerImage = input.bannerImage;
            if (input.vendorType)
                updateData.vendorType = input.vendorType;
            if (input.vendorTypeId)
                updateData.vendorTypeId = input.vendorTypeId;
            updateData.updatedAt = new Date();
            if (input.fcmToken && !currentFcmTokens.includes(input.fcmToken)) {
                updateData.fcmToken = [...currentFcmTokens, input.fcmToken];
            }
            yield this.db.update(Schema_1.vendors)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId));
            return this.findVendorById(vendorId);
        });
    }
    updatePassword(vendorId, newPasswordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vendors)
                .set({
                passwordHash: newPasswordHash,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId));
        });
    }
    updatePasswordByEmail(email, newPasswordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vendors)
                .set({
                passwordHash: newPasswordHash,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorEmail, email));
        });
    }
    deleteVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId));
        });
    }
    updateVendorApproval(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vendors)
                .set({
                vendorStatus: input.status,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, input.vendorId));
            return this.findVendorById(input.vendorId);
        });
    }
    getPendingVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorStatus, 'Pending'));
        });
    }
    getApprovedVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorStatus, 'Approved'));
        });
    }
    // Admin methods for vendor management
    getAllVendors() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            // Get total count
            const totalResult = yield this.db.select({ count: Schema_1.vendors.id }).from(Schema_1.vendors);
            const total = totalResult.length;
            // Get paginated vendors
            const result = yield this.db.select()
                .from(Schema_1.vendors)
                .limit(limit)
                .offset(offset);
            return {
                vendors: result,
                total
            };
        });
    }
    searchVendors(searchTerm_1) {
        return __awaiter(this, arguments, void 0, function* (searchTerm, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const searchPattern = `%${searchTerm}%`;
            const result = yield this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(Schema_1.vendors.vendorName, searchPattern), (0, drizzle_orm_1.like)(Schema_1.vendors.vendorEmail, searchPattern), (0, drizzle_orm_1.like)(Schema_1.vendors.vendorAddress, searchPattern)))
                .limit(limit)
                .offset(offset);
            return {
                vendors: result,
                total: result.length
            };
        });
    }
    getVendorsByStatus(status_1) {
        return __awaiter(this, arguments, void 0, function* (status, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorStatus, status))
                .limit(limit)
                .offset(offset);
            // Get total count for this status
            const totalResult = yield this.db.select({ count: Schema_1.vendors.id })
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorStatus, status));
            return {
                vendors: result,
                total: totalResult.length
            };
        });
    }
    getVendorsByType(vendorType_1) {
        return __awaiter(this, arguments, void 0, function* (vendorType, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield this.db.select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorType, vendorType))
                .limit(limit)
                .offset(offset);
            // Get total count for this type
            const totalResult = yield this.db.select({ count: Schema_1.vendors.id })
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.vendorType, vendorType));
            return {
                vendors: result,
                total: totalResult.length
            };
        });
    }
}
exports.VendorModel = VendorModel;
