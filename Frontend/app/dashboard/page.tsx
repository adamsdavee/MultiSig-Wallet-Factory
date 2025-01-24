"use client";

import { useState } from "react";
import { Search, LoaderIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { client } from "../client";
import { useActiveAccount, ConnectButton} from "thirdweb/react";
import MultiSigCreationModal from "../create/multisigcreation";
import Data from "./Data";


export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [wallet, setWallet] = useState<{ walletAddress: string; timeCreated: bigint; balance: bigint; }[]>([]);;


  const activeAccount = useActiveAccount();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl font-bold">Wallet Dashboard</h1>
        {/* <MultiSigCreationModal /> */}
        {activeAccount?.address ? (
          <MultiSigCreationModal />
        ) : (
          <ConnectButton client={client} />
        )}
      </div>

      <div className="mb-8">
        <p className="text-lg mb-2">Connected Wallet:</p>
        <p className="text-neon-green">
          {activeAccount?.address || "Not Connected"}
        </p>
      </div>
        <Data setWallet={setWallet}/>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search wallets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-4 bg-blue-800 border-blue-700 text-white placeholder-gray-400"
          />
          <Button className="bg-neon-green text-blue-900 hover:bg-neon-green/90">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {wallet.map((wallet, index) => (
    <Card
      key={index}
      className="bg-blue-800 border-blue-700 hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <CardTitle className="text-neon-green break-words text-sm">
          {wallet.walletAddress}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Created on: {wallet.timeCreated}</p>
        <p className="font-semibold">Balance: {wallet.balance}</p>
      </CardContent>
    </Card>
  ))}
</div>

      </div>
    </DashboardLayout>
  );
}
