pragma solidity 0.4.23;

contract searchContract
{
    uint searchCostVule = 500; //pay for each search
    // struct searchMetadata{
    //     string name;
    //     string id;
    // }
    // event searchRequire(searchMetadata searchData);
    event searchRequire(string name,string id);

    modifier searchCost{
        require(msg.value >= searchCostVule);
        _;
        if(msg.value > searchCostVule){
            msg.sender.transfer(msg.value - searchCostVule);
        }
    }
    
    mapping(address => uint) unsettledTimes;
    function search(string memory name,string memory id) searchCost public payable{
        unsettledTimes[msg.sender]++;
        emit searchRequire(name,id);
    }
    
    //Settlement
    address owner;
    constructor() public{
        owner = msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    address[] users;
    function addUser(address newUser)public onlyOwner returns(uint){
        users.push(newUser);
        return users.length;
    }
    function userNum()view public returns(uint){
        return users.length;
    }
    
    event moneyRequireEvent(address requirer, address indexed target);
    function moneyRequire(address target)public{
        require(unsettledTimes[target]>=0);
        emit moneyRequireEvent(msg.sender,target);
    }
    function moneyApprove(address target)public{
        target.transfer(searchCostVule);
        unsettledTimes[msg.sender]--;
    }
}