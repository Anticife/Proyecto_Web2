import { API_URL } from '../api/axios';

export interface StrapiImage {
  id: number;
  attributes: {
    url: string;
    name?: string;
  };
}

export interface StrapiCategory {
  id: number;
  attributes: {
    name: string;
  };
}

export interface StrapiProperty {
  id: number;
  attributes: {
    title: string;
    price: number;
    location?: string;
    area?: number;
    isFeatured?: boolean;
    category?: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
    images?: {
      data: StrapiImage[];
    };
    image?: {
      data: StrapiImage;
    };
  };
}

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  area: number;
  isFeatured: boolean;
  image: string;
  category: string;
  categoryId?: number;
}

export function transformProperty(item: StrapiProperty): Property | null {
  if (!item || !item.attributes) return null;
  
  const attrs = item.attributes;
  
  // Handle Strapi images safely
  let imageUrl = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
  
  const imageData = (attrs.images?.data && attrs.images.data.length > 0) 
    ? attrs.images.data[0] 
    : attrs.image?.data;

  if (imageData?.attributes?.url) {
    const rawUrl = imageData.attributes.url;
    // If URL is relative (starts with /), prepend API_URL
    imageUrl = rawUrl.startsWith('/') ? `${API_URL}${rawUrl}` : rawUrl;
  }

  return {
    id: item.id,
    title: attrs.title || 'Untitled Property',
    price: attrs.price || 0,
    location: attrs.location || 'Sin ubicación',
    area: attrs.area || 0,
    isFeatured: attrs.isFeatured || false,
    category: attrs.category?.data?.attributes?.name || 'Sin categoría',
    categoryId: attrs.category?.data?.id,
    image: imageUrl,
  };
}
