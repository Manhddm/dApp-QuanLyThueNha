// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title RentHousePlatform
 * @dev Hợp đồng quản lý thuê nhà đa chủ sở hữu (Multi-landlord Platform)
 */
contract RentHousePlatform {
    
    enum Status { Pending, Active, Ended, Rejected }

    struct RentalContract {
        uint id;
        uint roomId;
        address landlord;
        address tenant;
        uint rentPrice;
        uint deposit;
        Status status;
    }

    struct Room {
        uint id;
        address owner;
        string description; // FE có thể lưu thêm mô tả ngắn hoặc link ảnh
        bool isAvailable;
    }

    // --- CÁC BIẾN TRẠNG THÁI (STATE VARIABLES) ---
    uint public roomCount;      // Đếm tổng số phòng trên hệ thống
    uint public contractCount;  // Đếm tổng số hợp đồng đã tạo

    mapping(uint => Room) public rooms; // Quản lý thông tin phòng
    mapping(uint => RentalContract) public contracts;
    mapping(uint => mapping(uint => bool)) public paymentTracking; // contractId => thangNam => bool
    
    // --- SỰ KIỆN (EVENTS) ---
    event RoomRegistered(uint indexed roomId, address indexed landlord);
    event RentRequested(uint indexed contractId, address indexed tenant, uint roomId, uint deposit);
    event RentApproved(uint indexed contractId, address indexed tenant, uint roomId);
    event RentRejected(uint indexed contractId, address indexed tenant, uint depositReturned);
    event RentPaid(uint indexed contractId, address indexed tenant, uint amount, uint thangNam);
    event ContractEnded(uint indexed contractId, address indexed tenant, uint depositReturned);

    // --- MODIFIERS ---
    modifier onlyRoomOwner(uint _roomId) {
        require(rooms[_roomId].owner == msg.sender, "Ban khong phai chu so huu phong nay!");
        _;
    }

    modifier onlyContractLandlord(uint _contractId) {
        require(contracts[_contractId].landlord == msg.sender, "Ban khong phai chu nha cua hop dong nay!");
        _;
    }

    // --- CHỨC NĂNG CHÍNH ---

    /**
     * @dev Chủ nhà đăng ký phòng mới lên hệ thống.
     * ID phòng được tự động tạo dựa trên roomCount.
     */
    function dangKyPhong(string memory _description) public {
        roomCount++;
        rooms[roomCount] = Room({
            id: roomCount,
            owner: msg.sender,
            description: _description,
            isAvailable: true
        });

        emit RoomRegistered(roomCount, msg.sender);
    }

    /**
     * @dev Khách thuê gửi yêu cầu thuê một phòng cụ thể.
     */
    function thuePhong(uint _roomId, uint _rentPrice) public payable {
        require(_roomId <= roomCount && _roomId > 0, "Phong khong ton tai!");
        require(rooms[_roomId].isAvailable, "Phong nay hien khong san sang!");
        require(msg.sender != rooms[_roomId].owner, "Chu nha khong the thue phong cua chinh minh!");
        require(msg.value > 0, "Yeu cau tien dat coc!");

        contractCount++;
        contracts[contractCount] = RentalContract({
            id: contractCount,
            roomId: _roomId,
            landlord: rooms[_roomId].owner,
            tenant: msg.sender,
            rentPrice: _rentPrice,
            deposit: msg.value,
            status: Status.Pending
        });

        emit RentRequested(contractCount, msg.sender, _roomId, msg.value);
    }

    /**
     * @dev Chủ nhà duyệt yêu cầu thuê.
     */
    function duyetThuePhong(uint _contractId) public onlyContractLandlord(_contractId) {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Pending, "Hop dong khong o trang thai cho duyet!");
        require(rooms[rental.roomId].isAvailable, "Phong nay da duoc cho thue hoac ngung kinh doanh!");

        rooms[rental.roomId].isAvailable = false; // Đánh dấu phòng đã có người ở
        rental.status = Status.Active;

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
        rooms[rental.roomId].isAvailable = true; // Mở lại trạng thái phòng trống
        
        uint depositToReturn = rental.deposit;
        rental.deposit = 0;

        (bool success, ) = payable(rental.tenant).call{value: depositToReturn}("");
        require(success, "Hoan tien coc that bai!");

        emit ContractEnded(_contractId, rental.tenant, depositToReturn);
    }

    // --- CÁC HÀM VIEW HỖ TRỢ FRONTEND ---

    /**
     * @dev Lấy danh sách tất cả các phòng hiện có (Để hiển thị trang chủ).
     */
    function xemTatCaPhong() public view returns (Room[] memory) {
        Room[] memory allRooms = new Room[](roomCount);
        for (uint i = 1; i <= roomCount; i++) {
            allRooms[i - 1] = rooms[i];
        }
        return allRooms;
    }

    /**
     * @dev Lấy tất cả hợp đồng liên quan đến địa chỉ ví đang kết nối.
     */
    function xemHopDongCuaToi() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender || contracts[i].landlord == msg.sender) {
                count++;
            }
        }

        RentalContract[] memory result = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender || contracts[i].landlord == msg.sender) {
                result[index] = contracts[i];
                index++;
            }
        }
        return result;
    }
}