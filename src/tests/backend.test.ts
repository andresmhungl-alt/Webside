import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

describe('Supabase Connectivity', () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    it('should have environment variables set', () => {
        expect(supabaseUrl).toBeDefined()
        expect(supabaseKey).toBeDefined()
    })

    it('should connect to Supabase and query public tables', async () => {
        if (!supabaseUrl || !supabaseKey) throw new Error('Missing env vars')

        const supabase = createClient(supabaseUrl, supabaseKey)

        // We try to fetch stores. It should succeed (return 200-299) even if empty.
        const { error, status } = await supabase
            .from('stores')
            .select('count', { count: 'exact', head: true })

        if (error) {
            console.error('Supabase Error:', error)
        }

        expect(error).toBeNull()
        expect(status).toBeGreaterThanOrEqual(200)
        expect(status).toBeLessThan(300)
    })

    it('should return error for non-existent table', async () => {
        if (!supabaseUrl || !supabaseKey) throw new Error('Missing env vars')
        const supabase = createClient(supabaseUrl, supabaseKey)


        const { error } = await supabase
            .from('non_existent_table')
            .select('*')

        expect(error).toBeTruthy()
    })
})
