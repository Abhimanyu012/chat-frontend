import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import MessageComposer from './chat/MessageComposer'
import { formatMessageTime, formatDateSeparator, isDifferentDay } from './chat/utils'

const ChatContainer = () => {
  const { selectedUsers, messages, getMessages: fetchMessages, isMessagesLoading, sendMessage, demoMode } = useChatStore()
  const { authUser } = useAuthStore()
  const bottomRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [messagesFetched, setMessagesFetched] = useState({})

  const peerId = useMemo(() => selectedUsers?._id || selectedUsers?.id, [selectedUsers])
  
  // Memoized version of getMessages that prevents duplicate fetches
  const getMessages = useCallback((userId) => {
    // Only fetch if we haven't fetched for this user yet or it's been more than 30 seconds
    if (!messagesFetched[userId] || (Date.now() - messagesFetched[userId]) > 30000) {
      setMessagesFetched(prev => ({ ...prev, [userId]: Date.now() }))
      fetchMessages(userId)
    }
  }, [fetchMessages, messagesFetched])

  useEffect(() => {
    if (peerId) getMessages(peerId)
  }, [peerId, getMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!selectedUsers) return null

  return (
    <section className="flex-1 bg-base-100 h-full p-2 sm:p-4 flex flex-col min-h-0">
      {/* Header */}
      <header className="pb-2 sm:pb-3 border-b border-base-300 mb-2 sm:mb-4 flex-shrink-0">
        <h2 className="text-base sm:text-lg font-medium truncate">
          {selectedUsers.fullName || selectedUsers.username || selectedUsers.email || 'Conversation'}
        </h2>
        {demoMode && (
          <p className="text-xs opacity-70 mt-1">Demo mode: messages are not persisted.</p>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
        {isMessagesLoading ? (
          <p className="opacity-70">Loading messages…</p>
        ) : messages?.length ? (
          messages.map((m, index) => {
            const mine = m.localMine || (m.senderId === authUser?._id) || (m.sender?._id === authUser?._id)
            const timestamp = m.createdAt || m.timestamp
            const timeText = formatMessageTime(timestamp)

            const prevMessage = messages[index - 1]
            const showDateSeparator = index === 0 || isDifferentDay(prevMessage?.createdAt || prevMessage?.timestamp, timestamp)

            return (
              <React.Fragment key={m._id || m.id}>
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <div className="bg-base-300 text-base-content px-3 py-1 rounded-full text-xs opacity-70">
                      {formatDateSeparator(timestamp)}
                    </div>
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[75%] ${mine ? 'ml-auto' : 'mr-auto'}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm ${mine ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>
                    {m.image && (
                      <img src={m.image} alt="attachment" className={`mb-2 rounded ${mine ? 'border border-primary-content/20' : 'border border-base-300'} max-h-64`} />
                    )}
                    {(m.text || m.content) && (
                      <p className="whitespace-pre-wrap break-words">{m.text || m.content}</p>
                    )}
                  </div>
                  {timeText && (
                    <p
                      className={`text-xs opacity-60 mt-1 ${mine ? 'text-right' : 'text-left'}`}
                      title={timestamp ? new Date(timestamp).toLocaleString() : ''}
                    >
                      {timeText}
                    </p>
                  )}
                </div>
              </React.Fragment>
            )
          })
        ) : (
          <p className="opacity-70 text-center">No messages yet</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message Composer */}
      <footer className="pt-3 border-t border-base-300 mt-4 flex-shrink-0">
        <MessageComposer onSend={(payload) => sendMessage(payload)} />
      </footer>
    </section>
  )
}

export default ChatContainer