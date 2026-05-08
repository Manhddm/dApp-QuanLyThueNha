// SPDX-License-Identifier: MIT
/* 
- Câu GHI, dùng Storage
- Câu ĐỌC, truy cập ít field, không cần dùng
- Câu ĐỌC, truy cập nhiều field, dùng storage
 */
pragma solidity >=0.8.0 <0.9.0;

contract RentHouse {
    // Không còn landlord toàn cục — mỗi hợp đồng có landlord riêng

    enum Status { Pending, Active, Ended, Rejected }

    struct RentalContract {
        uint id;
        uint roomId;
        address landlord;   // Chủ nhà của phòng đó
        address tenant;
        uint rentPrice;
        uint deposit;
        Status status;
    }

    struct PaymentRecord {
        uint contractId;
        address tenant;
        uint roomId;
        uint rentPrice;
        bool paid;
    }

    uint public contractCount;
    mapping(uint => RentalContract) public contracts;
    mapping(uint => mapping(uint => bool)) public paymentTracking;
    mapping(uint => bool) public phongDaDuocThue; // roomId → đã có người thuê chưa

    event RentRequested(uint indexed contractId, address indexed tenant, address indexed landlord, uint roomId, uint deposit);
    event RentApproved(uint indexed contractId, address indexed tenant, uint roomId);
    event RentRejected(uint indexed contractId, address indexed tenant, uint depositReturned);
    event RentPaid(uint indexed contractId, address indexed tenant, uint amount, uint thangNam);
    event ContractEnded(uint indexed contractId, address indexed tenant, uint depositReturned);

    constructor() {
        contractCount = 0;
    }

    // Khách thuê gọi hàm này để yêu cầu thuê phòng (kèm tiền cọc)
    // _landlord: địa chỉ ví của chủ nhà sở hữu phòng đó (lấy từ DB)
    function thuePhong(uint _roomId, uint _rentPrice, address _landlord) public payable {
        require(msg.sender != address(0), unicode"Địa chỉ người thuê không hợp lệ !");
        require(_landlord != address(0), unicode"Địa chỉ chủ nhà không hợp lệ !");
        require(msg.sender != _landlord, unicode"Chủ nhà không thể tự thuê phòng của mình !");
        require(msg.value > 0, unicode"Phải gửi kèm tiền cọc !");

        contractCount++;
        contracts[contractCount] = RentalContract({
            id: contractCount,
            roomId: _roomId,
            landlord: _landlord,
            tenant: msg.sender,
            rentPrice: _rentPrice,
            deposit: msg.value,
            status: Status.Pending
        });

        emit RentRequested(contractCount, msg.sender, _landlord, _roomId, msg.value);
    }

    // Chủ nhà duyệt hợp đồng — chỉ chủ nhà của phòng đó mới được duyệt
    function duyetThuePhong(uint _contractId) public {
        require(contracts[_contractId].landlord == msg.sender, unicode"Chỉ chủ nhà của phòng này mới được duyệt !");
        require(contracts[_contractId].status == Status.Pending, unicode"Hợp đồng không ở trạng thái chờ duyệt !");

        uint roomId = contracts[_contractId].roomId;
        require(!phongDaDuocThue[roomId], unicode"Phòng này đã có người thuê rồi !");

        phongDaDuocThue[roomId] = true;
        contracts[_contractId].status = Status.Active;

        emit RentApproved(_contractId, contracts[_contractId].tenant, roomId);
    }

    // Chủ nhà từ chối yêu cầu thuê — tự động hoàn cọc cho khách
    function tuChoiThuePhong(uint _contractId) public {
        require(contracts[_contractId].landlord == msg.sender, unicode"Chỉ chủ nhà của phòng này mới được từ chối !");
        require(contracts[_contractId].status == Status.Pending, unicode"Hợp đồng không ở trạng thái chờ duyệt !");

        contracts[_contractId].status = Status.Rejected;

        uint depositToReturn = contracts[_contractId].deposit;
        contracts[_contractId].deposit = 0;

        payable(contracts[_contractId].tenant).transfer(depositToReturn);

        emit RentRejected(_contractId, contracts[_contractId].tenant, depositToReturn);
    }

    // Người thuê thanh toán tiền nhà hàng tháng
    function thanhToanThang(uint _contractId, uint _thangNam) public payable {
        RentalContract storage rental = contracts[_contractId];

        require(rental.status == Status.Active, unicode"Hợp đồng không đang hoạt động !");
        require(msg.sender == rental.tenant, unicode"Chỉ người thuê mới được thanh toán !");
        require(msg.value == rental.rentPrice, unicode"Số tiền không chính xác !");
        require(!paymentTracking[_contractId][_thangNam], unicode"Tháng này đã thanh toán rồi !");

        paymentTracking[_contractId][_thangNam] = true;
        payable(rental.landlord).transfer(msg.value);

        emit RentPaid(_contractId, msg.sender, msg.value, _thangNam);
    }

    // Người thuê trả phòng — nhận lại tiền cọc
    function traPhong(uint _contractId) public {
        RentalContract storage rental = contracts[_contractId];

        require(rental.status == Status.Active, unicode"Hợp đồng không đang hoạt động !");
        require(msg.sender == rental.tenant, unicode"Chỉ người thuê mới được trả phòng !");

        rental.status = Status.Ended;

        uint depositToReturn = rental.deposit;
        rental.deposit = 0;

        payable(msg.sender).transfer(depositToReturn);

        emit ContractEnded(_contractId, msg.sender, depositToReturn);
    }

    // Người thuê xem hợp đồng của mình
    function xemHopDong() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender) count++;
        }
        RentalContract[] memory myContracts = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender) {
                myContracts[index++] = contracts[i];
            }
        }
        return myContracts;
    }

    // Chủ nhà xem tất cả hợp đồng của phòng mình
    function danhSachHopDong() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].landlord == msg.sender) count++;
        }
        RentalContract[] memory myContracts = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].landlord == msg.sender) {
                myContracts[index++] = contracts[i];
            }
        }
        return myContracts;
    }

    // Chủ nhà xem hợp đồng đang chờ duyệt của phòng mình
    function danhSachChoDuyet() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].landlord == msg.sender && contracts[i].status == Status.Pending) count++;
        }
        RentalContract[] memory pendingContracts = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].landlord == msg.sender && contracts[i].status == Status.Pending) {
                pendingContracts[index++] = contracts[i];
            }
        }
        return pendingContracts;
    }

    // ===================== THEO DÕI THANH TOÁN =====================

    function kiemTraThanhToan(uint _contractId, uint _thangNam) public view returns (bool) {
        return paymentTracking[_contractId][_thangNam];
    }

    // Chủ nhà xem theo dõi thanh toán tháng của các HĐ Active thuộc phòng mình
    function theoDoiThanhToan(uint _thangNam) public view returns (PaymentRecord[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].landlord == msg.sender && contracts[i].status == Status.Active) count++;
        }
        PaymentRecord[] memory records = new PaymentRecord[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].landlord == msg.sender && contracts[i].status == Status.Active) {
                records[index++] = PaymentRecord({
                    contractId: contracts[i].id,
                    tenant: contracts[i].tenant,
                    roomId: contracts[i].roomId,
                    rentPrice: contracts[i].rentPrice,
                    paid: paymentTracking[i][_thangNam]
                });
            }
        }
        return records;
    }

    // Người thuê / chủ nhà xem lịch sử thanh toán
    function xemLichSuThanhToan(uint _contractId, uint[] memory _danhSachThang) public view returns (bool[] memory) {
        RentalContract storage rental = contracts[_contractId];
        require(msg.sender == rental.tenant || msg.sender == rental.landlord, unicode"Không có quyền xem !");

        bool[] memory results = new bool[](_danhSachThang.length);
        for (uint i = 0; i < _danhSachThang.length; i++) {
            results[i] = paymentTracking[_contractId][_danhSachThang[i]];
        }
        return results;
    }
}