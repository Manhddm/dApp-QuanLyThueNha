// SPDX-License-Identifier: MIT
/* 
- Câu GHI, dùng Storage
- Câu ĐỌC, truy cập ít field, không cần dùng
- Câu ĐỌC, truy cập nhiều field, dùng storage
 */
pragma solidity >=0.8.0 <0.9.0;

contract RentHouse {
    address public landlord;

    enum Status { Pending, Active, Ended, Rejected } // Trạng thái hợp đồng cố định

    struct RentalContract {
        uint id;
        uint roomId;
        address landlord;
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
        bool paid; // true = đã đóng, false = chưa đóng
    }

    uint public contractCount; // Đếm tổng số hợp đồng
    mapping(uint => RentalContract) public contracts; // Bảng tra cứu id -> hợp đồng

    // Theo dõi thanh toán: contractId => thangNam (VD: 202604) => đã thanh toán?
    mapping(uint => mapping(uint => bool)) public paymentTracking;

    event RentRequested(uint indexed contractId, address indexed tenant, uint roomId, uint deposit); //Sự kiện Yêu cầu thuê
    event RentApproved(uint indexed contractId, address indexed tenant, uint roomId); // Sự kiện Duyệt yêu cầu thuê
    event RentRejected(uint indexed contractId, address indexed tenant, uint depositReturned); // Sự kiện Từ chối yêu cầu thuê
    event RentPaid(uint indexed contractId, address indexed tenant, uint amount, uint thangNam); // Sự kiện Trả tiền thuê
    event ContractEnded(uint indexed contractId, address indexed tenant, uint depositReturned); // Sự kiện Hợp đồng kết thúc

    // Hàm tạo
    constructor() {
        landlord = msg.sender;
        contractCount = 0;
    }

    // Bảo vệ các hàm dành cho chủ nhà - chỉ chủ nhà mới gọi được
    modifier onlyLandlord() {
        require(msg.sender == landlord, unicode"Chỉ có chủ nhà mới gọi được hàm này !");
        _;
    }

    // Khách gọi hàm này để yêu cầu thuê phòng (kèm theo tiền cọc)
    function thuePhong(uint _roomId, uint _rentPrice) public payable {
        require(msg.sender != address(0), unicode"Địa chỉ của người thuê phải khác 0 !");
        
        contractCount++;
        contracts[contractCount] = RentalContract({
            id: contractCount,
            roomId: _roomId,
            landlord: landlord,
            tenant: msg.sender,
            rentPrice: _rentPrice,
            deposit: msg.value,
            status: Status.Pending
        });

        emit RentRequested(contractCount, msg.sender, _roomId, msg.value);
    }

    // Chủ nhà duyệt cho thuê phòng
    function duyetThuePhong(uint _contractId) public onlyLandlord {
        require(contracts[_contractId].status == Status.Pending, unicode"Hợp đồng không ở trạng thái chờ duyệt !");
        
        contracts[_contractId].status = Status.Active;
        emit RentApproved(_contractId, contracts[_contractId].tenant, contracts[_contractId].roomId);
    }

    // Chủ nhà từ chối yêu cầu thuê và hoàn cọc
    function tuChoiThuePhong(uint _contractId) public onlyLandlord {
        require(contracts[_contractId].status == Status.Pending, unicode"Hợp đồng không ở trạng thái chờ duyệt !");
        
        contracts[_contractId].status = Status.Rejected;
        
        uint depositToReturn = contracts[_contractId].deposit;
        contracts[_contractId].deposit = 0;
        
        payable(contracts[_contractId].tenant).transfer(depositToReturn);
        
        emit RentRejected(_contractId, contracts[_contractId].tenant, depositToReturn);
    }

    // Người thuê thanh toán tiền nhà hàng tháng
    // _thangNam: tháng thanh toán dạng YYYYMM (VD: 202604 = tháng 4 năm 2026)
    function thanhToanThang(uint _contractId, uint _thangNam) public payable {
        RentalContract storage rental = contracts[_contractId];

        require(rental.status == Status.Active, unicode"Hợp đồng thuê hiện không hoạt động !"); 
        require(msg.sender == rental.tenant, unicode"Chỉ người thuê nhà mới có thể trả tiền thuê nhà !");
        require(msg.value == rental.rentPrice, unicode"Số tiền thuê nhà không chính xác !");
        require(!paymentTracking[_contractId][_thangNam], unicode"Tháng này đã được thanh toán rồi !");

        // Ghi nhận thanh toán
        paymentTracking[_contractId][_thangNam] = true;

        payable(rental.landlord).transfer(msg.value);

        emit RentPaid(_contractId, msg.sender, msg.value, _thangNam);
    }

    // Người thuê trả phòng và nhận lại tiền cọc
    function traPhong(uint _contractId) public {
        RentalContract storage rental = contracts[_contractId];

        require(rental.status == Status.Active, unicode"Hợp đồng thuê hiện không hoạt động !");
        require(msg.sender == rental.tenant, unicode"Chỉ người thuê nhà mới có thể trả phòng !");

        rental.status = Status.Ended;
        
        uint depositToReturn = rental.deposit;
        rental.deposit = 0; 

        payable(msg.sender).transfer(depositToReturn);

        emit ContractEnded(_contractId, msg.sender, depositToReturn);
    }

    // Người thuê xem danh sách các hợp đồng của mình
    function xemHopDong() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender) {
                count++;
            }
        }
        RentalContract[] memory myContracts = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender) {
                myContracts[index] = contracts[i];
                index++;
            }
        }
        return myContracts;
    }

    // Chủ nhà xem danh sách hợp đồng của một người cụ thể
    function xemHopDongKhach(address _tenant) public view onlyLandlord returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == _tenant) {
                count++;
            }
        }
        RentalContract[] memory theirContracts = new RentalContract[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == _tenant) {
                theirContracts[index] = contracts[i];
                index++;
            }
        }
        return theirContracts;
    }

    // Chủ nhà xem danh sách tất cả hợp đồng
    function danhSachHopDong() public view onlyLandlord returns (RentalContract[] memory) {
        RentalContract[] memory allContracts = new RentalContract[](contractCount);
        for (uint i = 1; i <= contractCount; i++) {
            allContracts[i - 1] = contracts[i];
        }
        return allContracts;
    }

    // Chủ nhà xem danh sách hợp đồng đang chờ duyệt
