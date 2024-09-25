"use client";

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Select } from "@repo/ui/components/ui/select"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-center mb-12">Create a New Poils Token</h1>
      
      <div className="max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Token Name</Label>
              <Input id="projectName" placeholder="Enter token name" className="bg-white border-gray-700" />
            </div>
            <div>
              <Label htmlFor="projectName">Token Symbol</Label>
              <Input id="projectName" placeholder="Enter token name" className="bg-white border-gray-700" />
            </div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description <InfoCircledIcon className="h-4 w-4 text-gray-400" />
                </Label>
                <Textarea 
                  id="description" 
                  placeholder="set you token description here" 
                  className="bg-white border-gray-700 h-24"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="projectImage">Token Image:</Label>
              <div className="mt-1">
                <Button variant="secondary" className="w-full bg-white hover:bg-gray-700">Choose file</Button>
              </div>
              <p className="text-xs mt-1">Powered by Warlus</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6">Financial Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tdl" className="flex items-center gap-2">
                Decimals <InfoCircledIcon className="h-4 w-4 " />
              </Label>
              <Input id="tdl" placeholder="9" className="bg-white border-gray-700" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}