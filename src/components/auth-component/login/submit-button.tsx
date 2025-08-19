import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmitButtonProps {
  loading: boolean
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Memproses...
        </>
      ) : (
        "Login"
      )}
    </Button>
  )
}