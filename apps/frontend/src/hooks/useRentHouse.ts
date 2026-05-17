import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import RentHouseABI from '../abi/RentHouse.json';
// THAY ĐỊA CHỈ HỢP ĐỒNG MỚI CỦA BẠN VÀO ĐÂY SAU KHI DEPLOY LẠI
export const rentHouseAddress = '0xA1F1f99a9210cF8d374Ea71cBEB06C3Cd67263f0' as `0x${string}`;

export function useRentHouse() {
  const { address: userAddress } = useAccount();
  const { writeContractAsync, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // --- WRITE FUNCTIONS ---

  const thuePhong = async (roomId: string | number, rentPrice: bigint, deposit: bigint, landlordAddress: `0x${string}`) => {
    console.log("--- DEBUG CONTRACT CALL ---");
    console.log("Contract Address:", rentHouseAddress);
    console.log("Room ID:", roomId);
    console.log("Rent Price (Wei):", rentPrice.toString());
    console.log("Deposit (Wei):", deposit.toString());
    console.log("Landlord Address:", landlordAddress);
    console.log("Tenant Address (You):", userAddress);

    try {
      return await writeContractAsync({
        address: rentHouseAddress,
        abi: RentHouseABI.abi,
        functionName: 'thuePhong',
        args: [BigInt(roomId), rentPrice, landlordAddress],
        value: deposit,
        gas: 1000000n, // Tăng mạnh gas limit để loại trừ lỗi thiếu gas
      });
    } catch (err) {
      console.error('Error in thuePhong:', err);
      throw err;
    }
  };

  const duyetThuePhong = async (contractId: number) => {
    return await writeContractAsync({
      address: rentHouseAddress,
      abi: RentHouseABI.abi,
      functionName: 'duyetThuePhong',
      args: [BigInt(contractId)],
      gas: 500000n,
    });
  };

  const tuChoiThuePhong = async (contractId: number) => {
    return await writeContractAsync({
      address: rentHouseAddress,
      abi: RentHouseABI.abi,
      functionName: 'tuChoiThuePhong',
      args: [BigInt(contractId)],
      gas: 500000n,
    });
  };

  const thanhToanThang = async (contractId: number, thangNam: number, rentPrice: bigint) => {
    console.log("--- DEBUG THANH TOAN THANG ---");
    console.log("Contract ID:", contractId);
    console.log("Thang Nam:", thangNam);
    console.log("Rent Price (Wei):", rentPrice.toString());
    try {
      return await writeContractAsync({
        address: rentHouseAddress,
        abi: RentHouseABI.abi,
        functionName: 'thanhToanThang',
        args: [BigInt(contractId), BigInt(thangNam)],
        value: BigInt(rentPrice),
        gas: 800000n, // Set explicit gas limit to prevent silent gas estimation failures
      });
    } catch (err) {
      console.error("Error in thanhToanThang contract call:", err);
      throw err;
    }
  };

  const traPhong = async (contractId: number) => {
    return await writeContractAsync({
      address: rentHouseAddress,
      abi: RentHouseABI.abi, // wagmi requires the abi property from the imported JSON
      functionName: 'traPhong',
      args: [BigInt(contractId)],
    });
  };

  const thuHoiCocDoViPham = async (contractId: number) => {
    return await writeContractAsync({
      address: rentHouseAddress,
      abi: RentHouseABI.abi,
      functionName: 'thuHoiCocDoViPham',
      args: [BigInt(contractId)],
      gas: 500000n,
    });
  };

  // --- READ FUNCTIONS ---

  const { data: myContracts, refetch: refetchMyContracts } = useReadContract({
    address: rentHouseAddress,
    abi: RentHouseABI.abi,
    functionName: 'xemHopDong',
    account: userAddress,
  });

  const { data: allContracts, refetch: refetchAllContracts } = useReadContract({
    address: rentHouseAddress,
    abi: RentHouseABI.abi,
    functionName: 'danhSachHopDong',
    account: userAddress,
  });

  const { data: pendingContracts, refetch: refetchPending } = useReadContract({
    address: rentHouseAddress,
    abi: RentHouseABI.abi,
    functionName: 'danhSachChoDuyet',
    account: userAddress,
  });

  return {
    // Actions
    thuePhong,
    duyetThuePhong,
    tuChoiThuePhong,
    thanhToanThang,
    traPhong,
    thuHoiCocDoViPham,
    // Data
    myContracts: myContracts ? (myContracts as any[]).filter(c =>
      userAddress && (c.tenant.toLowerCase() === userAddress.toLowerCase() || c.landlord.toLowerCase() === userAddress.toLowerCase())
    ) : [],
    allContracts: allContracts as any[],
    refetchMyContracts,
    refetchAllContracts,
    pendingContracts: pendingContracts as any[],
    refetchPending: refetchPending,
    // Status
    hash,
    isPending,
    isWaiting,
    isSuccess,
    writeError,
  };
}

