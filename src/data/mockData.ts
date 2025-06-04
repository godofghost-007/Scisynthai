import { Paper, Hypothesis, Claim, FundingOpportunity } from '../types';

export const mockPapers: Paper[] = [
  {
    id: 'demo',
    title: 'Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
    authors: ['Jane Doe', 'John Smith', 'Emily Johnson'],
    journal: 'Nature Biotechnology',
    year: 2023,
    doi: '10.1038/s41587-023-1234-5',
    abstract:
      'CRISPR-Cas9 technology has revolutionized genome editing. This study explores new mechanisms of the CRISPR-Cas9 system and its applications in treating genetic disorders.',
    summary:
      'This paper presents groundbreaking research on CRISPR-Cas9 mechanisms, revealing new insights into how the system interacts with various DNA structures. The authors demonstrate improved specificity and reduced off-target effects through a novel modification of the Cas9 protein. Additionally, they showcase successful applications in correcting mutations associated with cystic fibrosis in human cell lines.',
    keyFindings: [
      'Discovery of a new Cas9 variant with 90% reduced off-target effects',
      'Successful correction of CFTR mutations in human epithelial cell lines',
      'Novel mechanism for Cas9-DNA interaction that enhances specificity',
      'Development of an improved delivery system for in vivo applications',
    ],
    uploaded: new Date('2023-12-15'),
  },
  {
    id: 'paper2',
    title: 'Machine Learning Approaches to Predict Protein-Ligand Interactions',
    authors: ['Robert Chen', 'Sarah Williams'],
    journal: 'Journal of Computational Chemistry',
    year: 2023,
    doi: '10.1002/jcc.26782',
    abstract:
      'This study applies deep learning techniques to predict protein-ligand interactions with unprecedented accuracy, potentially accelerating drug discovery.',
    uploaded: new Date('2023-11-10'),
  },
  {
    id: 'paper3',
    title: 'Climate Change Impact on Coral Reef Ecosystems',
    authors: ['Maria Rodriguez', 'David Kim', 'Lisa Wong'],
    journal: 'Nature Climate Change',
    year: 2023,
    doi: '10.1038/s41558-023-1678-2',
    abstract:
      'A comprehensive analysis of how rising ocean temperatures and acidification are affecting coral reef ecosystems worldwide.',
    uploaded: new Date('2023-10-05'),
  },
];

export const mockHypotheses: Hypothesis[] = [
  {
    id: 'demo',
    paperId: 'demo',
    statement:
      'The modified Cas9 variant can be effectively applied to correct mutations in the DMD gene responsible for Duchenne muscular dystrophy with minimal off-target effects.',
    confidence: 0.85,
    supportingEvidence: [
      {
        id: 'ev1',
        text: 'The modified Cas9 showed 90% reduction in off-target effects across all tested cell lines.',
        source: 'Figure 3, Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
        confidence: 0.92,
      },
      {
        id: 'ev2',
        text: 'Similar gene structures between CFTR and DMD suggest comparable editing efficiency.',
        source: 'Previous study: Zhang et al., 2022',
        confidence: 0.78,
      },
      {
        id: 'ev3',
        text: 'In vitro experiments with DMD gene fragments showed successful editing.',
        source: 'Supplementary Data, Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
        confidence: 0.88,
      },
    ],
    generated: new Date('2023-12-16'),
  },
  {
    id: 'hyp2',
    paperId: 'demo',
    statement:
      'The novel delivery system developed in this study could be adapted for targeting neurons in the central nervous system to treat neurodegenerative disorders.',
    confidence: 0.72,
    supportingEvidence: [
      {
        id: 'ev4',
        text: 'The delivery system successfully penetrated membrane barriers in epithelial cells.',
        source: 'Figure 5, Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
        confidence: 0.85,
      },
      {
        id: 'ev5',
        text: 'The lipid nanoparticle composition is similar to those used in previous CNS delivery studies.',
        source: 'Related study: Brown et al., 2021',
        confidence: 0.65,
      },
    ],
    generated: new Date('2023-12-16'),
  },
];

