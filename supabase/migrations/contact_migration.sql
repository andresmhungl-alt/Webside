-- Add contact fields to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS telegram text,
ADD COLUMN IF NOT EXISTS is_chat_enabled boolean DEFAULT true;

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    is_blocked boolean DEFAULT false,
    last_message_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    UNIQUE(store_id, customer_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversations Policies
CREATE POLICY "Store owners can view their store's conversations"
ON conversations FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Customers can view their own conversations"
ON conversations FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Store owners can insert conversations (reply/initiate)"
ON conversations FOR INSERT
WITH CHECK (auth.uid() IN (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Customers can insert conversations (start chat)"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = customer_id);

-- Messages Policies
CREATE POLICY "Participants can view messages"
ON messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = conversation_id
        AND (c.customer_id = auth.uid() OR c.store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()))
    )
);

CREATE POLICY "Participants can insert messages"
ON messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = conversation_id
        AND (c.customer_id = auth.uid() OR c.store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()))
    )
);
