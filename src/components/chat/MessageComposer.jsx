import React, { useState, useRef } from 'react'
import { Image as ImageIcon, X, Send as SendIcon, Smile } from 'lucide-react'
import EmojiPicker from './EmojiPicker'
import { EMOJI_SHORTCUTS } from './emojiData'

const MessageComposer = ({ onSend }) => {
  const [value, setValue] = useState("")
  const [imageData, setImageData] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef(null)

  const handleInputChange = (e) => {
    let newValue = e.target.value
    
    Object.entries(EMOJI_SHORTCUTS).forEach(([shortcut, emoji]) => {
      if (newValue.endsWith(shortcut)) {
        newValue = newValue.slice(0, -shortcut.length) + emoji
      }
    })
    
    setValue(newValue)
    
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }
    
    if (e.key === 'Escape') {
      if (showEmojiPicker) {
        setShowEmojiPicker(false)
      } else if (value.trim() || imageData) {
        setValue('')
        clearImage()
      }
      return
    }
  }

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current
    if (!input) return
    
    const startPos = input.selectionStart
    const endPos = input.selectionEnd
    const newValue = value.substring(0, startPos) + emoji + value.substring(endPos)
    setValue(newValue)
    
    setTimeout(() => {
      input.focus()
      input.setSelectionRange(startPos + emoji.length, startPos + emoji.length)
      input.style.height = 'auto'
      input.style.height = Math.min(input.scrollHeight, 128) + 'px'
    }, 0)
  }

  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      e.target.value = ''
      return
    }
    
    const MAX = 5 * 1024 * 1024
    if (file.size > MAX) {
      e.target.value = ''
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => setImageData(reader.result)
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageData(null)
    setFileKey((k) => k + 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = value.trim()
    
    if (!text && !imageData) return
    
    onSend({ text: text || undefined, image: imageData || undefined })
    
    setValue("")
    clearImage()
    setShowEmojiPicker(false)
    
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = '40px'
    }
  }

  return (
    <div className="relative">
      <EmojiPicker 
        isOpen={showEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        onClose={() => setShowEmojiPicker(false)}
      />
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {imageData && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img 
                  src={imageData} 
                  alt="preview" 
                  className="max-h-20 rounded-xl shadow-lg border-2 border-white/20" 
                />
                <button 
                  type="button" 
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" 
                  onClick={clearImage} 
                >
                  <X size={12} />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">📸 Image ready to send</p>
                <p className="text-xs opacity-60">Looking good! ✨</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-base-100 rounded-3xl border-2 border-base-300 hover:border-primary/30 focus-within:border-primary shadow-lg transition-all duration-200 overflow-hidden">
          <div className="flex items-end gap-2 p-2">
            <div className="flex gap-1 pb-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                  showEmojiPicker 
                    ? 'bg-primary text-primary-content shadow-lg' 
                    : 'bg-base-200 hover:bg-primary/20 text-base-content hover:text-primary'
                }`}
              >
                <Smile size={18} />
              </button>
              
              <label 
                className="w-10 h-10 rounded-2xl bg-base-200 hover:bg-secondary/20 hover:text-secondary flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105" 
                htmlFor="file-input"
              >
                <ImageIcon size={18} />
              </label>
              <input key={fileKey} id="file-input" type="file" accept="image/*" className="hidden" onChange={onPickFile} />
            </div>
            
            <div className="flex-1 py-1">
              <textarea
                ref={inputRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind? ✨"
                className="w-full bg-transparent text-base leading-relaxed placeholder:text-base-content/50 focus:outline-none resize-none py-2 px-2 max-h-32 min-h-[40px]"
                rows={1}
              />
            </div>
            
            <div className="pb-2">
              <button
                type="submit"
                disabled={!value.trim() && !imageData}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 transform ${
                  (!value.trim() && !imageData)
                    ? 'bg-base-300 text-base-content/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
              >
                <SendIcon size={20} />
              </button>
            </div>
          </div>
          
          <div className="px-4 pb-2">
            <p className="text-xs text-base-content/40 text-center">
              ⌨️ <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for new line • <strong>Esc</strong> to clear
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default MessageComposer
