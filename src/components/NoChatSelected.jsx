import { MessageSquareHeart } from 'lucide-react'

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 bg-gradient-to-br from-pink-50 via-white to-blue-50 rounded-2xl shadow-xl transition-all duration-300">
      <div className="bg-white/80 rounded-full p-6 shadow-lg mb-6">
        <MessageSquareHeart size={56} className="text-pink-500 animate-bounce drop-shadow-lg" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-2 tracking-tight">
        Welcome!
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-500 text-center mb-4">
        Select a conversation to get started.
      </p>
      <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium shadow-sm animate-fade-in">
        No chat selected
      </span>
    </div>
  )
}

export default NoChatSelected
