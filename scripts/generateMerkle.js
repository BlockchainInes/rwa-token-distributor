import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const investors = [
  ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "1000000000000000000000"],
  ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "2500000000000000000000"],
  ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", "500000000000000000000"]
];

const tree = StandardMerkleTree.of(investors, ["address", "uint256"]);

console.log(tree.root);

fs.writeFileSync("scripts/merkleTree.json", JSON.stringify(tree.dump(), null, 2));

for (const [i, v] of tree.entries()) {
  if (i === 0) {
    const proof = tree.getProof(i);
    console.log(v[0]);
    console.log(v[1]);
    console.log(JSON.stringify(proof));
  }
}