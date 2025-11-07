'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendanceListProps {
  refreshTrigger?: number
}

export default function AttendanceList({ refreshTrigger }: AttendanceListProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRecords()
  }, [refreshTrigger])

  const fetchRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .order('clock_in', { ascending: false })
        .limit(30)

      if (error) throw error

      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const calculateDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return '勤務中'

    const start = new Date(clockIn)
    const end = new Date(clockOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}時間${minutes}分`
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">勤怠記録がありません</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              出勤日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              退勤日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              勤務時間
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(record.clock_in)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.clock_out ? formatDate(record.clock_out) : '---'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calculateDuration(record.clock_in, record.clock_out)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
