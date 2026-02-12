'use client'

import { Mail, Phone, Send as SendIcon, MessageCircle } from 'lucide-react'

interface StoreContactActionsProps {
    contact_email?: string | null
    whatsapp?: string | null
    telegram?: string | null
    is_chat_enabled?: boolean
    isOwner: boolean
}

export function StoreContactActions({
    contact_email,
    whatsapp,
    telegram,
    is_chat_enabled,
    isOwner
}: StoreContactActionsProps) {

    const openChat = () => {
        const chatButton = document.querySelector('.bg-yarn-magenta.p-4.rounded-full') as HTMLButtonElement;
        if (chatButton) {
            chatButton.click();
        }
    };

    return (
        <div className="flex gap-4">
            {contact_email && (
                <a href={`mailto:${contact_email}`} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors border border-white/10" title="Email">
                    <Mail className="w-5 h-5" />
                </a>
            )}
            {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-green-500/20 backdrop-blur-md rounded-full text-green-100 hover:bg-green-500/30 transition-colors border border-green-500/20" title="WhatsApp">
                    <Phone className="w-5 h-5" />
                </a>
            )}
            {telegram && (
                <a href={`https://t.me/${telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-500/20 backdrop-blur-md rounded-full text-blue-100 hover:bg-blue-500/30 transition-colors border border-blue-500/20" title="Telegram">
                    <SendIcon className="w-5 h-5" />
                </a>
            )}
            {is_chat_enabled !== false && !isOwner && (
                <button
                    onClick={openChat}
                    className="flex items-center gap-2 p-3 bg-purple-600/20 backdrop-blur-md rounded-full text-white hover:bg-purple-600/30 transition-colors border border-purple-600/20 group/chat"
                    title="Chat en vivo"
                >
                    <MessageCircle className="w-5 h-5 group-hover/chat:scale-110 transition-transform" />
                    <span className="text-xs font-bold pr-2 hidden sm:inline">Chat en vivo</span>
                </button>
            )}
        </div>
    )
}
