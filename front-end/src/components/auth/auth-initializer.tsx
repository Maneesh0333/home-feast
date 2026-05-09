'use client'

import { useEffect } from 'react'
import { useAuthStore } from "@/stores/authStore"

export function AuthInitializer() {
  useEffect(() => {
    // This runs once on the client after mount
    useAuthStore.getState().initAuth();
  }, [])

  return null // This component doesn't render anything
}