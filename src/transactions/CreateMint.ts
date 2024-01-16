import { Transaction } from '@remitano-anhdt/mpl-core';
import { MintLayout, TOKEN_PROGRAM_ID, createInitializeMintInstruction } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionCtorFields } from '@solana/web3.js';

type CreateMintParams = {
  newAccountPubkey: PublicKey;
  lamports: number;
  decimals?: number;
  owner?: PublicKey;
  freezeAuthority?: PublicKey;
};

export class CreateMint extends Transaction {
  constructor(options: TransactionCtorFields, params: CreateMintParams) {
    const { feePayer } = options;
    const { newAccountPubkey, lamports, decimals, owner, freezeAuthority } = params;

    super(options);

    this.add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey,
        lamports,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );

    this.add(
      createInitializeMintInstruction(
        newAccountPubkey,
        decimals ?? 0,
        owner ?? feePayer,
        freezeAuthority ?? feePayer,
        TOKEN_PROGRAM_ID,
      ),
    );
  }
}
