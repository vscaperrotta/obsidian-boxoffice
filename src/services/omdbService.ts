import { requestUrl } from "obsidian";
import type { CineVaultSearchItem, OmdbDetailedResponse } from "../types/cinevault";
import { OMDB_URL } from "src/constants";

export async function searchOmdb(query: string, apiKey: string, type?: string, year?: string): Promise<CineVaultSearchItem[]> {
  if (!apiKey) {
    return [];
  }

  try {
    let url = `${OMDB_URL}/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    if (year) {
      url += `&y=${encodeURIComponent(year)}`;
    }
    const response = await requestUrl(url);

    console.log(response)

    const data = response.json as {
      Search?: Array<{ Title: string; Year: string; imdbID: string; Type: string; Poster: string; }>;
    };

    console.log(data)

    if (data?.Search) {
      return data.Search.map((item) => ({
        imdbId: item.imdbID,
        title: item.Title,
        year: item.Year,
        type: item.Type,
        poster: item.Poster && item.Poster !== "N/A" ? item.Poster : "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error searching OMDb:", error);
    return [];
  }
}

export async function getOmdbDetails(imdbId: string, apiKey: string, depth: number = 0): Promise<OmdbDetailedResponse | null> {
  // Retry limit
  if (depth >= 3) {
    console.error(`Failed to fetch movie details after ${depth} attempts`);
    return null;
  }

  if (!apiKey) {
    return null;
  }

  try {
    const url = `${OMDB_URL}/?apikey=${apiKey}&i=${imdbId}&plot=full&tomatoes=true`;
    const response = await requestUrl(url);

    const data = response.json as OmdbDetailedResponse & { Response: string };

    if (data.Response !== "True") {
      console.error("OMDb API returned error response", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie details, retrying...", error);
    return getOmdbDetails(imdbId, apiKey, depth + 1);
  }
}
