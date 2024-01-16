import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { CreateAssociatedTokenAccount, CreateMint, MintTo } from '../../transactions';
import { Transaction } from '@remitano-anhdt/mpl-core';

interface MintTxs {
  mint: Keypair;
  // recipient ATA
  recipient: PublicKey;
  createMintTx: Transaction;
  createAssociatedTokenAccountTx: Transaction;
  mintToTx: Transaction;
}

export async function prepareTokenAccountAndMintTxs(
  connection: Connection,
  owner: PublicKey,
): Promise<MintTxs> {
  const mint = Keypair.generate();
  const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
  const createMintTx = new CreateMint(
    { feePayer: owner },
    {
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
    },
  );

  const recipient = await getAssociatedTokenAddress(
    mint.publicKey,
    owner,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const createAssociatedTokenAccountTx = new CreateAssociatedTokenAccount(
    { feePayer: owner },
    {
      associatedTokenAddress: recipient,
      splTokenMintAddress: mint.publicKey,
    },
  );

  const mintToTx = new MintTo(
    { feePayer: owner },
    {
      mint: mint.publicKey,
      dest: recipient,
      amount: 1,
    },
  );

  return { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient };
}
