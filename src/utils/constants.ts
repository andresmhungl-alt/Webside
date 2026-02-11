export const DEFAULT_MAX_PRODUCTS = 5;

export function getMaxProductsLimit() {
    const limit = process.env.NEXT_PUBLIC_MAX_PRODUCTS
    const parsed = limit ? parseInt(limit, 10) : DEFAULT_MAX_PRODUCTS
    return isNaN(parsed) ? DEFAULT_MAX_PRODUCTS : parsed
}
