import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { EMOJI_CATEGORIES } from './emojiData'

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('faces')
  const pickerRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-14 left-0 bg-base-100 border-2 border-primary/20 rounded-3xl shadow-2xl p-4 w-80 max-h-72 overflow-hidden z-50 backdrop-blur-sm"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--b1)) 0%, hsl(var(--b1)/0.95) 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-base-content">Choose an emoji ✨</h3>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-base-200 hover:bg-error/20 hover:text-error flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <X size={14} />
        </button>
      </div>
      
      <div className="flex gap-1 mb-4 p-1 bg-base-200 rounded-2xl">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-2 text-xs rounded-xl capitalize transition-all duration-200 flex-1 font-medium ${
              selectedCategory === category 
                ? 'bg-primary text-primary-content shadow-lg transform scale-105' 
                : 'text-base-content/70 hover:text-base-content hover:bg-base-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-8 gap-1 max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {EMOJI_CATEGORIES[selectedCategory].map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="p-3 text-xl hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-125 active:scale-95 hover:shadow-lg"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      <div className="text-xs text-base-content/50 mt-3 text-center bg-base-200/50 rounded-xl p-2">
        <span className="font-medium">💡 Pro tip:</span> Click multiple emojis • Press Esc to close
      </div>
    </div>
  )
}

export default EmojiPicker
