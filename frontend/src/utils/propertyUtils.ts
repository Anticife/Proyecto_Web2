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
  images: string[];
  category: string;
  categoryId?: number;
}

export function transformProperty(item: StrapiProperty): Property | null {
  if (!item || !item.attributes) return null;
  
  const attrs = item.attributes;
  
  // Handle Strapi images safely
  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
  let imageUrl = defaultImage;
  let allImages: string[] = [];
  
  // Extract all images
  const imagesData = attrs.images?.data || [];
  if (imagesData.length > 0) {
    allImages = imagesData.map(img => {
      const url = img.attributes?.url;
      if (!url) return defaultImage;
      return url.startsWith('/') ? `${API_URL}${url}` : url;
    });
    imageUrl = allImages[0];
  } else if (attrs.image?.data?.attributes?.url) {
    const url = attrs.image.data.attributes.url;
    imageUrl = url.startsWith('/') ? `${API_URL}${url}` : url;
    allImages = [imageUrl];
  } else {
    allImages = [defaultImage];
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
    images: allImages,
  };
}
