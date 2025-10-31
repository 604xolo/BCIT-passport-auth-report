"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.userModel = void 0;
const database = [
    {
        id: 1,
        name: "Jimmy Smith",
        email: "jimmy123@gmail.com",
        password: "jimmy123!",
        role: "admin",
        provider: "local",
    },
    {
        id: 2,
        name: "Johnny Doe",
        email: "johnny123@gmail.com",
        password: "johnny123!",
        role: "user",
        provider: "local",
    },
    {
        id: 3,
        name: "Jonathan Chen",
        email: "jonathan123@gmail.com",
        password: "jonathan123!",
        role: "user",
        provider: "local",
    },
];
exports.database = database;
let nextId = 4;
exports.userModel = {
    all() {
        return database;
    },
    findOne(email) {
        const user = database.find((u) => { var _a; return ((_a = u.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === email.toLowerCase(); });
        if (user)
            return user;
        throw new Error(`Couldn't find user with email: ${email}`);
    },
    findOneByEmail(email) {
        return database.find((u) => { var _a; return ((_a = u.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === email.toLowerCase(); });
    },
    findById(id) {
        const user = database.find((u) => u.id === id);
        if (user)
            return user;
        throw new Error(`Couldn't find user with id: ${id}`);
    },
    createFromGithub(data) {
        const newUser = {
            id: nextId++,
            name: data.name,
            email: data.email, // may be undefined if user hides email on GitHub
            role: "user",
            avatarUrl: data.avatarUrl,
            provider: "github",
        };
        database.push(newUser);
        return newUser;
    },
};
