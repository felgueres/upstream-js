import ErrorBoundary from "./ErrorBoundary.js";

export interface IUpstream {
    // initializeAsync(): Promise<void>; // means you will implement initAsync and will return a promise
    // checkGate(gateName: string, ignoreOverrides?: boolean): boolean; // Means will return boolean
    // shutdown(): void; // Means will return void
    // overrideGate(gateName: string, value: boolean): void; // means will return void
    // removeGateOverride(gateName?: string): void;
}

export interface IHasUpstreamInternal {
    getErrorBoundary(): ErrorBoundary;
    // getNetwork(): StatsigNetwork;
    // getStore(): StatsigStore;
    // getLogger(): StatsigLogger;
    // getOptions(): StatsigSDKOptions;
    // getCurrentUser(): StatsigUser | null;
    // getSDKKey(): string;
    // getSDKType(): string;
    // getSDKVersion(): string;
}

export type StatsigOverrides = {
    // <string, boolean> means key is a string and value is a boolean
    gates: Record<string, boolean>;
    configs: Record<string, Record<string, any>>;
};

// Init sdk with sk
// Pass key name or id
// Retrieve value 

export default class UpstreamClient implements IUpstream, IHasUpstreamInternal {
    private ready: boolean;
    private initCalled: boolean = false;
    private pendingInitPromise: Promise<void> | null = null;

    private errorBoundary: ErrorBoundary;
    public getErrorBoundary(): ErrorBoundary {
        return this.errorBoundary;
    }

    private sdkKey: string | null;
    public getSDKKey(): string {
        if (this.sdkKey == null) { return ''; }
        return this.sdkKey;
    }

    public constructor(sdkKey: string) {
        this.ready = false;
        if (typeof sdkKey !== 'string' || !sdkKey.startsWith('sk-')) {
            throw new Error('Invalid key provided.  You must use a Client SDK Key from Upstream dashboard to initialize the sdk.',);
        }
        this.sdkKey = sdkKey;
        this.errorBoundary = new ErrorBoundary(sdkKey);
    }

    public initializeCalled(): boolean {
        return this.initCalled
    }

} 
