"use client";
import { Card } from "@repo/ui/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table"
import { Button } from "@repo/ui/components/ui/button"
import { RefreshCw } from "lucide-react"
import React from "react";

const getTokenImage = () => {
  return `https://hop.ag/tokens/SUI.svg`
}

const assets = [
  { id: 1, name: 'Obelisk', symbol: 'OBL', balance: 0.5, value: 15000 },
  { id: 2, name: 'Poils', symbol: 'POL', balance: 5, value: 10000 },
  { id: 3, name: 'Dubei', symbol: 'DUB', balance: 1000, value: 500 },
  { id: 4, name: 'Cyferio', symbol: 'CYF', balance: 100, value: 2000 },
]

export default function AssetViewer() {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Value</h2>
          <p className="text-4xl font-bold">${totalValue.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Details</h2>
            <Button variant="outline" size="sm" className="text-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token Name</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Value (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <img src={getTokenImage()} alt={asset.symbol} className="w-6 h-6 mr-2" />
                      {asset.name} ({asset.symbol})
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{asset.balance}</TableCell>
                  <TableCell className="text-right">${asset.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}