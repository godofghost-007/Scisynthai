import { Paper } from '../types';

const CORE_API_KEY = 'iwNZr6928l5G1ebngIkHmatOEszF37dA';
const CORE_API_URL = 'https://api.core.ac.uk/v3';

export interface CoreSearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  year_from?: number;
  year_to?: number;
  domain?: string[];
}

export interface CoreSearchResponse {
  totalHits: number;
  results: CorePaper[];
}

interface CorePaper {
  id: string;
  title: string;
  authors: { name: string }[];
  abstract: string;
  doi?: string;
  year: number;
  downloadUrl?: string;
  journal?: string;
}

async function callCoreAPI(endpoint: string, params: Record<string, any> = {}): Promise<any> {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const url = `${CORE_API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CORE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`CORE API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling CORE API:', error);
    throw error;
  }
}

export async function searchPapers(params: CoreSearchParams): Promise<Paper[]> {
  const response: CoreSearchResponse = await callCoreAPI('/search/works', {
    q: params.query,
    offset: (params.page || 0) * (params.pageSize || 10),
    limit: params.pageSize || 10,
    year_min: params.year_from,
    year_max: params.year_to,
  });

  return response.results.map(paper => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors.map(author => author.name),
    year: paper.year,
    journal: paper.journal,
    doi: paper.doi,
    abstract: paper.abstract,
    uploaded: new Date(),
  }));
}

export async function getPaperByDOI(doi: string): Promise<Paper | null> {
  try {
    const response = await callCoreAPI('/works/search', { q: `doi:${doi}` });
    
    if (response.results && response.results.length > 0) {
      const paper = response.results[0];
      return {
        id: paper.id,
        title: paper.title,
        authors: paper.authors.map((author: { name: string }) => author.name),
        year: paper.year,
        journal: paper.journal,
        doi: paper.doi,
        abstract: paper.abstract,
        uploaded: new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching paper by DOI:', error);
    return null;
  }
}

export async function getFullText(paperId: string): Promise<string | null> {
  try {
    const response = await callCoreAPI(`/works/${paperId}/download`);
    if (response.downloadUrl) {
      const textResponse = await fetch(response.downloadUrl);
      return await textResponse.text();
    }
    return null;
  } catch (error) {
    console.error('Error fetching full text:', error);
    return null;
  }
}