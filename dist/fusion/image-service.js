"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const baseUrl = "https://api.fusionbrain.ai/api/v1", imageApi = {
    checkQueue: `${baseUrl}/text2image/inpainting/checkQueue`,
    sendImageToGenerate: `${baseUrl}/text2image/run`,
    checkImage: (e, t) => `${baseUrl}/text2image/${e}/pockets/${t}/status`,
    checkEntities: (e, t) => `${baseUrl}/text2image/${e}/pockets/${t}/entities`
};
class ImageService {
    checkQueue() {
        return axios_1.default.get(imageApi.checkQueue).then((e => e.data)).catch((e => {
            throw e;
        }));
    }
    sendImageToGenerate({ queueType: e, query: t, image: n, style: a }) {
        const o = new FormData;
        return o.append("queueType", e),
            o.append("query", t),
            o.append("preset", "1"),
            o.append("style", a || ""),
            n && o.append("image", n),
            axios_1.default.post(imageApi.sendImageToGenerate, o).then((e => e.data)).catch((e => {
                throw e;
            }));
    }
    checkPocket({ pocketId: e = "6373cb85fcc243b83219fe68", queueType: t = "inpainting" }) {
        return axios_1.default.get(imageApi.checkImage(t, e)).then((e => e.data)).catch((e => {
            throw e;
        }));
    }
    checkEntities({ pocketId: e = "6373cb85fcc243b83219fe68", queueType: t = "inpainting" }) {
        return axios_1.default.get(imageApi.checkEntities(t, e)).then((e => e.data)).catch((e => {
            throw e;
        }));
    }
}
exports.default = ImageService;
//# sourceMappingURL=image-service.js.map