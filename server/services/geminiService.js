const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGeminiAnalysis = async (code, language) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Return mock data if no API key
      return getMockAnalysis(code);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the following source code written in ${language}.

Determine whether the code is likely:
1. AI-generated
2. Human-written

Evaluate based on:
- naming style (generic vs meaningful names)
- comment style (present, absence, quality)
- code repetition patterns
- code structure and formatting consistency
- complexity and logic flow
- real-world domain logic presence
- uniqueness and personality in code
- error handling quality
- coding habits and patterns

Return ONLY valid JSON (no markdown, no explanation outside JSON):
{
  "aiScore": <number 0-100>,
  "humanScore": <number 0-100>,
  "result": "<Highly Likely AI Written | Likely AI Written | Uncertain | Likely Human Written | Highly Likely Human Written>",
  "reason": "<brief overall explanation>",
  "factors": [
    {"name": "Naming Style", "description": "<explanation>", "score": <0-100 AI likelihood>},
    {"name": "Comment Style", "description": "<explanation>", "score": <0-100>},
    {"name": "Code Structure", "description": "<explanation>", "score": <0-100>},
    {"name": "Repetition Pattern", "description": "<explanation>", "score": <0-100>},
    {"name": "Logic Complexity", "description": "<explanation>", "score": <0-100>},
    {"name": "Error Handling", "description": "<explanation>", "score": <0-100>},
    {"name": "Human Footprints", "description": "<explanation>", "score": <0-100>},
    {"name": "Business Logic", "description": "<explanation>", "score": <0-100>}
  ]
}

Code to analyze:
\`\`\`${language}
${code.substring(0, 3000)}
\`\`\``;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);

    // Ensure scores add up correctly
    const total = parsed.aiScore + parsed.humanScore;
    if (Math.abs(total - 100) > 5) {
      parsed.humanScore = 100 - parsed.aiScore;
    }

    return parsed;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return getMockAnalysis(code);
  }
};

// ── Exact similarity using token-level comparison (Jaccard + LCS hybrid) ──
const computeSimilarity = (codeA, codeB) => {
  // Normalize: remove extra whitespace, lowercase
  const normalize = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const a = normalize(codeA);
  const b = normalize(codeB);

  // 1. Exact match → 100%
  if (a === b) return 100;

  // 2. Tokenize into words/symbols
  const tokenize = (s) => s.match(/[a-zA-Z_]\w*|[0-9]+|[^\w\s]/g) || [];
  const tokA = tokenize(a);
  const tokB = tokenize(b);

  // 3. Jaccard similarity on token sets
  const setA = new Set(tokA);
  const setB = new Set(tokB);
  const intersection = new Set([...setA].filter(t => setB.has(t)));
  const union = new Set([...setA, ...setB]);
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;

  // 4. Bigram similarity on token sequence (catches structural similarity)
  const bigrams = (arr) => arr.slice(0, -1).map((t, i) => `${t}|${arr[i + 1]}`);
  const bigA = new Set(bigrams(tokA));
  const bigB = new Set(bigrams(tokB));
  const bigInter = new Set([...bigA].filter(t => bigB.has(t)));
  const bigUnion = new Set([...bigA, ...bigB]);
  const bigramSim = bigUnion.size > 0 ? bigInter.size / bigUnion.size : 0;

  // 5. Length ratio penalty (very different lengths = lower similarity)
  const lenRatio = Math.min(tokA.length, tokB.length) / Math.max(tokA.length, tokB.length || 1);

  // 6. Weighted final score
  const raw = (jaccard * 0.4) + (bigramSim * 0.4) + (lenRatio * 0.2);
  return Math.round(Math.min(100, raw * 100));
};

const getCompareAnalysis = async (humanCode, aiCode, language) => {
  try {
    // ── Step 1: Always compute real similarity locally first ──
    const similarity = computeSimilarity(humanCode, aiCode);

    // ── Step 2: If codes are identical or near-identical, return immediately ──
    if (similarity >= 98) {
      return {
        codeAScore: 50,
        codeBScore: 50,
        similarity: 100,
        verdict: 'Both code samples are identical. No differences detected. Submit two different code samples to compare AI vs human writing patterns.',
        differences: [
          { aspect: 'Overall', codeA: 'Identical to Code B', codeB: 'Identical to Code A' },
          { aspect: 'Similarity', codeA: '100% match', codeB: '100% match' },
          { aspect: 'Verdict', codeA: 'Please submit two different code samples', codeB: 'Please submit two different code samples' },
        ],
      };
    }

    // ── Step 3: Very high similarity (>85%) — flag before AI analysis ──
    if (similarity >= 85) {
      return {
        codeAScore: 50,
        codeBScore: 55,
        similarity,
        verdict: `Code A and Code B are ${similarity}% similar — they are nearly identical with only minor differences (whitespace, variable renaming, or small edits). No meaningful AI vs Human distinction can be made.`,
        differences: [
          { aspect: 'Overall Similarity', codeA: `${similarity}% match with Code B`, codeB: `${similarity}% match with Code A` },
          { aspect: 'Structure', codeA: 'Nearly identical structure', codeB: 'Nearly identical structure' },
          { aspect: 'Logic', codeA: 'Same logic flow', codeB: 'Same logic flow' },
          { aspect: 'Recommendation', codeA: 'Submit more distinct code samples', codeB: 'Submit more distinct code samples' },
        ],
      };
    }

    // ── Step 4: Use Gemini for genuinely different codes ──
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return getMockCompareAnalysis(similarity);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a code analysis expert. Compare these two ${language} code snippets.

IMPORTANT RULES:
- The structural similarity has already been computed as ${similarity}%. Use this value as the "similarity" field in your JSON.
- Do NOT recalculate or override the similarity value — always use ${similarity}.
- Focus your analysis on qualitative differences in coding style.

Analyze:
- Variable and function naming conventions (generic vs meaningful)
- Comment presence, quality, and style
- Code structure, formatting consistency
- Logic complexity and error handling
- Signs of AI generation (uniform style, no personal touches, perfect formatting)
- Signs of human writing (quirks, abbreviations, domain knowledge, comments)

Return ONLY valid JSON (no markdown, no backticks):
{
  "codeAScore": <number 0-100, AI likelihood for Code A>,
  "codeBScore": <number 0-100, AI likelihood for Code B>,
  "similarity": ${similarity},
  "verdict": "<one paragraph verdict comparing both codes>",
  "differences": [
    {"aspect": "Naming Style", "codeA": "<specific observation>", "codeB": "<specific observation>"},
    {"aspect": "Comments", "codeA": "<specific observation>", "codeB": "<specific observation>"},
    {"aspect": "Code Structure", "codeA": "<specific observation>", "codeB": "<specific observation>"},
    {"aspect": "Logic & Complexity", "codeA": "<specific observation>", "codeB": "<specific observation>"},
    {"aspect": "Error Handling", "codeA": "<specific observation>", "codeB": "<specific observation>"},
    {"aspect": "AI Indicators", "codeA": "<specific observation>", "codeB": "<specific observation>"}
  ]
}

Code A:
\`\`\`${language}
${humanCode.substring(0, 1800)}
\`\`\`

Code B:
\`\`\`${language}
${aiCode.substring(0, 1800)}
\`\`\``;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');

    const parsed = JSON.parse(jsonMatch[0]);

    // ── Always enforce our locally computed similarity ──
    parsed.similarity = similarity;

    return parsed;
  } catch (error) {
    console.error('Gemini compare error:', error.message);
    return getMockCompareAnalysis(similarity || 50);
  }
};

