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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs_1 = require("fs");
var ESCROW_URL = "http://api.sandbox.rootpe.com";
var ORIGINAL_MAP_PATH = "../game-escrow-map.json";
function fetchToken() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post("https://dev-rootpe.us.auth0.com/oauth/token", {
                        client_id: process.env.AUTH0_CLIENT_ID,
                        client_secret: process.env.AUTH0_SECRET,
                        audience: "https://sandbox.rootpe.com/",
                        grant_type: "client_credentials",
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data.access_token];
            }
        });
    });
}
function escrowInfo(id, authToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("".concat(ESCROW_URL, "/escrows/").concat(id), {
                        headers: {
                            Authorization: "Bearer ".concat(authToken)
                        }
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function createGamingEscrow(authToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post("".concat(ESCROW_URL, "/escrows/gaming/create"), {
                        name: "gaming escrow [demo]",
                        currency: "f48ee79e-5a38-33a3-918e-c7faaa0d2ce0", // GINRC
                        start_funding_amount: 10,
                        end_funding_amount: 1000,
                        fee_percentage: 10000,
                        is_reward_percentage: true,
                        reward_amount: [0],
                        reward_percentage: [9000],
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(authToken)
                        }
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function startFunding(id, authToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post("".concat(ESCROW_URL, "/escrows/").concat(id, "/start_funding"), undefined, {
                        headers: {
                            Authorization: "Bearer ".concat(authToken)
                        }
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function updateMap(final) {
    console.log("\n> updating original map..");
    console.log(final);
    (0, fs_1.writeFileSync)(ORIGINAL_MAP_PATH, JSON.stringify(final, undefined, 2));
    console.log("\n> done.");
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var orig, final, authToken, i, entry, info, _a, newEscrow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("> fetching original map..");
                    orig = JSON.parse((0, fs_1.readFileSync)(ORIGINAL_MAP_PATH).toString());
                    final = __spreadArray([], orig, true);
                    console.log("> fetching an auth token..");
                    return [4 /*yield*/, fetchToken()];
                case 1:
                    authToken = _b.sent();
                    console.log("> looking for expired escrows..\n");
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < orig.length)) return [3 /*break*/, 11];
                    entry = orig[i];
                    return [4 /*yield*/, escrowInfo(entry.escrowId, authToken)];
                case 3:
                    info = (_b.sent()).data;
                    if (!(info.status != "FUNDING")) return [3 /*break*/, 10];
                    console.log(">> escrowId ".concat(info.id, " is not in funding state. checking possible options.."));
                    _a = info.status;
                    switch (_a) {
                        case "INITIALIZED": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 6];
                case 4:
                    console.log("    >>> initialized, but not started. starting now..");
                    return [4 /*yield*/, startFunding(info.id, authToken)];
                case 5:
                    _b.sent();
                    console.log("    >>> done: ".concat(info.id));
                    return [3 /*break*/, 9];
                case 6:
                    console.log("    >>> unfixable situation. creating new..");
                    return [4 /*yield*/, createGamingEscrow(authToken)];
                case 7:
                    newEscrow = (_b.sent()).data;
                    console.log("    >>> start funding..");
                    return [4 /*yield*/, startFunding(newEscrow.id, authToken)];
                case 8:
                    _b.sent();
                    console.log("    >>> done: ".concat(newEscrow.id));
                    final[i].escrowId = newEscrow.id;
                    _b.label = 9;
                case 9:
                    ;
                    _b.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 2];
                case 11:
                    if (orig === final) {
                        console.log("> original map same as final. exiting..");
                        return [2 /*return*/];
                    }
                    updateMap(final);
                    return [2 /*return*/];
            }
        });
    });
}
main();
