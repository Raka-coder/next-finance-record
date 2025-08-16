import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  loading: boolean
  usernameError: string
}

export function SubmitButton({ loading, usernameError }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={loading || !!usernameError}>
      {loading ? "Memproses..." : "Register"}
    </Button>
  )
}