export const mockClaims: Claim[] = [
  {
    id: 'demo',
    hypothesisId: 'demo',
    statement:
      'The modified Cas9 variant reduces off-target effects by 90% compared to standard Cas9.',
    verificationStatus: 'verified',
    supportingEvidence: [
      {
        id: 'ev6',
        text: 'Multiple assays confirmed 88-92% reduction in off-target effects across all tested cell lines.',
        source: 'Figure 3, Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
        confidence: 0.95,
      },
      {
        id: 'ev7',
        text: 'Whole-genome sequencing showed significantly fewer unintended edits.',
        source: 'Table 2, Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
        confidence: 0.92,
      },
      {
        id: 'ev8',
        text: 'Independent study by Liu et al. confirmed similar reduction in off-target effects.',
        source: 'Journal of Molecular Biology, 2023',
        confidence: 0.88,
      },
    ],
    confidence: 0.93,
  },
  {
    id: 'claim2',
    hypothesisId: 'demo',
    statement: 'The modified Cas9 can successfully correct DMD gene mutations in human cells.',
    verificationStatus: 'partially verified',
    supportingEvidence: [
      {
        id: 'ev9',
        text: 'The modified Cas9 corrected DMD mutations in vitro in isolated DNA fragments.',
        source: 'Supplementary Data, Novel Insights into CRISPR-Cas9 Mechanisms and Applications',
        confidence: 0.87,
      },
      {
        id: 'ev10',
        text: 'Limited cell culture tests showed successful editing in some cell lines.',
        source: 'Unpublished data referenced in discussion',
        confidence: 0.62,
      },
    ],
    confidence: 0.74,
  },
];

export const mockFundingOpportunities: FundingOpportunity[] = [
  {
    id: 'fund1',
    title: 'Innovative Gene Editing Technologies for Genetic Disorders',
    organization: 'National Institutes of Health (NIH)',
    amount: '$1,500,000 - $2,500,000',
    deadline: new Date('2024-05-15'),
    description:
      'This funding opportunity supports research developing novel gene editing technologies for the treatment of genetic disorders. Emphasis on technologies with improved specificity, efficiency, and delivery systems.',
    eligibility: 'Academic institutions, non-profit research organizations, and small businesses.',
    url: 'https://www.nih.gov/funding/opportunities',
    matchScore: 95,
    keywords: ['CRISPR', 'gene editing', 'genetic disorders', 'delivery systems'],
  },
  {
    id: 'fund2',
    title: 'Translational Research in Genetic Medicine',
    organization: 'Howard Hughes Medical Institute (HHMI)',
    amount: '$750,000 - $1,250,000',
    deadline: new Date('2024-03-30'),
    description:
      'Supports research that bridges the gap between basic science discoveries and clinical applications in genetic medicine. Focus on innovative approaches to treat genetic disorders.',
    eligibility: 'Independent investigators at research institutions.',
    url: 'https://www.hhmi.org/programs',
    matchScore: 87,
    keywords: ['translational research', 'genetic medicine', 'clinical applications'],
  },
  {
    id: 'fund3',
    title: 'Next-Generation Genomic Technologies',
    organization: 'Chan Zuckerberg Initiative',
    amount: '$500,000 - $1,000,000',
    deadline: new Date('2024-06-15'),
    description:
      'This program supports the development of new technologies that will enable novel or improved approaches to understanding, diagnosing, and treating disease.',
    eligibility: 'Research institutions worldwide.',
    url: 'https://chanzuckerberg.com/science/programs-resources',
    matchScore: 82,
    keywords: ['genomic technologies', 'disease treatment', 'innovation'],
  },
  {
    id: 'fund4',
    title: 'Breakthrough Technologies for Rare Diseases',
    organization: 'Bill & Melinda Gates Foundation',
    amount: '$300,000 - $800,000',
    deadline: new Date('2024-04-20'),
    description:
      'Supports innovative technologies and approaches for diagnosing and treating rare genetic diseases, with emphasis on approaches that could scale globally.',
    eligibility: 'Global research organizations and institutions.',
    url: 'https://www.gatesfoundation.org/funding',
    matchScore: 78,
    keywords: ['rare diseases', 'genetic disorders', 'global health'],
  },
];