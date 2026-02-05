export const maxDuration = 60;

import { contractAbi } from "@/lib/contract_abi";
import { createPublicClient, http, createWalletClient, keccak256, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const privateKey = process.env.BOT_PRIVATE_KEY as `0x${string}`;
const RIDDLES = [
  {
    question: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no cars drive there. What am I?",
    answer: "map",
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
  },
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "echo",
  },
  {
    question: "What has keys but no locks, space but no room, and you can enter but can't go inside?",
    answer: "keyboard",
  },
  {
    question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
    answer: "fire",
  },
];
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS as `0x${string}`;
export async function POST() {
  const account = privateKeyToAccount(privateKey);
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.RPC_URL),
  });
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.RPC_URL),
  });

  const isActive = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'isActive',
  });
  if (isActive) {
    return new Response('Riddle active', { status: 400 });
  }
  const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
  const riddleHash = keccak256(toHex(riddle.answer.toLowerCase()));
  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'setRiddle',
    args: [riddle.question, riddleHash],
  });
  await publicClient.waitForTransactionReceipt({
    hash: tx,
  });
  return new Response(JSON.stringify({
    transactionHash: tx,
  }), { status: 200 });
}