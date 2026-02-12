-- Grant global access to Admin (admin@aranya.com)

-- Conversations policies
CREATE POLICY "Admins can view any conversation"
ON conversations FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@aranya.com');

CREATE POLICY "Admins can manage conversations"
ON conversations FOR ALL
USING (auth.jwt() ->> 'email' = 'admin@aranya.com');

-- Messages policies
CREATE POLICY "Admins can view any message"
ON messages FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@aranya.com');

CREATE POLICY "Admins can insert any message"
ON messages FOR INSERT
WITH CHECK (auth.jwt() ->> 'email' = 'admin@aranya.com');