function getMockAnalysis(code) {
  const lines = code.split('\n').length;
  const hasComments = /\/\/|\/\*|#/.test(code);
  const hasGenericNames = /\b(data|temp|val|x|y|z|i|j|k|result|item|obj)\b/.test(code);

  let aiScore = 50;
  if (!hasComments) aiScore += 15;
  if (hasGenericNames) aiScore += 10;
  if (lines < 20) aiScore += 5;
  aiScore = Math.min(95, Math.max(5, aiScore));

  return {
    aiScore,
    humanScore: 100 - aiScore,
    result: aiScore > 70 ? 'Highly Likely AI Written' : aiScore > 50 ? 'Likely AI Written' : 'Likely Human Written',
    reason: 'Analysis based on code structure, naming conventions, and comment patterns.',
    factors: [
      { name: 'Naming Style', description: hasGenericNames ? 'Variable and function names are generic and standardized, typical of AI generation.' : 'Names show some domain-specific context.', score: hasGenericNames ? 75 : 35 },
      { name: 'Comment Style', description: hasComments ? 'Comments are present, which is a human indicator.' : 'No comments present, typical of AI-generated code.', score: hasComments ? 30 : 80 },
      { name: 'Code Structure', description: 'Code is neatly formatted with consistent indentation and structure.', score: 65 },
      { name: 'Repetition Pattern', description: 'Some repetitive patterns detected in loops and conditionals.', score: 60 },
      { name: 'Logic Complexity', description: 'Logic flow is straightforward without deep nesting or complex algorithms.', score: 55 },
      { name: 'Error Handling', description: 'Minimal error handling present, which is common in AI-generated examples.', score: 70 },
      { name: 'Human Footprints', description: 'Limited evidence of personal coding style or domain knowledge.', score: 65 },
      { name: 'Business Logic', description: 'Generic implementation without domain-specific business rules.', score: 60 }
    ]
  };
}

function getMockCompareAnalysis(similarity = 42) {
  if (similarity >= 98) {
    return {
      codeAScore: 50, codeBScore: 50, similarity: 100,
      verdict: 'Both code samples are identical. Submit two different code samples to compare AI vs human writing patterns.',
      differences: [{ aspect: 'Overall', codeA: 'Identical to Code B', codeB: 'Identical to Code A' }]
    };
  }
  if (similarity >= 75) {
    return {
      codeAScore: 48, codeBScore: 52, similarity,
      verdict: `The two code samples are ${similarity}% similar — nearly the same code with only minor stylistic differences.`,
      differences: [
        { aspect: 'Overall Similarity', codeA: `${similarity}% match`, codeB: `${similarity}% match` },
        { aspect: 'Structure', codeA: 'Highly similar structure', codeB: 'Highly similar structure' },
      ]
    };
  }
  return {
    codeAScore: 28, codeBScore: 76, similarity,
    verdict: `Code B shows ${100 - similarity}% difference from Code A. Code B exhibits more uniform structure and generic naming typical of AI-generated code.`,
    differences: [
      { aspect: 'Naming Style', codeA: 'Domain-specific meaningful names', codeB: 'Generic standardized names typical of AI' },
      { aspect: 'Structure', codeA: 'Organic with natural inconsistencies', codeB: 'Perfectly uniform and consistent' },
      { aspect: 'Comments', codeA: 'Contains explanatory inline comments', codeB: 'Minimal or no comments' },
      { aspect: 'Logic', codeA: 'Complex branching with edge cases', codeB: 'Simple direct logic, no edge cases' },
      { aspect: 'Error Handling', codeA: 'Robust specific error handling', codeB: 'Generic or absent error handling' },
    ]
  };
}

module.exports = { getGeminiAnalysis, getCompareAnalysis };
