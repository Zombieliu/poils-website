"use client"

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { RefreshCw, MoreHorizontal } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table"

const tokenData = [
  { name: "Obelisk (OBL)", balance: 0.5, value: 15000, icon: "https://hop.ag/tokens/SUI.svg" },
  { name: "Poils (POL)", balance: 5, value: 10000, icon: "https://hop.ag/tokens/SUI.svg" },
  { name: "Dubei (DUB)", balance: 1000, value: 500, icon: "https://hop.ag/tokens/SUI.svg" },
  { name: "Cyferio (CYF)", balance: 100, value: 2000, icon: "https://hop.ag/tokens/SUI.svg" },
]

export default function Assets() {
  return (
    <SheetContent className="w-[400px] sm:w-[540px] bg-pink-50">
      <SheetHeader>
        <SheetTitle>Crypto Portfolio</SheetTitle>
        <SheetDescription>Your current poils'token holdings</SheetDescription>
      </SheetHeader>
      <div className="py-4">
        <h2 className="text-lg font-semibold">Value</h2>
        <p className="text-4xl font-bold">$27,500</p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Details</h3>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token Name</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenData.map((token) => (
              <TableRow key={token.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <img src={token.icon} alt={token.name} className="w-6 h-6 mr-2" />
                    {token.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">{token.balance}</TableCell>
                <TableCell className="text-right">${token.value.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Transfer</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SheetContent>
  )
}