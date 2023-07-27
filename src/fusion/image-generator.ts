import FusionApi from "./api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class FusionImageGenerator {
  #fusionApi = new FusionApi();

  async #requestWrapper(func: Function) {
    return func();
  }

  /// Returns pocketId
  #run = async (query: string, style?: string) => {
    const result = await this.#requestWrapper(
      () => this.#fusionApi.sendImageToGenerate({query: query, style: style })
    );
    return result.uuid;
  }

  async #awaitSuccessStatus(pocketId: string, sleepSeconds: number) : Promise<any> {
    const result = await this.#requestWrapper(
      () => this.#fusionApi.checkStatus({ uuid: pocketId })
    );
    if (result.status != 'DONE') {
      await sleep(sleepSeconds);
      return this.#awaitSuccessStatus(pocketId, 5e3);
    }
    return result;
  }

  generateImage = async (query: string, style?: string) => {
    try {
      const pocketId = await this.#run(query, style);
      const result = await this.#awaitSuccessStatus(pocketId, 8e3);
      return result.images[0];
    } catch (e) {
      console.log(e);
    }
  }
}

export default FusionImageGenerator;
