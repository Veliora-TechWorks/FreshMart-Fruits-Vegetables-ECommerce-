export interface Product {
  id: string
  name: string
  category: string
  image: string
  price: number
  mrp: number
  unitOptions: UnitOption[]
  rating: number
  reviews: number
  inStock: boolean
  isOrganic: boolean
  isSeasonal: boolean
  isBestSeller?: boolean
  isFresh?: boolean
  discount?: number
  stockLevel?: 'high' | 'medium' | 'low' | 'out'
  freshnessScore?: number
  isRecommended?: boolean
}

export interface UnitOption {
  value: number
  label: string
  multiplier: number
}

export type CardVariant = 'compact' | 'standard' | 'horizontal' | 'minimal' | 'admin'