import ErrorBoundary from "./ErrorBoundary.js";
import UpstreamNetwork from "./Network.js";
import UpstreamSDKOptions, { UpstreamOptions } from "./UpstreamSDKOptions.js";
import UpstreamStore from "./UpstreamStore.js";
import UpstreamIdentity from "./UpstreamIdentity.js";
import UpstreamLogger from "./UpstreamLogger.js";
import { UpstreamUser } from "./UpstreamUser.js";
import { getUserCacheKey } from "./utils/Hashing.js";

export type _SDKPackageInfo = { sdkType: string; sdkVersion: string; };

export interface IUpstream {
    // initializeAsync(): Promise<void>; // means you will implement initAsync and will return a promise
    // checkGate(gateName: string, ignoreOverrides?: boolean): boolean; // Means will return boolean
    // shutdown(): void; // Means will return void
    // overrideGate(gateName: string, value: boolean): void; // means will return void
    // removeGateOverride(gateName?: string): void;
}

export interface IHasUpstreamInternal {
    getSDKKey(): string;
    getErrorBoundary(): ErrorBoundary;
    getNetwork(): UpstreamNetwork;
    getOptions(): UpstreamSDKOptions;
    getStore(): UpstreamStore;
    getCurrentUser(): UpstreamUser | null;
    getCurrentUserCacheKey(): string; // May not be required
    getLogger(): UpstreamLogger;
    getUpstreamMetadata(): Record<string, string | number>;
    getSDKType(): string;
    getSDKVersion(): string;
}

export type UpstreamOverrides = {
    gates: Record<string, boolean>;
};

export default class UpstreamClient implements IUpstream, IHasUpstreamInternal {
    // FIELD DECLARATION
    private ready: boolean;
    private initCalled: boolean = false;
    private pendingInitPromise: Promise<void> | null = null;
    private errorBoundary: ErrorBoundary;
    private sdkKey: string | null;
    private identity: UpstreamIdentity;
    private network: UpstreamNetwork;
    private options: UpstreamSDKOptions;
    private store: UpstreamStore;
    private logger: UpstreamLogger;

    // CONSTRUCTOR 
    public constructor(
        sdkKey: string,
        user?: UpstreamUser | null,
        options?: UpstreamOptions | null
    ) {
        if (typeof sdkKey !== 'string' || !sdkKey.startsWith('sk-')) {
            throw new Error('Invalid key provided.  You must use a Client SDK Key from Upstream dashboard to initialize the sdk.',);
        }
        this.errorBoundary = new ErrorBoundary(sdkKey);
        this.ready = false;
        this.sdkKey = sdkKey;
        this.options = new UpstreamSDKOptions(options);
        this.identity = new UpstreamIdentity(
            this.normalizeUser(user ?? null),
            this.options.getOverrideStableID())

        this.network = new UpstreamNetwork(this);
        this.store = new UpstreamStore(this);
        this.logger = new UpstreamLogger(this);
    }

    // GET METHODS 
    public initializeCalled(): boolean {
        return this.initCalled
    }

    public getErrorBoundary(): ErrorBoundary {
        return this.errorBoundary;
    }

    public getSDKKey(): string {
        if (this.sdkKey == null) { return ''; }
        return this.sdkKey;
    }

    public getCurrentUser(): UpstreamUser | null {
        return this.identity.getUser();
    }

    public getNetwork(): UpstreamNetwork {
        return this.network;
    }

    public getOptions(): UpstreamSDKOptions {
        return this.options;
    }

    public getStore(): UpstreamStore {
        return this.store;
    }

    public getLogger(): UpstreamLogger {
        return this.logger;
    }

    public getCurrentUserCacheKey(): string {
        return getUserCacheKey(this.getCurrentUser());
    }

    public getUpstreamMetadata(): Record<string, string | number> {
        return this.identity.getUpstreamMetadata();
    }

    public getSDKType(): string {
        return this.identity.getSDKType();
    }

    public getSDKVersion(): string {
        return this.identity.getSDKVersion();
    }

    // HELPER FUNCS
    private normalizeUser(user: UpstreamUser | null): UpstreamUser {
        let userCopy = JSON.parse(JSON.stringify(user));
        if (this.options.getEnvironment() != null) {
          // @ts-ignore
          userCopy.statsigEnvironment = this.options.getEnvironment();
        }
        return userCopy;
      }
} 