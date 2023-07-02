"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const baseUrl = "https://api.fusionbrain.ai/api/v1", imageApi = {
    checkQueue: `${baseUrl}/text2image/inpainting/checkQueue`,
    sendImageToGenerate: `${baseUrl}/text2image/run`,
    checkImage: (queueType, pocketId) => `${baseUrl}/text2image/${queueType}/pockets/${pocketId}/status`,
    checkEntities: (queueType, pocketId) => `${baseUrl}/text2image/${queueType}/pockets/${pocketId}/entities`
};
const defaultQueueType = 'generate';
const headers = {
    "origin": "https://editor.fusionbrain.ai"
};
const axiosInst = axios_1.default.create({
    headers: headers
});
class FusionApi {
    checkQueue() {
        return axiosInst.get(imageApi.checkQueue).then((e => e.data)).catch((e => {
            throw e;
        }));
    }
    sendImageToGenerate({ queueType = defaultQueueType, query, image, style }) {
        const o = new form_data_1.default;
        return o.append("queueType", queueType),
            o.append("query", query),
            o.append("preset", "1"),
            o.append("style", style || ""),
            image && o.append("image", image),
            axiosInst.post(imageApi.sendImageToGenerate, o).then((e => e.data)).catch((e => {
                throw e;
            }));
    }
    checkPocket({ pocketId = "6373cb85fcc243b83219fe68", queueType = "generate" }) {
        return axiosInst.get(imageApi.checkImage(queueType, pocketId)).then((e => e.data)).catch((e => {
            throw e;
        }));
    }
    checkEntities({ pocketId = "6373cb85fcc243b83219fe68", queueType = "generate" }) {
        return axiosInst.get(imageApi.checkEntities(queueType, pocketId)).then((e => e.data)).catch((e => {
            throw e;
        }));
    }
}
exports.default = FusionApi;
//# sourceMappingURL=api.js.map