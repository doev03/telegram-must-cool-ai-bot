import axios from "axios";
import FormData from 'form-data';

const baseUrl = "https://api.fusionbrain.ai/web/api/v1"
  , imageApi = {
    checkQueue: `${baseUrl}/text2image/inpainting/checkQueue`,
    sendImageToGenerate: `${baseUrl}/text2image/run?model_id=1`,
    checkImage: (queueType: string, pocketId: string) => `${baseUrl}/text2image/pockets/${pocketId}/status`,
    checkEntities: (queueType: string, pocketId: string) => `${baseUrl}/text2image/${queueType}/pockets/${pocketId}/entities`,
    checkStatus: (uuid: string) => `${baseUrl}/text2image/status/${uuid}`
  };

const defaultType = 'GENERATE';
const defaultStyle = 'DEFAULT';

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

  sendImageToGenerate({
    type = defaultType,
    query,
    image,
    style = defaultStyle,
  }: {
    type?: string,
    query: string,
    image?: string,
    style?: string,
  }) {
    const o = new FormData();
    const params = {
      'type': type,
      'style': style,
      'width': 1024,
      'height': 1024,
      'generateParams': {
        'query': query
      }
    };
    return o.append('params', JSON.stringify(params), { contentType: 'application/json' }),
      axiosInst.post(imageApi.sendImageToGenerate, o).then((e => e.data)).catch((e => {
        throw e
      }
      ));
  }

  checkStatus({ uuid }: { uuid: string }) {
    return axios.get(imageApi.checkStatus(uuid)).then((e) => e.data).catch((e => {
      throw e;
    }));
  }
}

export default FusionApi;