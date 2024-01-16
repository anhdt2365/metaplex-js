import { TOKEN_PROGRAM_ID, createInitializeMintInstruction, createMintToInstruction } from '@solana/spl-token';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
import { Transaction } from '@remitano-anhdt/mpl-core';

type MintToParams = {
  mint: PublicKey;
  dest: PublicKey;
  amount: number | BN;
  authority?: PublicKey;
};

export class MintTo extends Transaction {
  constructor(options: TransactionCtorFields, params: MintToParams) {
    const { feePayer } = options;
    const { mint, dest, authority, amount } = params;

    super(options);

    this.add(
      createMintToInstruction(
        mint,
        dest,
        authority ?? feePayer,
        new BN(amount).toNumber(),
        [],
        TOKEN_PROGRAM_ID,
      ),
    );
  }
}
