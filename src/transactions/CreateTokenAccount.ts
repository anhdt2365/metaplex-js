import { Transaction } from '@remitano-anhdt/mpl-core';
import { AccountLayout, TOKEN_PROGRAM_ID, createInitializeAccountInstruction, createInitializeInstruction } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionCtorFields } from '@solana/web3.js';

type CreateTokenAccountParams = {
  newAccountPubkey: PublicKey;
  lamports: number;
  mint: PublicKey;
  owner?: PublicKey;
};

export class CreateTokenAccount extends Transaction {
  constructor(options: TransactionCtorFields, params: CreateTokenAccountParams) {
    const { feePayer } = options;
    const { newAccountPubkey, lamports, mint, owner } = params;

    super(options);

    this.add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey,
        lamports,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );

    this.add(
      createInitializeAccountInstruction(
        newAccountPubkey,
        mint,
        owner ?? feePayer,
        TOKEN_PROGRAM_ID,
      ),
    );
  }
}
