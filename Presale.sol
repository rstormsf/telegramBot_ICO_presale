pragma solidity ^0.4.17;

contract Presale {
    uint256 public startTime;
    uint256 public endTime;
    uint256 public cap;
    uint256 public rate;
    bool public isInitialized = false;
    mapping(address => uint256) public investorBalances;
    
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    address public owner;
    
    function () payable {
        buy();
    }
    
    function Presale() {
        owner = msg.sender;
    }
    
    function initialize(address _owner, uint256 _startTime, uint256 _endTime, uint256 _cap) {
        require(!isInitialized);
        owner = _owner;
        startTime = _startTime;
        endTime = _endTime;
        cap = _cap;
        isInitialized = true;
    }
    event Debug(uint a);
    
    function buy() public payable {
        require(msg.value > 0);
        require(isInitialized);
        address investor = msg.sender;
        investorBalances[investor] += msg.value;
        forwardFunds(msg.value);
    }
    
    
    function forwardFunds(uint256 _amount) internal {
        owner.transfer(_amount);
    }
    
    function setExchangeRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }
    
    function withdraw() public onlyOwner {
           
    }
}
