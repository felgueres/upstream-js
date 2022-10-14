import { UpstreamUninitializedError } from "./Errors";
import UpstreamClient from "./UpstreamClient";
import { UpstreamOptions } from "./UpstreamSDKOptions";
import { UpstreamUser } from "./UpstreamUser";

export default class Upstream {
  private static instance: UpstreamClient | null = null;

  private constructor() {}

  public static async initialize(
    sdkKey: string,
    user?: UpstreamUser | null,
    options?: UpstreamOptions | null
  ): Promise<void> {

    const inst = Upstream.instance ?? new UpstreamClient(sdkKey, user, options);

    if (!Upstream.instance) {
      Upstream.instance = inst;
    }
    // return inst.initializeAsync();
  }

  public static getClientX(): UpstreamClient {
    if (!Upstream.instance) {
      throw new UpstreamUninitializedError();
    }
    return Upstream.instance;
  }

}
