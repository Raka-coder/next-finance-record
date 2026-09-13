"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 font-mono text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Ganti mode tampilan"
    >
      <span className="hidden sm:inline">Tema: </span>
      <span className="capitalize">{theme === "light" ? "Terang" : theme === "dark" ? "Gelap" : "Sistem"}</span>
    </Button>
  )
}