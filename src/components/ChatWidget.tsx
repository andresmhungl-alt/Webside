'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Lock, MoreVertical, Ban, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage, getConversation, getMessages, markAsRead, toggleBlockChat, deleteChat } from '@/app/actions/chat'
import { toast } from 'sonner'

interface ChatWidgetProps {
    storeId: string
    storeName: string
    isChatEnabled: boolean
    customerId?: string
}

export function ChatWidget({ storeId, storeName, isChatEnabled, customerId }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isBlocked, setIsBlocked] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const optionsRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (customerId && !conversationId) {
            loadConversation()
        }
    }, [customerId])

    useEffect(() => {
        if (isOpen && conversationId) {
            markAsRead(conversationId).then(() => {
                setUnreadCount(0)
            })
        }
    }, [isOpen, conversationId])

    useEffect(() => {
        if (!conversationId) return

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMsg = payload.new as any
                    if (newMsg.sender_id === customerId) return

                    setMessages((current) => {
                        if (current.find(m => m.id === newMsg.id)) return current
                        return [...current, newMsg]
                    })

                    if (!isOpen) {
                        setUnreadCount(prev => prev + 1)
                    } else {
                        markAsRead(conversationId)
                    }
                    scrollToBottom()
                }
            )
            .subscribe()

        const convChannel = supabase
            .channel(`chat_conv:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'conversations',
                    filter: `id=eq.${conversationId}`
                },
                (payload) => {
                    const updated = payload.new as any
                    setIsBlocked(updated.is_blocked)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
            supabase.removeChannel(convChannel)
        }
    }, [conversationId, customerId, isOpen, storeName])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false)
                setIsConfirmingDelete(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleClickOutside = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
            setShowOptions(false)
            setIsConfirmingDelete(false)
        }
    }

    const loadConversation = async () => {
        setLoading(true)
        try {
            const result = await getConversation(storeId)
            if (result.conversation) {
                setConversationId(result.conversation.id)
                setIsBlocked(result.conversation.is_blocked)
                const msgs = await getMessages(result.conversation.id)
                setMessages(msgs || [])

                // Set initial unread count
                if (msgs) {
                    const unread = msgs.filter((m: any) => !m.is_read && m.sender_id !== customerId).length
                    setUnreadCount(unread)
                }

                scrollToBottom()
            }
        } catch (error) {
            console.error('Error loading chat:', error)
        } finally {
            setLoading(false)
        }
    }

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !customerId) return

        const content = input.trim()
        setInput('')

        // Optimistic update
        // setMessages(prev => [...prev, { id: 'temp', content, sender_id: customerId, created_at: new Date().toISOString() }])

        try {
            // Optimistic update
            const tempId = crypto.randomUUID()
            const optimisticMsg = {
                id: tempId,
                content,
                sender_id: customerId,
                created_at: new Date().toISOString()
            }
            setMessages(prev => [...prev, optimisticMsg])
            scrollToBottom()

            const result = await sendMessage(storeId, content)
            if (result.error) {
                toast.error(result.error)
                setMessages(prev => prev.filter(m => m.id !== tempId))
            } else {
                if (!conversationId && result.conversationId) {
                    setConversationId(result.conversationId)
                }
            }
        } catch (error) {
            toast.error('Error al enviar mensaje')
        }
    }

    const handleToggleBlock = async () => {
        if (!conversationId) return
        const res = await toggleBlockChat(conversationId)
        if (res.success) {
            toast.success(res.isBlocked ? 'Tienda bloqueada' : 'Tienda desbloqueada')
            setIsBlocked(res.isBlocked)
        } else {
            toast.error(res.error || 'Error al bloquear')
        }
        setShowOptions(false)
    }

    const handleDeleteChat = async () => {
        if (!conversationId) return

        const res = await deleteChat(conversationId)
        if (res.success) {
            toast.success('Chat eliminado')
            setMessages([])
            setConversationId(null)
            setUnreadCount(0)
        } else {
            toast.error(res.error || 'Error al eliminar')
        }
        setShowOptions(false)
        setIsConfirmingDelete(false)
    }

    if (!isChatEnabled) return null

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)]">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-yarn-magenta hover:bg-pink-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 relative"
                >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-bold font-outfit hidden sm:block">Chat con vendedor</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-yarn-magenta text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-yarn-magenta shadow-sm">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden border border-purple-100 animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${isBlocked ? 'bg-red-400' : 'bg-green-400'} rounded-full`}></div>
                            <div>
                                <h3 className="font-bold font-outfit text-sm flex items-center gap-2">
                                    {storeName}
                                    {isBlocked && <span className="text-[10px] bg-red-500/30 px-1.5 py-0.5 rounded-full">Bloqueada</span>}
                                </h3>
                                <p className="text-xs text-purple-100">{isBlocked ? 'Chat deshabilitado' : 'Responde usualmente en 1h'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {conversationId && (
                                <div className="relative" ref={optionsRef}>
                                    <button
                                        onClick={() => setShowOptions(!showOptions)}
                                        className="hover:bg-white/20 p-1 rounded-full text-white/80 hover:text-white transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {showOptions && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-purple-100 z-10 overflow-hidden py-1 text-gray-700">
                                            <button
                                                onClick={handleToggleBlock}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2"
                                            >
                                                <Ban className="w-4 h-4" />
                                                {isBlocked ? 'Desbloquear Tienda' : 'Bloquear Tienda'}
                                            </button>

                                            {isConfirmingDelete ? (
                                                <div className="px-4 py-2 bg-red-50">
                                                    <p className="text-[10px] text-red-600 font-bold mb-1">¿Eliminar chat?</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleDeleteChat}
                                                            className="text-[10px] bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 font-bold"
                                                        >
                                                            Sí
                                                        </button>
                                                        <button
                                                            onClick={() => setIsConfirmingDelete(false)}
                                                            className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 font-bold"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsConfirmingDelete(true)}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Eliminar Chat
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white/80 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={containerRef}
                        className="flex-1 h-64 sm:h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 scroll-smooth"
                    >
                        {!customerId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-500 space-y-4">
                                <Lock className="w-12 h-12 text-purple-200" />
                                <p className="text-sm font-medium">Inicia sesión para chatear con el vendedor</p>
                                <a href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-700 transition-colors">
                                    Iniciar Sesión
                                </a>
                            </div>
                        ) : loading ? (
                            <div className="flex justify-center p-4">
                                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-gray-400 text-xs py-8">
                                Envía un mensaje para comenzar la conversación.
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = msg.sender_id === customerId
                                return (
                                    <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    {customerId && (
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isBlocked ? "Chat bloqueado" : "Escribe un mensaje..."}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-400 transition-colors"
                                disabled={isBlocked}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isBlocked}
                                className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
