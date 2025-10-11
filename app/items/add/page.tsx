"use client"

import { useRouter } from "next/navigation"
import { itemsApi } from "@/lib/api"
import { ItemForm } from "@/components/item-form"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

export default function AddItemPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: { name: string; description: string }) => {
    await itemsApi.create(data)
    toast({
      title: "Success",
      description: "Item created successfully",
    })
    router.push("/items")
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <ItemForm
        onSubmit={handleSubmit}
        title="Add New Item"
        description="Create a new item by filling out the form below"
        submitLabel="Create Item"
      />
    </div>
  )
}
