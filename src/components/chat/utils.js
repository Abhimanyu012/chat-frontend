// Time formatting utility
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (isNaN(date.getTime())) return ''
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// Date separator formatting
export const formatDateSeparator = (timestamp) => {
  if (!timestamp) return ''
  
  const messageDate = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  
  const messageDateString = messageDate.toDateString()
  const todayString = today.toDateString()
  const yesterdayString = yesterday.toDateString()
  
  if (messageDateString === todayString) return 'Today'
  if (messageDateString === yesterdayString) return 'Yesterday'
  
  return messageDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}

// Check if dates are different days
export const isDifferentDay = (date1, date2) => {
  if (!date1 || !date2) return false
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.toDateString() !== d2.toDateString()
}
