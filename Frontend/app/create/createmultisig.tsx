"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";
import { client } from "../client";
import { ethers } from "ethers";

// ABIs & Configs
import MultiSigFactory from "../constants/MultiSigFactory.json";
import config from "../constants/config.json";

export default function CreateMultiSigWallet() {
  const [name, setName] = useState("");
  const [owners, setOwners] = useState([""]);
  const [requiredConfirmations, setRequiredConfirmations] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [factory, setFactory] = useState<ethers.Contract | undefined>(undefined);
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);

  const handleAddOwner = () => setOwners([...owners, ""]);

  const handleOwnerChange = (index: number, value: string) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const handleRemoveOwner = (index: number) => {
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
  };

  const chain = defineChain(1115);

  const contract = getContract({
    client,
    address: "0x3c7eD317074CB301a421aCa92Ad37941f7F030F8",
    chain: chain,
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const CreateMultiSig = async (address: string[], amount: bigint) => {
    const approve = prepareContractCall({
      contract,
      method:
        "function createMultiSig(address[] memory _owners, uint256 _noOfConfirmations)",
      params: [address, amount],
    });
    return new Promise((resolve, reject) => {
      sendTransaction(approve, {
        onSuccess: () => resolve(true),
        onError: (error) => reject(error),
      });
    });
  };



  async function loadBlockchainData() {
    if (typeof (window as any).ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(provider);
      console.log("Ethereum provider detected");
      console.log(provider)

      const signer = await provider.getSigner();
      console.log(signer);
      console.log(signer.address);

      const network = await provider.getNetwork();
      console.log(network.chainId);

      const chainId = network.chainId.toString();
      const address = config[`${network.chainId}` as keyof typeof config].factory.address as string;
      console.log(address)

      const contractFactory = new ethers.Contract(address, MultiSigFactory, provider);
      console.log(contractFactory);

      setFactory(contractFactory);

      const fee = await contractFactory.getDeployersWallets();
      console.log(fee);

      // setFee(fee);

      // await contractFactory.connect(signer).createMultiSig(_owners, BigInt(1))

      // Token details
      const totalTokens = await contractFactory.totalTokens();
      console.log(totalTokens);
      const tokens = [];
  }
}

  async function createMultiSig() {}

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setTimeout(() => {
      console.log("Wallet created:", { name, owners, requiredConfirmations });
      setIsCreating(false);
    }, 2000);
  };

  return (
    <div className="max-h-screen overflow-y-auto px-4 py-4">
      <Card className="w-full max-w-2xl bg-blue-800 text-white mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Multi-Signature Wallet
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Set up a new multi-signature wallet by providing the required
            information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Wallet Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-blue-700 border-blue-600 text-white"
                required
              />
            </div>
            <div>
              <Label>Owners</Label>
              {owners.map((owner, index) => (
                <div key={index} className="flex items-center mt-2 space-x-2">
                  <Input
                    value={owner}
                    onChange={(e) => handleOwnerChange(index, e.target.value)}
                    placeholder={`Owner ${index + 1} address`}
                    className="bg-blue-700 border-blue-600 text-white flex-grow"
                    required
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveOwner(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOwner}
                className="mt-4"
              >
                Add Owner
              </Button>
            </div>
            <div>
              <Label htmlFor="requiredConfirmations">
                Required Confirmations
              </Label>
              <Input
                id="requiredConfirmations"
                type="number"
                min={1}
                max={owners.length}
                value={requiredConfirmations}
                onChange={(e) =>
                  setRequiredConfirmations(parseInt(e.target.value))
                }
                className="bg-blue-700 border-blue-600 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-neon-green text-blue-900 hover:bg-neon-green/90"
              disabled={isCreating}
              onClick={async () => {
                try {
                  const success = await CreateMultiSig(
                    owners,
                    BigInt(requiredConfirmations)
                  );
                  alert(`Sucess: ${success}`)
                } catch (e) {
                  alert(e);
                }
              }}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Wallet"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
