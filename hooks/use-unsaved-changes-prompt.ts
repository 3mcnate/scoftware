'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useUnsavedChangesPrompt(hasUnsavedChanges: boolean, message?: string) {
  const router = useRouter()

	useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return

      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && !link.target) {
        const url = new URL(link.href)
        const currentUrl = new URL(window.location.href)
        
        // Check if it's an internal navigation
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          e.preventDefault()
          
          const confirmLeave = window.confirm(
            message || 'You have unsaved changes. Are you sure you want to leave?'
          )
          
          if (confirmLeave) {
            router.push(url.pathname + url.search + url.hash)
          }
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [hasUnsavedChanges, message, router])
}