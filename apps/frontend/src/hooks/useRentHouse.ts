import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import RentHouseABI from '../../../../packages/shared/abi/RentHouse.json';
import Addresses from '../../../../packages/shared/addresses/hardhat.json'; // Default to hardhat for development

const rentHouseAddress = Addresses.RentHouse as `0x${string}`;

export function useRentHouse() {
  const { address: userAddress } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // --- WRITE FUNCTIONS ---

  const thuePhong = (roomId: number, rentPrice: bigint, deposit: bigint) => {
    return writeContract({
      address: rentHouseAddress,
      abi: RentHouseABI,
      functionName: 'thuePhong',
      args: [BigInt(roomId), rentPrice],
      value: deposit,
    });
  };

  const duyetThuePhong = (contractId: number) => {
    return writeContract({
      address: rentHouseAddress,
      abi: RentHouseABI,
      functionName: 'duyetThuePhong',
      args: [BigInt(contractId)],
    });
  };

  const thanhToanThang = (contractId: number, thangNam: number, rentPrice: bigint) => {
    return writeContract({
      address: rentHouseAddress,
      abi: RentHouseABI,
      functionName: 'thanhToanThang',
      args: [BigInt(contractId), BigInt(thangNam)],
      value: rentPrice,
    });
  };

  const traPhong = (contractId: number) => {
    return writeContract({
      address: rentHouseAddress,
      abi: RentHouseABI,
      functionName: 'traPhong',
      args: [BigInt(contractId)],
    });
  };

  // --- READ FUNCTIONS ---

  const { data: myContracts, refetch: refetchMyContracts } = useReadContract({
    address: rentHouseAddress,
    abi: RentHouseABI,
    functionName: 'xemHopDong',
    account: userAddress,
  });

  const { data: allContracts, refetch: refetchAllContracts } = useReadContract({
    address: rentHouseAddress,
    abi: RentHouseABI,
    functionName: 'danhSachHopDong',
    account: userAddress,
  });

  return {
    // Actions
    thuePhong,
    duyetThuePhong,
    thanhToanThang,
    traPhong,
    // Data
    myContracts: myContracts as any[],
    allContracts: allContracts as any[],
    refetchMyContracts,
    refetchAllContracts,
    // Status
    hash,
    isPending,
    isWaiting,
    isSuccess,
    writeError,
  };
}
