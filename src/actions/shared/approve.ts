import { TOKEN_PROGRAM_ID, createApproveInstruction, createRevokeInstruction } from '@solana/spl-token';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Optional } from '../../types';

interface CreateApproveParams {
  authority: Keypair;
  account: PublicKey;
  owner: PublicKey;
  amount: number | bigint;
}

export function createApproveTxs(args: Optional<CreateApproveParams, 'authority'>) {
  const { authority = Keypair.generate(), account, owner, amount } = args;

  const createApproveTx = new Transaction().add(
    createApproveInstruction(
      account,
      authority.publicKey,
      owner,
      amount,
      [],
      TOKEN_PROGRAM_ID,
    ),
  );
  const createRevokeTx = new Transaction().add(
    createRevokeInstruction(account, owner, [], TOKEN_PROGRAM_ID),
  );
  return { authority, createApproveTx, createRevokeTx };
}
