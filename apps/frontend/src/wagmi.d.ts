export declare const oasisSapphireTestnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Oasis Explorer";
            readonly url: "https://explorer.testnet.sapphire.oasis.dev";
        };
    };
    blockTime?: number | undefined;
    contracts?: import("viem").Prettify<{
        [key: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
    } & {
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        erc6492Verifier?: import("viem").ChainContract | undefined;
    }> | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 23295;
    name: "Oasis Sapphire Testnet";
    nativeCurrency: {
        readonly name: "Sapphire Testnet ROSE";
        readonly symbol: "TEST";
        readonly decimals: 18;
    };
    experimental_preconfirmationTime?: number | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://testnet.sapphire.oasis.dev"];
        };
    };
    sourceId?: number | undefined;
    testnet: true;
    custom?: Record<string, unknown>;
    extendSchema?: Record<string, unknown>;
    fees?: import("viem").ChainFees<undefined>;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable>;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
    extend: <const extended_1 extends Record<string, unknown>>(extended: extended_1) => import("viem").Assign<import("viem").Assign<import("viem").Chain<undefined>, {
        readonly id: 23295;
        readonly name: "Oasis Sapphire Testnet";
        readonly nativeCurrency: {
            readonly name: "Sapphire Testnet ROSE";
            readonly symbol: "TEST";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://testnet.sapphire.oasis.dev"];
            };
        };
        readonly blockExplorers: {
            readonly default: {
                readonly name: "Oasis Explorer";
                readonly url: "https://explorer.testnet.sapphire.oasis.dev";
            };
        };
        readonly testnet: true;
    }>, extended_1>;
};
export declare const config: import("wagmi").Config<readonly [{
    blockExplorers: {
        readonly default: {
            readonly name: "Oasis Explorer";
            readonly url: "https://explorer.testnet.sapphire.oasis.dev";
        };
    };
    blockTime?: number | undefined;
    contracts?: import("viem").Prettify<{
        [key: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
    } & {
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        erc6492Verifier?: import("viem").ChainContract | undefined;
    }> | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 23295;
    name: "Oasis Sapphire Testnet";
    nativeCurrency: {
        readonly name: "Sapphire Testnet ROSE";
        readonly symbol: "TEST";
        readonly decimals: 18;
    };
    experimental_preconfirmationTime?: number | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://testnet.sapphire.oasis.dev"];
        };
    };
    sourceId?: number | undefined;
    testnet: true;
    custom?: Record<string, unknown>;
    extendSchema?: Record<string, unknown>;
    fees?: import("viem").ChainFees<undefined>;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable>;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
    extend: <const extended_1 extends Record<string, unknown>>(extended: extended_1) => import("viem").Assign<import("viem").Assign<import("viem").Chain<undefined>, {
        readonly id: 23295;
        readonly name: "Oasis Sapphire Testnet";
        readonly nativeCurrency: {
            readonly name: "Sapphire Testnet ROSE";
            readonly symbol: "TEST";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://testnet.sapphire.oasis.dev"];
            };
        };
        readonly blockExplorers: {
            readonly default: {
                readonly name: "Oasis Explorer";
                readonly url: "https://explorer.testnet.sapphire.oasis.dev";
            };
        };
        readonly testnet: true;
    }>, extended_1>;
}], {
    23295: import("viem").HttpTransport<undefined, false>;
}, readonly [import("wagmi").CreateConnectorFn<{
    on: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
    removeListener: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
    request: import("viem").EIP1193RequestFn<import("viem").EIP1474Methods>;
    isApexWallet?: true | undefined;
    isAvalanche?: true | undefined;
    isBackpack?: true | undefined;
    isBifrost?: true | undefined;
    isBitKeep?: true | undefined;
    isBitski?: true | undefined;
    isBlockWallet?: true | undefined;
    isBraveWallet?: true | undefined;
    isCoinbaseWallet?: true | undefined;
    isDawn?: true | undefined;
    isEnkrypt?: true | undefined;
    isExodus?: true | undefined;
    isFrame?: true | undefined;
    isFrontier?: true | undefined;
    isGamestop?: true | undefined;
    isHyperPay?: true | undefined;
    isImToken?: true | undefined;
    isKuCoinWallet?: true | undefined;
    isMathWallet?: true | undefined;
    isMetaMask?: true | undefined;
    isOkxWallet?: true | undefined;
    isOKExWallet?: true | undefined;
    isOneInchAndroidWallet?: true | undefined;
    isOneInchIOSWallet?: true | undefined;
    isOpera?: true | undefined;
    isPhantom?: true | undefined;
    isPortal?: true | undefined;
    isRabby?: true | undefined;
    isRainbow?: true | undefined;
    isStatus?: true | undefined;
    isTally?: true | undefined;
    isTokenPocket?: true | undefined;
    isTokenary?: true | undefined;
    isTrust?: true | undefined;
    isTrustWallet?: true | undefined;
    isUniswapWallet?: true | undefined;
    isXDEFI?: true | undefined;
    isZerion?: true | undefined;
    providers?: {
        on: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
        removeListener: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
        request: import("viem").EIP1193RequestFn<import("viem").EIP1474Methods>;
        isApexWallet?: true;
        isAvalanche?: true;
        isBackpack?: true;
        isBifrost?: true;
        isBitKeep?: true;
        isBitski?: true;
        isBlockWallet?: true;
        isBraveWallet?: true;
        isCoinbaseWallet?: true;
        isDawn?: true;
        isEnkrypt?: true;
        isExodus?: true;
        isFrame?: true;
        isFrontier?: true;
        isGamestop?: true;
        isHyperPay?: true;
        isImToken?: true;
        isKuCoinWallet?: true;
        isMathWallet?: true;
        isMetaMask?: true;
        isOkxWallet?: true;
        isOKExWallet?: true;
        isOneInchAndroidWallet?: true;
        isOneInchIOSWallet?: true;
        isOpera?: true;
        isPhantom?: true;
        isPortal?: true;
        isRabby?: true;
        isRainbow?: true;
        isStatus?: true;
        isTally?: true;
        isTokenPocket?: true;
        isTokenary?: true;
        isTrust?: true;
        isTrustWallet?: true;
        isUniswapWallet?: true;
        isXDEFI?: true;
        isZerion?: true;
        providers?: /*elided*/ any[] | undefined;
        _events?: {
            connect?: (() => void) | undefined;
        } | undefined;
        _state?: {
            accounts?: string[];
            initialized?: boolean;
            isConnected?: boolean;
            isPermanentlyDisconnected?: boolean;
            isUnlocked?: boolean;
        } | undefined;
    }[] | undefined | undefined;
    _events?: {
        connect?: (() => void) | undefined;
    } | undefined | undefined;
    _state?: {
        accounts?: string[];
        initialized?: boolean;
        isConnected?: boolean;
        isPermanentlyDisconnected?: boolean;
        isUnlocked?: boolean;
    } | undefined | undefined;
}, {
    onConnect(connectInfo: import("viem").ProviderConnectInfo): void;
}, {
    [x: `${string}.disconnected`]: true;
    "injected.connected": true;
}>]>;
