import { Transaction } from '@remitano-anhdt/mpl-core';
import { AccountLayout, NATIVE_MINT, TOKEN_PROGRAM_ID, createCloseAccountInstruction } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { CreateTokenAccount } from '../../transactions/CreateTokenAccount';

interface WrappedAccountTxs {
  account: Keypair;
  createTokenAccountTx: Transaction;
  closeTokenAccountTx: Transaction;
}

export async function createWrappedAccountTxs(
  connection: Connection,
  owner: PublicKey,
  amount = 0,
): Promise<WrappedAccountTxs> {
  const account = Keypair.generate();
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  const createTokenAccountTx = new CreateTokenAccount(
    { feePayer: owner },
    {
      newAccountPubkey: account.publicKey,
      lamports: amount + accountRentExempt,
      mint: NATIVE_MINT,
    },
  );
  const closeTokenAccountTx = new Transaction().add(
    createCloseAccountInstruction(account.publicKey, owner, owner, []),
  );
  return { account, createTokenAccountTx, closeTokenAccountTx };
}
