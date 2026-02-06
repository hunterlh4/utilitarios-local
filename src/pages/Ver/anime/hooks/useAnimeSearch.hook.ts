import { useState } from 'react';

export interface AnimeSearchResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  episodes: number;
}

interface UseAnimeSearchOptions {
  isHentai?: boolean; // true para AnimeX (hentai), false para Anime normal
}

export function useAnimeSearch({ isHentai = false }: UseAnimeSearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      // genres=12 para hentai, sin genres para anime normal
      const genresParam = isHentai ? '&genres=12' : '';
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=20${genresParam}`
      );
      const data = await response.json();

      // Filtrar duplicados por mal_id
      const uniqueResults =
        data.data?.reduce((acc: AnimeSearchResult[], current: AnimeSearchResult) => {
          const exists = acc.find((item) => item.mal_id === current.mal_id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []) || [];

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error('Error al buscar anime:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setShowResults(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    handleSearch,
    clearSearch,
  };
}
