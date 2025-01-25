// "use client";

// import { useState } from "react";
// import { Search, LoaderIcon } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DashboardLayout } from "@/components/DashboardLayout";
// import Link from "next/link";
// import { client } from "../client";
// import { useActiveAccount, ConnectButton, useReadContract, useSendTransaction } from "thirdweb/react";
// import MultiSigCreationModal from "../create/multisigcreation";
// import { defineChain, getContract, prepareContractCall } from "thirdweb";

// const Data = (setWallet: any, contract: any, provider: any) => {

//     const activeAccount = useActiveAccount();

//     async function loadData() {}



//   return (
//     <div className=" mb-8 ">
//       <Button className="bg-neon-green text-blue-900 hover:bg-neon-green/90" onClick={async () => {
//           try {
//             console.log(data)
//             setWallet(data);

//           } catch(e) {
//             console.log(e);
//           }
//         }}>
//           <LoaderIcon className="mr-2 h-4 w-4" /> Load data
//         </Button>
//     </div>
//   )
// }

// export default Data
