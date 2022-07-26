import { providers, Signer } from "ethers";
import { DelphsTable, DelphsTable__factory } from "../../contracts/typechain";
import { memoize } from "../utils/memoize";
import multicallWrapper from "../utils/multicallWrapper";
import { addresses } from "../utils/networks";

export const DELPHS_TABLE_ADDRESS = addresses().DelphsTable

export const delphsContract = memoize((signer: Signer, provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider);
  const unwrapped = DelphsTable__factory.connect(DELPHS_TABLE_ADDRESS, signer);
  const wrapped = multiCall.syncWrap<DelphsTable>(unwrapped);
  return wrapped;
});
