export interface Product {
    id: string
    name: string
    price: number
    description: string | null
    image_url: string | null
    slot?: number | null
}
