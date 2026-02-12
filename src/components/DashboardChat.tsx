'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getConversations, getMessages, sendMessage, markAsRead, toggleBlockChat, deleteChat } from '@/app/actions/chat'
import { Send, User, MessageCircle, MoreVertical, Ban, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
    id: string
    content: string
    sender_id: string
    created_at: string
}

interface Conversation {
    id: string
    customer_id: string
    customer_name: string
    last_message_at: string
    preview: string
    store_id: string
    unread_count?: number
    is_blocked?: boolean
}

export function DashboardChat({ storeId, userId }: { storeId: string, userId: string }) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingConvs, setLoadingConvs] = useState(true)
    const [showOptions, setShowOptions] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const optionsRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Use refs to access current state in the callback without closure staleness
    const selectedConvRef = useRef<string | null>(null)
    const conversationsRef = useRef<Conversation[]>([])

    useEffect(() => {
        selectedConvRef.current = selectedConv ? selectedConv.id : null
        if (selectedConv) {
            markAsRead(selectedConv.id).then(() => {
                // Decrement unread local count
                setConversations(prev => prev.map(c =>
                    c.id === selectedConv.id ? { ...c, unread_count: 0 } : c
                ))
            })
        }
    }, [selectedConv?.id])

    useEffect(() => {
        conversationsRef.current = conversations
    }, [conversations])

    useEffect(() => {
        loadConversations()

        // Subscribe to ALL new messages for THIS store to show notifications
        const messageChannel = supabase
            .channel('dashboard_chat_all_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                async (payload: any) => {
                    const newMsg = payload.new
                    // If it's not from me
                    if (newMsg.sender_id !== userId) {
                        // Reload conversations to update unread counts and previews
                        loadConversations()
                    }
                }
            )
            .subscribe()

        // Subscribe to conversation UPDATES (blocking/unblocking)
        const convChannel = supabase
            .channel('dashboard_chat_all_conversations')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'conversations'
                },
                () => {
                    loadConversations()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(messageChannel)
            supabase.removeChannel(convChannel)
        }
    }, [storeId, userId])

    useEffect(() => {
        if (selectedConv) {
            loadMessages(selectedConv.id)

            // Subscribe to messages for selected conversation
            const channel = supabase
                .channel(`dashboard_chat_messages:${selectedConv.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `conversation_id=eq.${selectedConv.id}`
                    },
                    (payload) => {
                        const newMsg = payload.new as Message
                        // Only add if it's not from me (to avoid duplication with optimistic update)
                        setMessages((prev) => {
                            if (newMsg.sender_id === userId) return prev
                            if (prev.find(m => m.id === newMsg.id)) return prev
                            return [...prev, newMsg]
                        })
                        scrollToBottom()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [selectedConv?.id, userId])

    const loadConversations = async () => {
        try {
            const data = await getConversations(storeId)
            if (Array.isArray(data)) {
                setConversations(data)
            } else if (data && 'error' in data) {
                toast.error(`Error de chat: ${data.error}`)
                console.error('Chat error:', data.error)
            }
        } catch (error) {
            console.error('Error loading conversations:', error)
            toast.error('Error al cargar conversaciones')
        } finally {
            setLoadingConvs(false)
        }
    }

    const handleToggleBlock = async () => {
        if (!selectedConv) return
        const res = await toggleBlockChat(selectedConv.id)
        if (res.success) {
            toast.success(res.isBlocked ? 'Chat bloqueado' : 'Chat desbloqueado')
            setSelectedConv({ ...selectedConv, is_blocked: res.isBlocked })
            setConversations(prev => prev.map(c =>
                c.id === selectedConv.id ? { ...c, is_blocked: res.isBlocked } : c
            ))
        } else {
            toast.error(res.error || 'Error al bloquear chat')
        }
        setShowOptions(false)
    }

    const handleDeleteChat = async () => {
        if (!selectedConv) return

        const res = await deleteChat(selectedConv.id)
        if (res.success) {
            toast.success('Conversación eliminada')
            setConversations(prev => prev.filter(c => c.id !== selectedConv.id))
            setSelectedConv(null)
        } else {
            toast.error(res.error || 'Error al eliminar chat')
        }
        setShowOptions(false)
        setIsConfirmingDelete(false)
    }

    const loadMessages = async (convId: string) => {
        const msgs = await getMessages(convId)
        if (msgs) {
            setMessages(msgs)
            scrollToBottom()
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConv) return
        if (selectedConv.is_blocked) {
            toast.error('No puedes enviar mensajes a un chat bloqueado.')
            return
        }

        setLoading(true)
        const content = newMessage.trim()
        setNewMessage('')

        // Optimistic update
        const tempId = crypto.randomUUID()
        const optimisticMsg: Message = {
            id: tempId,
            content,
            sender_id: userId,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])
        scrollToBottom()

        const result = await sendMessage(storeId, content, selectedConv.id)

        if (result.error) {
            toast.error(result.error)
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId))
        }
        setLoading(false)
    }

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden h-[600px] flex">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-purple-50 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-purple-100 bg-white">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                        Mensajes
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="p-4 text-center text-gray-400">Cargando...</div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <p>No hay mensajes aún.</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConv(conv)}
                                className={`w-full p-4 text-left border-b border-purple-50 hover:bg-purple-50 transition-colors ${selectedConv?.id === conv.id ? 'bg-purple-50 border-purple-200' : ''
                                    }`}
                            >
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-sm text-gray-700 truncate">
                                            {conv.customer_name}
                                        </span>
                                        {conv.unread_count && conv.unread_count > 0 && (
                                            <span className="bg-purple-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 truncate">
                                            {conv.preview}
                                        </p>
                                        {conv.last_message_at && (
                                            <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                                                {new Date(conv.last_message_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConv ? (
                    <>
                        <div className="p-4 border-b border-purple-50 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        {selectedConv.customer_name}
                                        {selectedConv.is_blocked && (
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Bloqueado</span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-gray-500">ID: {selectedConv.customer_id.slice(0, 8)}...</p>
                                </div>
                            </div>

                            <div className="relative" ref={optionsRef}>
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                </button>

                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-purple-100 z-10 overflow-hidden py-1">
                                        <button
                                            onClick={handleToggleBlock}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                                        >
                                            <Ban className="w-4 h-4" />
                                            {selectedConv.is_blocked ? 'Desbloquear Chat' : 'Bloquear Chat'}
                                        </button>

                                        {isConfirmingDelete ? (
                                            <div className="px-4 py-2 bg-red-50">
                                                <p className="text-[10px] text-red-600 font-bold mb-1">¿Eliminar permanentemente?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleDeleteChat}
                                                        className="text-[10px] bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 font-bold"
                                                    >
                                                        Sí, eliminar
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
                        </div>

                        <div
                            ref={containerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth"
                        >
                            {messages.map((msg) => {
                                const isMe = msg.sender_id === userId
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                                ? 'bg-purple-600 text-white rounded-tr-sm'
                                                : 'bg-white text-gray-800 border border-purple-50 rounded-tl-sm'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <span className={`text-[10px] block mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            {/* Removed EndRef to use container scroll */}
                        </div>

                        <div className="p-4 bg-white border-t border-purple-50">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={selectedConv.is_blocked ? "Chat bloqueado" : "Escribe un mensaje..."}
                                    className="flex-1 px-4 py-2 rounded-full border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all text-sm"
                                    disabled={loading || selectedConv.is_blocked}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim() || selectedConv.is_blocked}
                                    className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg shadow-purple-200"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                        <p>Selecciona una conversación para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    )
}
