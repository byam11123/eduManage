'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2 } from 'lucide-react'

interface Branch {
  id: string
  name: string
}

interface BranchSwitcherProps {
  branches: Branch[]
  currentBranchId: string
  onBranchChange: (branchId: string) => void
}

export function BranchSwitcher({ branches, currentBranchId, onBranchChange }: BranchSwitcherProps) {
  const router = useRouter()
  
  const currentBranch = branches.find(branch => branch.id === currentBranchId)

  const handleBranchChange = (branchId: string) => {
    onBranchChange(branchId)
    // Optionally navigate to the branch dashboard
    // router.push(`/branch?branch=${branchId}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={currentBranchId} onValueChange={handleBranchChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select branch">
            {currentBranch ? currentBranch.name : 'Select branch'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}