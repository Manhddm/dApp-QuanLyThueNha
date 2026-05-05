// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract RentHouse {
    address public landlord;

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
    mapping(uint => bool) public phongDaDuocThue;

    event RentRequested(uint indexed contractId, address indexed tenant, uint roomId, uint deposit);
    event RentApproved(uint indexed contractId, address indexed tenant, uint roomId);
    event RentRejected(uint indexed contractId, address indexed tenant, uint depositReturned);
    event RentPaid(uint indexed contractId, address indexed tenant, uint amount, uint thangNam);
    event ContractEnded(uint indexed contractId, address indexed tenant, uint depositReturned);

    constructor() {
        landlord = msg.sender;
        contractCount = 0;
    }

    modifier onlyLandlord() {
        // Bỏ unicode, dùng string thường
        require(msg.sender == landlord, "Chi co chu nha moi goi duoc ham nay!");
        _;
    }

    function thuePhong(uint _roomId, uint _rentPrice) public payable {
        require(msg.sender != address(0), "Dia chi nguoi thue phai khac 0!");
        
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

    function duyetThuePhong(uint _contractId) public onlyLandlord {
        require(contracts[_contractId].status == Status.Pending, "Hop dong khong o trang thai cho duyet!");
        uint roomId = contracts[_contractId].roomId;
        require(!phongDaDuocThue[roomId], "Phong nay da co nguoi thue roi!");
        phongDaDuocThue[roomId] = true;
        contracts[_contractId].status = Status.Active;
        emit RentApproved(_contractId, contracts[_contractId].tenant, contracts[_contractId].roomId);
    }

    function tuChoiThuePhong(uint _contractId) public onlyLandlord {
        require(contracts[_contractId].status == Status.Pending, "Hop dong khong o trang thai cho duyet!");
        contracts[_contractId].status = Status.Rejected;
        uint depositToReturn = contracts[_contractId].deposit;
        contracts[_contractId].deposit = 0;
        payable(contracts[_contractId].tenant).transfer(depositToReturn);
        emit RentRejected(_contractId, contracts[_contractId].tenant, depositToReturn);
    }

    function thanhToanThang(uint _contractId, uint _thangNam) public payable {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Active, "Hop dong khong hoat dong!");
        require(msg.sender == rental.tenant, "Chi nguoi thue moi tra tien duoc!");
        require(msg.value == rental.rentPrice, "So tien khong chinh xac!");
        require(!paymentTracking[_contractId][_thangNam], "Thang nay da thanh toan roi!");
        paymentTracking[_contractId][_thangNam] = true;
        payable(rental.landlord).transfer(msg.value);
        emit RentPaid(_contractId, msg.sender, msg.value, _thangNam);
    }

    function traPhong(uint _contractId) public {
        RentalContract storage rental = contracts[_contractId];
        require(rental.status == Status.Active, "Hop dong khong hoat dong!");
        require(msg.sender == rental.tenant, "Chi nguoi thue moi tra phong duoc!");
        rental.status = Status.Ended;
        phongDaDuocThue[rental.roomId] = false; // mở lại phòng
        uint depositToReturn = rental.deposit;
        rental.deposit = 0;
        payable(msg.sender).transfer(depositToReturn);
        emit ContractEnded(_contractId, msg.sender, depositToReturn);
    }

    function xemHopDong() public view returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == msg.sender) count++;
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

    function xemHopDongKhach(address _tenant) public view onlyLandlord returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].tenant == _tenant) count++;
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

    function danhSachHopDong() public view onlyLandlord returns (RentalContract[] memory) {
        RentalContract[] memory allContracts = new RentalContract[](contractCount);
        for (uint i = 1; i <= contractCount; i++) {
            allContracts[i - 1] = contracts[i];
        }
        return allContracts;
    }

    function danhSachChoDuyet() public view onlyLandlord returns (RentalContract[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].status == Status.Pending) count++;
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

    function kiemTraThanhToan(uint _contractId, uint _thangNam) public view returns (bool) {
        return paymentTracking[_contractId][_thangNam];
    }

    function theoDoiThanhToan(uint _thangNam) public view onlyLandlord returns (PaymentRecord[] memory) {
        uint count = 0;
        for (uint i = 1; i <= contractCount; i++) {
            if (contracts[i].status == Status.Active) count++;
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

    function xemLichSuThanhToan(uint _contractId, uint[] memory _danhSachThang) public view returns (bool[] memory) {
        RentalContract storage rental = contracts[_contractId];
        require(msg.sender == rental.tenant || msg.sender == landlord, "Khong co quyen xem!");
        bool[] memory results = new bool[](_danhSachThang.length);
        for (uint i = 0; i < _danhSachThang.length; i++) {
            results[i] = paymentTracking[_contractId][_danhSachThang[i]];
        }
        return results;
    }
}