"use client"

import React from "react"
import type { POCRecord } from "@/data/pocs"

const Ctx = React.createContext<{ records: POCRecord[] }>({ records: [] })

export function POCDataProvider({ records, children }: { records: POCRecord[]; children: React.ReactNode }) {
  return <Ctx.Provider value={{ records }}>{children}</Ctx.Provider>
}

export function usePOCData() {
  return React.useContext(Ctx)
}
