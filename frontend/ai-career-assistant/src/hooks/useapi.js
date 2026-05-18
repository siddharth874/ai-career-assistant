// src/hooks/useApi.js

import { useState, useCallback } from "react"
//                 ^^^^^^^^^^^^ add this import

export function useApi(apiFunction) {

  const [data, setData]       = useState(null)   // ← ADD: store response
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // ← CHANGE: plain function → useCallback for stable reference
  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiFunction(...args)
      setData(response)      // ← ADD: save response into state
      return response        // still return it so caller can use it directly
    } catch (err) {
      setError(err.message || "Something went wrong")
      return null            // ← CHANGE: return null instead of throw
                             // error is already in state — UI will show it
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  return {
    execute,   // ← RENAME: request → execute (more descriptive)
    data,      // ← ADD: the response data
    loading,
    error,
  }
}