import HiringProcessForm from "./hiring-process-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"

export default function HiringProcess() {
  return (
    <div className="max-w-2xl mx-auto">
      <HiringProcessForm />
    </div>
  )
}



