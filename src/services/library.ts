import { Paper, SearchFilters } from '../types';
import natural from 'natural';
import { searchPapers, getPaperByDOI, getFullText } from './core';

const TfIdf = natural.TfIdf;

class ResearchLibrary {
  private papers: Paper[] = [];
  private tfidf: natural.TfIdf;

  constructor() {
    this.tfidf = new TfIdf();
  }

  private addToIndex(paper: Paper) {
    const documentText = `${paper.title} ${paper.abstract || ''} ${paper.fullText || ''}`;
    this.tfidf.addDocument(documentText);
  }

  async addPaper(paperOrDOI: Paper | string): Promise<Paper | null> {
    try {
      let paper: Paper | null;
      
      if (typeof paperOrDOI === 'string') {
        paper = await getPaperByDOI(paperOrDOI);
        if (!paper) return null;
      } else {
        paper = paperOrDOI;
      }

      // Get full text if available
      const fullText = await getFullText(paper.id);
      if (fullText) {
        paper.fullText = fullText;
      }

      this.papers.push(paper);
      this.addToIndex(paper);
      return paper;
    } catch (error) {
      console.error('Error adding paper to library:', error);
      return null;
    }
  }

  async searchPapers(query: string, filters?: SearchFilters): Promise<Paper[]> {
    try {
      const searchResults = await searchPapers({
        query,
        year_from: filters?.startDate?.getFullYear(),
        year_to: filters?.endDate?.getFullYear(),
        domain: filters?.domain,
      });

      return searchResults;
    } catch (error) {
      console.error('Error searching papers:', error);
      return [];
    }
  }

  getPaper(id: string): Paper | undefined {
    return this.papers.find(paper => paper.id === id);
  }

  getAllPapers(): Paper[] {
    return [...this.papers];
  }

  searchLocal(query: string): Paper[] {
    const terms = query.toLowerCase().split(' ');
    return this.papers
      .map(paper => {
        const score = terms.reduce((acc, term) => {
          const titleMatch = paper.title.toLowerCase().includes(term) ? 2 : 0;
          const abstractMatch = paper.abstract?.toLowerCase().includes(term) ? 1 : 0;
          return acc + titleMatch + abstractMatch;
        }, 0);
        return { paper, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.paper);
  }
}

export const library = new ResearchLibrary();