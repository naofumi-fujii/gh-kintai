'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AttendanceRecord } from '@/types/attendance'

interface ClockInButtonProps {
  onSuccess?: () => void
}

export default function ClockInButton({ onSuccess }: ClockInButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleClockIn = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('ログインしてください')
        return
      }

      // Check if there's already an active clock-in (no clock-out)
      const { data: existingRecords } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .is('clock_out', null)
        .order('clock_in', { ascending: false })
        .limit(1)

      if (existingRecords && existingRecords.length > 0) {
        alert('既に出勤記録があります。先に退勤してください。')
        return
      }

      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: user.id,
          clock_in: new Date().toISOString(),
        })

      if (error) throw error

      alert('出勤を記録しました')
      onSuccess?.()
    } catch (error) {
      console.error('Error clocking in:', error)
      alert('出勤記録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClockIn}
      disabled={loading}
      className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? '記録中...' : '出勤'}
    </button>
  )
}
