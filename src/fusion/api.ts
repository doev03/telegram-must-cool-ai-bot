import axios from "axios";
import FormData from 'form-data';

const baseUrl = "https://api.fusionbrain.ai/api/v1"
  , imageApi = {
    checkQueue: `${baseUrl}/text2image/inpainting/checkQueue`,
    sendImageToGenerate: `${baseUrl}/text2image/run`,
    checkImage: (queueType: string, pocketId: string) => `${baseUrl}/text2image/${queueType}/pockets/${pocketId}/status`,
    checkEntities: (queueType: string, pocketId: string) => `${baseUrl}/text2image/${queueType}/pockets/${pocketId}/entities`
  };

const defaultQueueType = 'generate';

const headers = {
  "origin": "https://editor.fusionbrain.ai"
}

const axiosInst = axios.create({
  headers: headers
});

class FusionApi {
  checkQueue() {
    return axiosInst.get(imageApi.checkQueue,).then((e => e.data)).catch((e => {
      throw e
    }
    ))
  }
  sendImageToGenerate({ queueType = defaultQueueType, query, image, style }: { queueType?: string, query: string, image?: string, style: string }) {
    const o = new FormData;
    return o.append("queueType", queueType),
      o.append("query", query),
      o.append("preset", "1"),
      o.append("style", style || ""),
      image && o.append("image", image),
      axiosInst.post(imageApi.sendImageToGenerate, o).then((e => e.data)).catch((e => {
        throw e
      }
      ))
  }
  checkPocket({ pocketId = "6373cb85fcc243b83219fe68", queueType = "generate" }) {
    return axiosInst.get(imageApi.checkImage(queueType, pocketId)).then((e => e.data)).catch((e => {
      throw e
    }
    ))
  }
  checkEntities({ pocketId = "6373cb85fcc243b83219fe68", queueType = "generate" }) {
    return axiosInst.get(imageApi.checkEntities(queueType, pocketId)).then((e => e.data)).catch((e => {
      throw e
    }
    ))
  }
}

export default FusionApi;