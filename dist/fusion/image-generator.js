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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FusionImageGenerator_fusionApi, _FusionImageGenerator_requestWrapper, _FusionImageGenerator_run, _FusionImageGenerator_awaitSuccessStatus, _FusionImageGenerator_checkEntities;
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./api"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class FusionImageGenerator {
    constructor() {
        _FusionImageGenerator_fusionApi.set(this, new api_1.default());
        _FusionImageGenerator_requestWrapper.set(this, (func) => __awaiter(this, void 0, void 0, function* () {
            const data = yield func();
            if (!data.success) {
                throw 'failure';
            }
            else {
                return data.result;
            }
        })
        /// Returns pocketId
        );
        /// Returns pocketId
        _FusionImageGenerator_run.set(this, (query, style) => __awaiter(this, void 0, void 0, function* () {
            const result = yield __classPrivateFieldGet(this, _FusionImageGenerator_requestWrapper, "f").call(this, () => __classPrivateFieldGet(this, _FusionImageGenerator_fusionApi, "f").sendImageToGenerate({ query: query, style: style }));
            return result.pocketId;
        }));
        _FusionImageGenerator_awaitSuccessStatus.set(this, (pocketId) => __awaiter(this, void 0, void 0, function* () {
            const result = yield __classPrivateFieldGet(this, _FusionImageGenerator_requestWrapper, "f").call(this, () => __classPrivateFieldGet(this, _FusionImageGenerator_fusionApi, "f").checkPocket({ pocketId: pocketId }));
            if (result === 'INITIAL' || result === "PROCESSING") {
                yield sleep(5e3);
                yield __classPrivateFieldGet(this, _FusionImageGenerator_awaitSuccessStatus, "f").call(this, pocketId);
            }
        }));
        _FusionImageGenerator_checkEntities.set(this, (pocketId) => {
            return __classPrivateFieldGet(this, _FusionImageGenerator_requestWrapper, "f").call(this, () => __classPrivateFieldGet(this, _FusionImageGenerator_fusionApi, "f").checkEntities({ pocketId: pocketId }));
        });
        this.generateImage = (query, style) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pocketId = yield __classPrivateFieldGet(this, _FusionImageGenerator_run, "f").call(this, query, style);
                yield __classPrivateFieldGet(this, _FusionImageGenerator_awaitSuccessStatus, "f").call(this, pocketId);
                const result = yield __classPrivateFieldGet(this, _FusionImageGenerator_checkEntities, "f").call(this, pocketId);
                if (result[0].status != 'SUCCESS' || !result[0].response[0]) {
                    throw 'failure';
                }
                else {
                    return result[0].response[0];
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
_FusionImageGenerator_fusionApi = new WeakMap(), _FusionImageGenerator_requestWrapper = new WeakMap(), _FusionImageGenerator_run = new WeakMap(), _FusionImageGenerator_awaitSuccessStatus = new WeakMap(), _FusionImageGenerator_checkEntities = new WeakMap();
exports.default = FusionImageGenerator;
//# sourceMappingURL=image-generator.js.map