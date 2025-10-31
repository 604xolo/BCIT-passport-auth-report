"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailIdAndPassword = getUserByEmailIdAndPassword;
exports.getUserByEmail = getUserByEmail;
exports.getUserById = getUserById;
exports.isUserValid = isUserValid;
const userModel_1 = require("../models/userModel");
function getUserByEmailIdAndPassword(email, password) {
    try {
        const user = userModel_1.userModel.findOne(email);
        return isUserValid(user, password) ? user : null;
    }
    catch (_a) {
        return null;
    }
}
function getUserByEmail(email) {
    const u = userModel_1.userModel.findOneByEmail(email);
    return u !== null && u !== void 0 ? u : null;
}
function getUserById(id) {
    try {
        return userModel_1.userModel.findById(id);
    }
    catch (_a) {
        return null;
    }
}
function isUserValid(user, password) {
    return user.password === password;
}
