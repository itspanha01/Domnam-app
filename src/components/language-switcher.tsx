"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function LanguageSwitcher() {
  const { setLocale, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch language">
          <Globe className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('en')}>{t('english')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('km')}>{t('khmer')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('zh')}>{t('chinese')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
