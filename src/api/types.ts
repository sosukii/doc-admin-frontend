export interface Setting {
  _id: string
  key: string
  value: string
}

export interface Page {
  _id: string
  key: string
  label: string
  visible: boolean
}

export interface Product {
  _id: string
  title: string
  isPublished: boolean
}

export interface BannerImage {
  mobile: string
  tablet: string
  desktop: string
}

export interface Banner {
  _id: string
  title: string
  subtitle: string
  image: BannerImage
  link: string
  visible: boolean
  order: number
}

export interface SystemStatus {
  status: string
  version: string
  uptime: number
  startedAt: string
}
