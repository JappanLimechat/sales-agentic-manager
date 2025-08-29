"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GSTCalculator } from "./gst-calculator"
import { ROICalculator } from "./roi-calculator"
import { FestivalCalendar } from "./festival-calendar"

export function UtilitiesPanel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">Utilities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gst">
          <TabsList>
            <TabsTrigger value="gst">GST Calculator</TabsTrigger>
            <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
            <TabsTrigger value="festivals">Festival Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="gst" className="mt-4">
            <GSTCalculator />
          </TabsContent>
          <TabsContent value="roi" className="mt-4">
            <ROICalculator />
          </TabsContent>
          <TabsContent value="festivals" className="mt-4">
            <FestivalCalendar />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
