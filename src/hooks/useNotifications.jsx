import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/data'
import { useAuth } from './useAuth'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { isStaff } = useAuth()
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const unreadCount = items.filter((n) => !n.is_read).length

  const load = useCallback(async () => {
    try {
      setItems(await fetchNotifications())
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!isStaff) return
    load()
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => load())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isStaff, load])

  const markRead = useCallback(
    async (n) => {
      if (!n.is_read) {
        await markNotificationRead(n.id)
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)))
      }
    },
    []
  )

  const markAll = useCallback(async () => {
    await markAllNotificationsRead()
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })))
  }, [])

  return (
    <NotificationsContext.Provider value={{ items, unreadCount, open, setOpen, markRead, markAll, reload: load }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