function danhSachChoDuyet() public view onlyLandlord returns (RentalContract[] memory) {
    uint count = 0;
    for (uint i = 1; i <= contractCount; i++) {
        if (contracts[i].status == Status.Pending) {
            count++;
        }
    }

    // Hàm xem danh sách người thuê đang chờ duyệt
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

    // ===================== THEO DÕI THANH TOÁN =====================

    // Kiểm tra 1 hợp đồng cụ thể đã thanh toán tháng đó chưa
    function kiemTraThanhToan(uint _contractId, uint _thangNam) public view returns (bool) {
        return paymentTracking[_contractId][_thangNam];
    }

    // Chủ nhà xem danh sách theo dõi thanh toán của tất cả hợp đồng Active trong 1 tháng
    // Trả về danh sách PaymentRecord (contractId, tenant, roomId, rentPrice, paid)
    function theoDoiThanhToan(uint _thangNam) public view onlyLandlord returns (PaymentRecord[] memory) {
        // Đếm số hợp đồng Active
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].status == Status.Active) {
                count++;
            }
        }

        PaymentRecord[] memory records = new PaymentRecord[](count);
        uint index = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].status == Status.Active) {
                records[index] = PaymentRecord({
                    contractId: contracts[i].id,
                    tenant: contracts[i].tenant,
                    roomId: contracts[i].roomId,
                    rentPrice: contracts[i].rentPrice,
                    paid: paymentTracking[i][_thangNam]
                });
                index++;
            }
        }
        return records;
    }

    // Người thuê xem lịch sử thanh toán của mình cho nhiều tháng
    // _danhSachThang: mảng các tháng cần kiểm tra (VD: [202601, 202602, 202603, 202604])
    function xemLichSuThanhToan(uint _contractId, uint[] memory _danhSachThang) public view returns (bool[] memory) {
        RentalContract storage rental = contracts[_contractId];
        require(msg.sender == rental.tenant || msg.sender == landlord, unicode"Không có quyền xem !");

        bool[] memory results = new bool[](_danhSachThang.length);
        for (uint i = 0; i < _danhSachThang.length; i++) {
            results[i] = paymentTracking[_contractId][_danhSachThang[i]];
        }
        return results;
    }
}