import { Paper, Hypothesis, Claim } from '../types';

const API_KEY = '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';

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function callOpenAI(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

export async function generatePaperSummary(paper: Paper): Promise<{ summary: string; keyFindings: string[] }> {
  const prompt = `
    Please analyze this research paper and provide:
    1. A concise summary of the main findings and implications
    2. A list of key findings (maximum 5 points)

    Title: ${paper.title}
    Authors: ${paper.authors.join(', ')}
    Abstract: ${paper.abstract}
    ${paper.fullText ? `Full Text: ${paper.fullText}` : ''}
  `;

  const response = await callOpenAI(prompt);
  
  // Parse the response
  const [summarySection, findingsSection] = response.split('\n\nKey Findings:\n');
  const keyFindings = findingsSection
    .split('\n')
    .filter(line => line.trim())
    .map(finding => finding.replace(/^[•\-\d.]\s*/, ''));

  return {
    summary: summarySection.trim(),
    keyFindings: keyFindings,
  };
}

export async function generateHypotheses(paper: Paper): Promise<Hypothesis[]> {
  const prompt = `
    Based on this research paper, generate 3 novel research hypotheses that:
    1. Build upon the paper's findings
    2. Suggest new directions for research
    3. Include supporting evidence from the paper

    Title: ${paper.title}
    Authors: ${paper.authors.join(', ')}
    Abstract: ${paper.abstract}
    ${paper.summary ? `Summary: ${paper.summary}` : ''}
    ${paper.keyFindings ? `Key Findings:\n${paper.keyFindings.join('\n')}` : ''}
  `;

  const response = await callOpenAI(prompt);
  
  // Parse the response into structured hypotheses
  const hypotheses = response
    .split('\n\nHypothesis ')
    .filter(h => h.trim())
    .map((h, index) => {
      const [statement, ...evidenceLines] = h.split('\n\nSupporting Evidence:\n');
      const evidence = evidenceLines[0]
        .split('\n')
        .filter(e => e.trim())
        .map((text, i) => ({
          id: `ev-${index}-${i}`,
          text: text.replace(/^[•\-\d.]\s*/, ''),
          source: paper.title,
          confidence: 0.8,
        }));

      return {
        id: `hyp-${Date.now()}-${index}`,
        paperId: paper.id,
        statement: statement.replace(/^\d+[:.]\s*/, '').trim(),
        confidence: 0.85,
        supportingEvidence: evidence,
        generated: new Date(),
      };
    });

  return hypotheses;
}

export async function verifyClaim(claim: Claim): Promise<{
  verificationStatus: 'verified' | 'partially verified' | 'unverified' | 'disputed';
  confidence: number;
  evidence: Evidence[];
}> {
  const prompt = `
    Please verify this scientific claim and provide evidence:
    "${claim.statement}"

    Analyze the claim and:
    1. Determine if it is supported by existing research
    2. Provide specific evidence supporting or contradicting the claim
    3. Assign a verification status (verified, partially verified, disputed, or unverified)
    4. Include confidence level and sources
  `;

  const response = await callOpenAI(prompt);
  
  // Parse the response
  const lines = response.split('\n');
  const status = lines.find(l => l.toLowerCase().includes('status'))?.split(':')[1].trim().toLowerCase() || 'unverified';
  const confidence = parseFloat(lines.find(l => l.toLowerCase().includes('confidence'))?.split(':')[1] || '0.7');
  
  const evidenceSection = response.split('Evidence:')[1] || '';
  const evidence = evidenceSection
    .split('\n')
    .filter(e => e.trim())
    .map((text, i) => ({
      id: `ev-${Date.now()}-${i}`,
      text: text.replace(/^[•\-\d.]\s*/, ''),
      source: 'Literature Analysis',
      confidence: 0.8,
    }));

  return {
    verificationStatus: status as 'verified' | 'partially verified' | 'unverified' | 'disputed',
    confidence,
    evidence,
  };
}

export interface Evidence {
  id: string;
  text: string;
  source: string;
  confidence: number;
}