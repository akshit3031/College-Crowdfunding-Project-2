// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CollegeCampaignFactory {
    address public admin;
    address[] public deployedCampaigns;
    mapping(address => bool) public teachers;

    constructor() {
        admin = msg.sender; // admin can add teachers
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    // Add a teacher
    function addTeacher(address _teacher) external onlyAdmin {
        teachers[_teacher] = true;
    }

    // Remove a teacher
    function removeTeacher(address _teacher) external onlyAdmin {
        teachers[_teacher] = false;
    }

    // Create a new student campaign using new keyword (avoiding import)
    function createCampaign(
        uint minimumContribution,
        string memory title,
        string memory description,
        string memory image,
        uint targetAmount,
        string memory studentRoll
    ) external {
        // Deploy new campaign contract without importing
        CollegeCampaign newCampaign = new CollegeCampaign(
            minimumContribution,
            msg.sender,
            title,
            description,
            image,
            targetAmount,
            studentRoll,
            address(this)
        );
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedCampaigns;
    }
}

// Define the CollegeCampaign contract in the same file to avoid circular imports
contract CollegeCampaign {
    struct WithdrawalRequest {
        string description;
        uint value;
        address recipient;
        bool completed;
        uint approvalCount;
    }

    address public student;
    string public studentRollNumber;
    string public title;
    string public description;
    string public imageUrl;
    uint public targetAmount;
    uint public minimumContribution;
    address public factory;

    mapping(address => bool) public contributors;
    uint public contributorsCount;

    WithdrawalRequest[] public requests;
    // mapping: request index => teacher address => approved
    mapping(uint => mapping(address => bool)) public approvals;

    modifier onlyStudent() {
        require(msg.sender == student, "Only student can call this");
        _;
    }

    modifier onlyTeacher() {
        // Use interface call to factory to check if sender is teacher
        (bool success, bytes memory data) = factory.staticcall(
            abi.encodeWithSignature("teachers(address)", msg.sender)
        );
        require(success && abi.decode(data, (bool)), "Only teacher can call this");
        _;
    }

    constructor(
        uint _minimum,
        address _student,
        string memory _title,
        string memory _description,
        string memory _image,
        uint _target,
        string memory _roll,
        address factoryAddress
    ) {
        minimumContribution = _minimum;
        student = _student;
        title = _title;
        description = _description;
        imageUrl = _image;
        targetAmount = _target;
        studentRollNumber = _roll;
        factory = factoryAddress;
    }

    // Anyone can contribute
    function contribute() external payable {
        require(msg.value >= minimumContribution, "Contribution too small");

        if (!contributors[msg.sender]) {
            contributors[msg.sender] = true;
            contributorsCount++;
        }
    }

    // Student creates withdrawal request
    function createWithdrawalRequest(string memory _description, uint _value, address _recipient) external onlyStudent {
        require(_value <= address(this).balance, "Insufficient funds");
        requests.push(WithdrawalRequest({
            description: _description,
            value: _value,
            recipient: _recipient,
            completed: false,
            approvalCount: 0
        }));
    }

    // Teacher approves a request
    function approveRequest(uint index) external onlyTeacher {
        WithdrawalRequest storage request = requests[index];
        require(!approvals[index][msg.sender], "Already approved");

        approvals[index][msg.sender] = true;
        request.approvalCount++;
    }

    // Student finalizes request once enough teachers approve
    function finalizeRequest(uint index) external onlyStudent {
        WithdrawalRequest storage request = requests[index];
        require(!request.completed, "Request already completed");
        require(request.approvalCount > 0, "Need at least one teacher approval");

        payable(request.recipient).transfer(request.value);
        request.completed = true;
    }

    // View number of requests
    function getRequestsCount() external view returns (uint) {
        return requests.length;
    }

    // Get campaign summary
    function getSummary()
        external
        view
        returns (
            uint,
            uint,
            uint,
            address,
            string memory,
            string memory,
            string memory,
            uint
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            student,
            title,
            description,
            imageUrl,
            targetAmount
        );
    }
}