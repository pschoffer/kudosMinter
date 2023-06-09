// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KudosMinter is ERC721Enumerable, Ownable {
    address private _minter;
    string private _baseURIStorage;

    constructor() ERC721("Kudos", "KUDO") {
      _baseURIStorage = "https://test.com";
      _minter = 0x1C9e4a7636ea865c8D3476722bC93CADFD37eAd1;
    }

    function mint(address reciever) public{
        _mint(reciever,  totalSupply() + 1);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIStorage;
    }
    // ** Only Owner Functions **

    function setMinter(address newMinter)
        external
        onlyOwner
    {
        _minter = newMinter;
    }

     function setBaseURI(string memory baseURIStorage) external onlyOwner {
        _baseURIStorage = baseURIStorage;
    }


}
