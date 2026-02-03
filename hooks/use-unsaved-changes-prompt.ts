'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useUnsavedChangesPrompt(hasUnsavedChanges: boolean, message?: string) {
  const router = useRouter()
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges)

  // Keep ref in sync with state
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges
  }, [hasUnsavedChanges])

	useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (!hasUnsavedChanges) return

    // Push a state to detect back navigation
    const currentState = window.history.state
    window.history.pushState({ ...currentState, unsavedChangesGuard: true }, '')

    const handlePopState = () => {
      if (hasUnsavedChangesRef.current) {
        const confirmLeave = window.confirm(
          message || 'You have unsaved changes. Are you sure you want to leave?'
        )

        if (!confirmLeave) {
          // User cancelled - push state back to prevent navigation
          window.history.pushState({ unsavedChangesGuard: true }, '')
        }
        // If confirmed, the browser will navigate naturally
      }
    }

    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
      // Clean up the extra history entry if component unmounts while changes exist
      if (hasUnsavedChangesRef.current && window.history.state?.unsavedChangesGuard) {
        window.history.back()
      }
    }
  }, [hasUnsavedChanges, message])

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