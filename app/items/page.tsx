"use client"
import { Package } from "lucide-react" // Import Package icon

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { itemsApi, type Item } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await itemsApi.getAll()
      setItems(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setDeleting(true)
      await itemsApi.delete(deleteId)
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      setItems(items.filter((item) => item.id !== deleteId))
      setDeleteId(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete item",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            {user && (
              <p className="text-sm text-muted-foreground mb-2">
                Welcome, {user.username.split("@")[0]}
              </p>
            )}
            <h1 className="text-3xl font-bold">Items</h1>
            <p className="text-muted-foreground mt-1">Manage your items collection</p>
          </div>
          <Button asChild>
            <Link href="/items/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items yet</h3>
              <p className="text-muted-foreground text-center mb-4">Get started by creating your first item</p>
              <Button asChild>
                <Link href="/items/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-balance">{item.name}</CardTitle>
                  <CardDescription className="text-pretty">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">Last updated: {formatDate(item.updatedAt)}</p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/items/${item.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/items/${item.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(item.id)} className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
