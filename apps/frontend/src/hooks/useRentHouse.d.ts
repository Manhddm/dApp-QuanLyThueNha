export declare function useRentHouse(): {
    thuePhong: (roomId: string | number, rentPrice: bigint, deposit: bigint, landlordAddress: `0x${string}`) => Promise<`0x${string}`>;
    duyetThuePhong: (contractId: number) => Promise<`0x${string}`>;
    tuChoiThuePhong: (contractId: number) => Promise<`0x${string}`>;
    thanhToanThang: (contractId: number, thangNam: number, rentPrice: bigint) => Promise<`0x${string}`>;
    traPhong: (contractId: number) => Promise<`0x${string}`>;
    thuHoiCocDoViPham: (contractId: number) => Promise<`0x${string}`>;
    myContracts: any[];
    allContracts: any[];
    refetchMyContracts: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<unknown, import("viem").ReadContractErrorType>>;
    refetchAllContracts: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<unknown, import("viem").ReadContractErrorType>>;
    pendingContracts: any[];
    refetchPending: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<unknown, import("viem").ReadContractErrorType>>;
    hash: `0x${string}`;
    isPending: boolean;
    isWaiting: boolean;
    isSuccess: boolean;
    writeError: import("@wagmi/core").WriteContractErrorType;
};
