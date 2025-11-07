export interface AttendanceRecord {
  id: string
  user_id: string
  clock_in: string
  clock_out: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      attendance_records: {
        Row: AttendanceRecord
        Insert: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
