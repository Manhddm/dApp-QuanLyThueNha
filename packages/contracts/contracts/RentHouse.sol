// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title RentHouse
 * @dev Hợp đồng quản lý thuê nhà đa chủ sở hữu (Multi-landlord Platform)
 */
contract RentHouse {
    
    enum Status { Pending, Active, Ended, Rejected, Evicted }

    struct RentalContract {
        uint id;
        uint roomId;
        address landlord;
        address tenant;
        uint rentPrice;
        uint deposit;
        Status status;
        uint nextPaymentDueDate;
    }

    // --- CÁC BIẾN TRẠNG THÁI (STATE VARIABLES) ---
    uint public contractCount;  // Đếm tổng số hợp đồng đã tạo

    mapping(uint => RentalContract) public contracts;
    mapping(uint => mapping(uint => bool)) public paymentTracking; // contractId => thangNam => bool
    
    // --- SỰ KIỆN (EVENTS) ---
    event RentRequested(uint indexed contractId, address indexed tenant, address indexed landlord, uint roomId, uint deposit);
    event RentApproved(uint indexed contractId, address indexed tenant, uint roomId);
    event RentRejected(uint indexed contractId, address indexed tenant, uint depositReturned);
    event RentPaid(uint indexed contractId, address indexed tenant, uint amount, uint thangNam);
    event ContractEnded(uint indexed contractId, address indexed tenant, uint depositReturned);

    // --- MODIFIERS ---
    modifier onlyContractLandlord(uint _contractId) {
        require(contracts[_contractId].landlord == msg.sender, "Ban khong phai chu nha cua hop dong nay!");
        _;
    }

    // --- CHỨC NĂNG CHÍNH ---

    /**
     * @dev Khách thuê gửi yêu cầu thuê một phòng cụ thể.
     */
    function thuePhong(uint _roomId, uint _rentPrice, address _landlord) public payable {
        require(_roomId > 0, "Phong khong hop le!");
        require(msg.sender != _landlord, "Chu nha khong the thue phong cua chinh minh!");
        require(msg.value > 0, "Yeu cau tien dat coc!");

        contractCount++;
        contracts[contractCount] = RentalContract({
            id: contractCount,
            roomId: _roomId,
            landlord: _landlord,
            tenant: msg.sender,
            rentPrice: _rentPrice,
            deposit: msg.value,
            status: Status.Pending,
            nextPaymentDueDate: 0
        });

        emit RentRequested(contractCount, msg.sender, _landlord, _roomId, msg.value);
    }

    /**
     * @dev Chủ nhà duyệt yêu cầu thuê.
     */
    function duyetThuePhong(uint _contractId) public onlyContractLandlord(_contractId) {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Pending, "Hop dong khong o trang thai cho duyet!");

        rental.status = Status.Active;
        // Gán thời gian thanh toán tiếp theo là 15 giây kể từ lúc duyệt (thay vì 30 ngày) để DEMO NHANH 30S
        rental.nextPaymentDueDate = block.timestamp + 15 seconds;

        emit RentApproved(_contractId, rental.tenant, rental.roomId);
    }

    /**
     * @dev Chủ nhà từ chối và trả lại tiền cọc cho khách.
     */
    function tuChoiThuePhong(uint _contractId) public onlyContractLandlord(_contractId) {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Pending, "Trang thai khong hop le!");

        rental.status = Status.Rejected;
        uint depositToReturn = rental.deposit;
        rental.deposit = 0;

        (bool success, ) = payable(rental.tenant).call{value: depositToReturn}("");
        require(success, "Hoan tien coc that bai!");

        emit RentRejected(_contractId, rental.tenant, depositToReturn);
    }

    /**
     * @dev Khách thanh toán tiền thuê hàng tháng.
     */
    function thanhToanThang(uint _contractId, uint _thangNam) public payable {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Active, "Hop dong khong hoat dong!");
        require(msg.sender == rental.tenant, "Chi nguoi thue moi co the thanh toan!");
        require(msg.value == rental.rentPrice, "Sai so tien thue!");
        require(!paymentTracking[_contractId][_thangNam], "Thang nay da thanh toan!");

        paymentTracking[_contractId][_thangNam] = true;
        // Cộng thêm 30 ngày vào hạn thanh toán
        rental.nextPaymentDueDate += 30 days;
        
        (bool success, ) = payable(rental.landlord).call{value: msg.value}("");
        require(success, "Chuyen tien cho chu nha that bai!");

        emit RentPaid(_contractId, msg.sender, msg.value, _thangNam);
    }

    /**
     * @dev Kết thúc hợp đồng (Trả phòng).
     */
    function traPhong(uint _contractId) public {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Active, "Hop dong khong hoat dong!");
        require(msg.sender == rental.tenant || msg.sender == rental.landlord, "Khong co quyen!");

        rental.status = Status.Ended;
        
        uint depositToReturn = rental.deposit;
        rental.deposit = 0;

        (bool success, ) = payable(rental.tenant).call{value: depositToReturn}("");
        require(success, "Hoan tien coc that bai!");

        emit ContractEnded(_contractId, rental.tenant, depositToReturn);
    }

    /**
     * @dev Chủ nhà chấm dứt hợp đồng và thu cọc nếu khách quá hạn thanh toán 5 ngày.
     */
    function thuHoiCocDoViPham(uint _contractId) public onlyContractLandlord(_contractId) {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Active, "Hop dong khong hoat dong!");
        // Yêu cầu quá hạn thêm 15 giây (tổng cộng 30 giây kể từ khi duyệt) để DEMO NHANH 30S
        require(block.timestamp > rental.nextPaymentDueDate + 15 seconds, "Chua den han hoac chua qua thoi han an han 5 ngay!");

        rental.status = Status.Evicted;
        
        uint depositToSeize = rental.deposit;
        rental.deposit = 0;

        // Chủ nhà thu toàn bộ cọc để bù đắp thiệt hại
        (bool success, ) = payable(rental.landlord).call{value: depositToSeize}("");
        require(success, "Chuyen tien coc cho chu nha that bai!");

        emit ContractEnded(_contractId, rental.tenant, 0); // Trả lại 0 tiền cọc cho khách
    }

    // --- CÁC HÀM VIEW HỖ TRỢ FRONTEND ---

    /**
     * @dev Lấy tất cả hợp đồng (Bỏ msg.sender vì Oasis Sapphire ẩn msg.sender trong eth_call)
     */
    function xemHopDong() public view returns (RentalContract[] memory) {
        RentalContract[] memory allContracts = new RentalContract[](contractCount);
        for (uint i = 1; i <= contractCount; i++) {
            allContracts[i - 1] = contracts[i];
        }
        return allContracts;
    }

    /**
     * @dev Lấy tất cả hợp đồng (cho Admin, nếu cần)
     */
    function danhSachHopDong() public view returns (RentalContract[] memory) {
        return xemHopDong();
    }

    /**
     * @dev Lấy tất cả hợp đồng chờ duyệt
     */
    function danhSachChoDuyet() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].status == Status.Pending) {
                count++;
            }
        }

        RentalContract[] memory pendingContracts = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
             if (contracts[i].status == Status.Pending) {
                pendingContracts[index] = contracts[i];
                index++;
            }
        }
        return pendingContracts;
    }
}