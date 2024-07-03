'use client'

import { Category } from "@prisma/client"
import { ReactNode } from "react"

type DeleteCategoryDialogProps = {
  trigger: ReactNode
  category: Category
}

export default function DeleteCategoryDialog() {
  return (
    <div>DeleteCategoryDialog</div>
  )
}