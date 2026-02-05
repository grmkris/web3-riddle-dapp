'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contractAbi } from "@/lib/contract_abi";
import { AppKitButton } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const SMART_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState('');
  const riddle = useReadContract({
    address: SMART_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'riddle',
    query: {
      refetchInterval: 5000
    }
  })

  const isActive = useReadContract({
    address: SMART_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'isActive',
    query: {
      refetchInterval: 5000
    }
  })

  const winner = useReadContract({
    address: SMART_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'winner',
    query: {
      refetchInterval: 5000
    }
  })
  const setRiddle = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/bot', {
        method: 'POST'
      });
      queryClient.invalidateQueries();
      return response.json();
    }
  })
  const writeContract = useWriteContract();
  const waitForTransactionReceipt = useWaitForTransactionReceipt({
    hash: writeContract.data
  });

  const submitAnswer = async () => {
    await writeContract.mutateAsync({
      address: SMART_CONTRACT_ADDRESS,
      abi: contractAbi,
      functionName: 'submitAnswer',
      args: [answer]
    });
    await queryClient.invalidateQueries();
  }

  return (
    <div className="max-w-md mx-auto p-8 space-y-4">
      <AppKitButton />
      <h1 className="text-2xl font-bold">{riddle.data}</h1>
      {isActive.data && (
        <div className="flex gap-2">
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" />
          <Button onClick={() => submitAnswer()} disabled={writeContract.isPending || waitForTransactionReceipt.isLoading}>Submit</Button>
        </div>
      )}
      {winner.data && winner.data !== '0x0000000000000000000000000000000000000000' && (
        <p>Winner: {winner.data}</p>
      )}
      {!isActive.data && (
        <>
        <p>No active riddle</p>
        <Button onClick={async () => await setRiddle.mutateAsync()} disabled={setRiddle.isPending}>Set Riddle</Button>
        </>
      )}
      
    </div>
  );
}
