import React, { useEffect, useMemo, useState } from 'react'

type EventItem = { id: string; text: string }
type EventsByDate = Record<string, EventItem[]>

const STORAGE_KEY = 'calendar-events-v1'

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function formatDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function Calendar() {
  const today = new Date()
  const [current, setCurrent] = useState(() => startOfMonth(today))
  const [events, setEvents] = useState<EventsByDate>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setEvents(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load events', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (e) {
      console.warn('Failed to save events', e)
    }
  }, [events])

  const monthDays = useMemo(() => {
    const first = startOfMonth(current)
    const startWeekday = first.getDay() // 0 Sun .. 6 Sat
    const count = daysInMonth(current)
    const arr: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i++) arr.push(null)
    for (let d = 1; d <= count; d++) arr.push(new Date(current.getFullYear(), current.getMonth(), d))
    return arr
  }, [current])

  function changeMonth(delta: number) {
    setCurrent((s) => new Date(s.getFullYear(), s.getMonth() + delta, 1))
  }

  function handleAdd(day: Date) {
    const text = prompt(`Add event for ${formatDateKey(day)}`)
    if (!text) return
    const key = formatDateKey(day)
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setEvents((prev) => ({ ...prev, [key]: [...(prev[key] || []), { id, text }] }))
  }

  function handleRemove(dateKey: string, id: string) {
    setEvents((prev) => ({ ...prev, [dateKey]: (prev[dateKey] || []).filter((e) => e.id !== id) }))
  }

  return (
    <div className="calendar">
      <div className="cal-controls">
        <button onClick={() => changeMonth(-1)}>&lt; Prev</button>
        <div className="cal-title">
          {current.toLocaleString(undefined, { month: 'long' })} {current.getFullYear()}
        </div>
        <button onClick={() => changeMonth(1)}>Next &gt;</button>
      </div>

      <div className="cal-grid">
        <div className="cal-weekday">Sun</div>
        <div className="cal-weekday">Mon</div>
        <div className="cal-weekday">Tue</div>
        <div className="cal-weekday">Wed</div>
        <div className="cal-weekday">Thu</div>
        <div className="cal-weekday">Fri</div>
        <div className="cal-weekday">Sat</div>

        {monthDays.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} className="cal-day empty" />
          const key = formatDateKey(d)
          const dayEvents = events[key] || []
          const isToday = formatDateKey(d) === formatDateKey(new Date())
          return (
            <div key={key} className={`cal-day ${isToday ? 'today' : ''}`}>
              <div className="cal-day-header">
                <strong>{d.getDate()}</strong>
                <button className="add-btn" onClick={() => handleAdd(d)} title="Add event">+</button>
              </div>
              <div className="cal-events">
                {dayEvents.map((ev) => (
                  <div key={ev.id} className="event-item">
                    <span>{ev.text}</span>
                    <button className="del-btn" onClick={() => handleRemove(key, ev.id)} aria-label="Delete">×</button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
