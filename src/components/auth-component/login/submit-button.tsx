import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  loading: boolean
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Memproses..." : "Login"}
    </Button>
  )
}