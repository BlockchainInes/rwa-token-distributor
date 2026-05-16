// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RWADistributor is Ownable {
    IERC20 public immutable token;
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed investor, uint256 amount);
    event RootUpdated(bytes32 indexed oldRoot, bytes32 indexed newRoot);

    constructor(address _token, bytes32 _merkleRoot) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    function claim(bytes32[] calldata proof, uint256 amount) external {
        require(!hasClaimed[msg.sender], "RWA: Payout already claimed");

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));

        require(MerkleProof.verify(proof, merkleRoot, leaf), "RWA: Invalid Merkle Proof. Verification failed.");

        hasClaimed[msg.sender] = true;

        require(token.transfer(msg.sender, amount), "RWA: Token transfer failed");

        emit Claimed(msg.sender, amount);
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        bytes32 oldRoot = merkleRoot;
        merkleRoot = _newMerkleRoot;
        emit RootUpdated(oldRoot, _newMerkleRoot);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Emergency withdraw failed");
    }
}