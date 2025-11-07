'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AttendanceRecord } from '@/types/attendance'

interface ClockOutButtonProps {
  onSuccess?: () => void
}

export default function ClockOutButton({ onSuccess }: ClockOutButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleClockOut = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('ログインしてください')
        return
      }

      // Find the most recent clock-in without a clock-out
      const { data: activeRecord } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .is('clock_out', null)
        .order('clock_in', { ascending: false })
        .limit(1)
        .single()

      if (!activeRecord) {
        alert('出勤記録が見つかりません。先に出勤してください。')
        return
      }

      const { error } = await supabase
        .from('attendance_records')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', activeRecord.id)

      if (error) throw error

      alert('退勤を記録しました')
      onSuccess?.()
    } catch (error) {
      console.error('Error clocking out:', error)
      alert('退勤記録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClockOut}
      disabled={loading}
      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? '記録中...' : '退勤'}
    </button>
  )
}
