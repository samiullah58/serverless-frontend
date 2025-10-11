"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { itemsApi, type Item } from "@/lib/api"
import { ItemForm } from "@/components/item-form"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function EditItemPage() {
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string

  useEffect(() => {
    fetchItem()
  }, [id])

  const fetchItem = async () => {
    try {
      setLoading(true)
      const data = await itemsApi.getById(id)
      setItem(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch item",
        variant: "destructive",
      })
      router.push("/items")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: { name: string; description: string }) => {
    await itemsApi.update(id, data)
    toast({
      title: "Success",
      description: "Item updated successfully",
    })
    router.push("/items")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!item) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <ItemForm
        initialData={{ name: item.name, description: item.description }}
        onSubmit={handleSubmit}
        title="Edit Item"
        description="Update the item details below"
        submitLabel="Update Item"
      />
    </div>
  )
}
