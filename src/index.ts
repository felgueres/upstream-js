import UpstreamClient from "./UpstreamClient";

export default class Upstream {
    private static instance: UpstreamClient | null = null;

    private constructor() {}
  
    public static async initialize( sdkKey: string, user?: string | null): Promise<void> {

      const inst = Upstream.instance ?? new UpstreamClient(sdkKey);
  
      if (!Upstream.instance) {
        Upstream.instance = inst;
      }
  
      // return inst.initializeAsync();
    }
}
