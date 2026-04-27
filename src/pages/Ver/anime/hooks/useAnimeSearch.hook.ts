import { useCallback, useState } from 'react';

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
  type?: string;
}

export function useAnimeSearch({ isHentai = false, type }: UseAnimeSearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const buildUrl = useCallback((page: number, query: string) => {
    const genresParam = isHentai ? '&genres=12' : '';
    const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
    const queryParam = query ? `&q=${encodeURIComponent(query)}` : '';

    return `https://api.jikan.moe/v4/anime?limit=25&page=${page}${genresParam}${typeParam}${queryParam}`;
  }, [isHentai, type]);

  const runSearch = useCallback(async (page: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();

    setIsSearching(true);
    setShowResults(true);

    try {
      if (isHentai && !query) {
        const accumulatedResults: AnimeSearchResult[] = [];
        let nextPage = page;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(buildUrl(nextPage, query));
          const data = await response.json();

          const pageResults: AnimeSearchResult[] = data.data || [];
          pageResults.forEach((current) => {
            const exists = accumulatedResults.find((item) => item.mal_id === current.mal_id);
            if (!exists) {
              accumulatedResults.push(current);
            }
          });

          hasMore = Boolean(data?.pagination?.has_next_page);
          nextPage += 1;
        }

        setCurrentPage(1);
        setHasNextPage(false);
        setSearchResults(accumulatedResults);
      } else {
        const response = await fetch(buildUrl(page, query));
        const data = await response.json();
        setCurrentPage(page);
        setHasNextPage(Boolean(data?.pagination?.has_next_page));

        const uniqueResults =
          data.data?.reduce((acc: AnimeSearchResult[], current: AnimeSearchResult) => {
            const exists = acc.find((item) => item.mal_id === current.mal_id);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, []) || [];

        setSearchResults(uniqueResults);
      }
    } catch (error) {
      // console.error('Error al buscar anime:', error);
      setSearchResults([]);
      setHasNextPage(false);
    } finally {
      setIsSearching(false);
    }
  }, [buildUrl, isHentai, searchQuery]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    await runSearch(1, e);
  }, [runSearch]);

  const goToNextPage = useCallback(() => {
    if (isSearching || !hasNextPage) return;
    void runSearch(currentPage + 1);
  }, [currentPage, hasNextPage, isSearching, runSearch]);

  const goToPrevPage = useCallback(() => {
    if (isSearching || currentPage <= 1) return;
    void runSearch(currentPage - 1);
  }, [currentPage, isSearching, runSearch]);

  const clearSearch = () => {
    setShowResults(false);
    setSearchResults([]);
    setSearchQuery('');
    setCurrentPage(1);
    setHasNextPage(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    handleSearch,
    currentPage,
    hasNextPage,
    goToNextPage,
    goToPrevPage,
    clearSearch,
  };
}
