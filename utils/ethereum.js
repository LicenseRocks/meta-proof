import { ethers } from "ethers";
import ERC1155 from "../contracts/ropsten/ERC1155.json";

//
// Test this file by running: http://localhost:3000/?id=123
// We need to have contract per each network as their addresses are different
// I think we have to options:
// - add built contracts to project as JSON
// - pass contract address via GET params

// const ethereumNetworkId = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK_ID;
// const contractAddr = ERC1155.networks[ethereumNetworkId].address;
const providerUrls = {
  ropsten:
    "https://eth-ropsten.alchemyapi.io/v2/mxlKqKI5tfDXjwlJLQDgP90fUJWXnJ4L"
};

// const contractAddr = "0x1710Da7B9F57F599C7e9a8E0Ca3e011B3a504Cf7"; // get from params or JSON

const getLicenseInfo = async (id, contractAddr, network) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      providerUrls[network]
    );
    const contract = new ethers.Contract(contractAddr, ERC1155.abi, provider);
    const fileURIs = await contract.getFiles(parseInt(id, 10));
    const lastFileURI = fileURIs[fileURIs.length - 1];
    const response = await fetch(lastFileURI);
    const license = await response.json(); // parse DIN json

    return { license, fileURIs, errorMessage: null };
  } catch (err) {
    console.log('error here', err)
    return { license: null, fileURIs: [], errorMessage: err.message };
  }
};

export { ethers, getLicenseInfo };
