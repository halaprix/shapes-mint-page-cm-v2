import {
  PublicKey,
  Connection,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  MemcmpFilter,
  DataSizeFilter,
} from "@solana/web3.js";
// @ts-ignore
import fetch from "node-fetch";
import { AnchorWallet } from "@solana/wallet-adapter-react";

var tempData: any;

/* const METADATA_PUBKEY = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
) */
const TOKEN_PUBKEY = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

//export async function getNft()

export const checkWLToken = async (
  connection: Connection,
  userAddress: any,
  wltTokenAddress: any
): Promise<any> => {
  try {
    let filter: MemcmpFilter = {
      memcmp: {
        offset: 32,
        bytes: userAddress?.toBase58(),
      },
    };
    let filter2: DataSizeFilter = {
      dataSize: 165,
    };
    let getFilter: GetProgramAccountsFilter[] = [filter, filter2];
    let programAccountsConfig: GetProgramAccountsConfig = {
      filters: getFilter,
    };
    let _listOfTokens = await connection.getProgramAccounts(
      TOKEN_PUBKEY,
      programAccountsConfig
    );

    // we get frist 32 bytes as per
    // https://github.com/solana-labs/solana-program-library/blob/08d9999f997a8bf38719679be9d572f119d0d960/token/program/src/state.rs#L86-L106
    // mint is the first hence we start at 0 byte
    let arrayOfTokens = [];
    for (let i = 0; i < _listOfTokens.length; i++) {
      let _mint = new PublicKey(
        _listOfTokens[i]["account"]["data"].slice(0, 32)
      );

      arrayOfTokens.push(_mint.toBase58());
    }

    let userHasWhitelistToken;
    arrayOfTokens.includes(wltTokenAddress.toBase58())
      ? (userHasWhitelistToken = true)
      : (userHasWhitelistToken = false);

    return userHasWhitelistToken;
  } catch (e) {
    console.log(e);
  }
};

//getNft()
