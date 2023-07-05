import FusionApi from "./api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class FusionImageGenerator {
  #fusionApi = new FusionApi();

  async #requestWrapper(func: Function) {
    const data = await func();
    if (!data.success) {
      throw 'failure';
    } else {
      return data.result;
    }
  }

  /// Returns pocketId
  #run = async (query: string, style: string) => {
    const result = await this.#requestWrapper(
      () => this.#fusionApi.sendImageToGenerate({ query: query, style: style })
    );
    return result.pocketId;
  }

  #awaitSuccessStatus = async (pocketId: string, sleepSeconds: number) => {
    const result = await this.#requestWrapper(
      () => this.#fusionApi.checkPocket({ pocketId: pocketId })
    );
    if (result === 'INITIAL' || result === "PROCESSING") {
      await sleep(sleepSeconds);
      await this.#awaitSuccessStatus(pocketId, 5e3);
    }
  }

  #checkEntities = (pocketId: string) => {
    return this.#requestWrapper(
      () => this.#fusionApi.checkEntities({ pocketId: pocketId })
    );
  }

  generateImage = async (query: string, style: string) => {
    try {
      const pocketId = await this.#run(query, style);
      await this.#awaitSuccessStatus(pocketId, 12e3);
      const result = await this.#checkEntities(pocketId);
      if (result[0].status != 'SUCCESS' || !result[0].response[0]) {
        throw 'failure';
      } else {
        return result[0].response[0];
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default FusionImageGenerator;
