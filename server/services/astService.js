// AST-based analysis engine for code detection
// Uses heuristic analysis since tree-sitter requires native bindings

const analyzeAST = (code, language) => {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim());
  
  const metrics = {
    totalLines: lines.length,
    codeLines: nonEmptyLines.length,
    commentLines: countComments(code, language),
    nestingDepth: calculateNestingDepth(code),
    cyclomaticComplexity: calculateComplexity(code),
    identifierEntropy: calculateIdentifierEntropy(code),
    repetitionScore: calculateRepetition(code),
    genericNamingScore: calculateGenericNaming(code),
    commentRatio: 0,
    modularity: calculateModularity(code),
  };

  metrics.commentRatio = metrics.codeLines > 0 
    ? (metrics.commentLines / metrics.codeLines) * 100 
    : 0;

  // Calculate AST-based AI score
  let astScore = 0;
  
  // Low comment ratio → more AI-like
  if (metrics.commentRatio < 5) astScore += 20;
  else if (metrics.commentRatio < 15) astScore += 10;
  else astScore -= 5;

  // Generic naming → more AI-like
  astScore += metrics.genericNamingScore * 0.3;

  // High repetition → more AI-like
  astScore += metrics.repetitionScore * 0.25;

  // Very uniform nesting → more AI-like
  if (metrics.nestingDepth.variance < 0.5) astScore += 15;

  // Low complexity can indicate AI (simple patterns)
  if (metrics.cyclomaticComplexity < 3) astScore += 10;

  // Low identifier entropy → more AI-like (fewer unique names)
  if (metrics.identifierEntropy < 2.5) astScore += 15;

  // High modularity (many small functions) slightly AI-like
  if (metrics.modularity > 0.7) astScore += 5;

  astScore = Math.min(95, Math.max(5, astScore));

  return {
    score: Math.round(astScore),
    metrics
  };
};

function countComments(code, language) {
  let count = 0;
  const lines = code.split('\n');
  
  if (['c', 'cpp', 'java', 'javascript'].includes(language.toLowerCase())) {
    let inBlock = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (inBlock) {
        count++;
        if (trimmed.includes('*/')) inBlock = false;
      } else if (trimmed.startsWith('//')) {
        count++;
      } else if (trimmed.includes('/*')) {
        count++;
        inBlock = !trimmed.includes('*/');
      }
    }
  } else if (language.toLowerCase() === 'python') {
    let inDocstring = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        count++;
      } else if (trimmed.includes('"""') || trimmed.includes("'''")) {
        count++;
        const quoteChar = trimmed.includes('"""') ? '"""' : "'''";
        const occurrences = (trimmed.match(new RegExp(quoteChar, 'g')) || []).length;
        if (occurrences < 2) inDocstring = !inDocstring;
      } else if (inDocstring) {
        count++;
      }
    }
  }
  
  return count;
}

function calculateNestingDepth(code) {
  const lines = code.split('\n');
  const depths = [];
  let current = 0;
  
  for (const line of lines) {
    const opens = (line.match(/[\{(]/g) || []).length;
    const closes = (line.match(/[\}(]/g) || []).length;
    // Python indentation
    const indent = line.match(/^(\s*)/)[1].length;
    current = Math.max(0, current + opens - closes);
    depths.push(current || Math.floor(indent / 4));
  }
  
  const avg = depths.reduce((a, b) => a + b, 0) / depths.length;
  const variance = depths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / depths.length;
  
  return { max: Math.max(...depths), avg: avg.toFixed(2), variance: variance.toFixed(2) };
}

function calculateComplexity(code) {
  // Count decision points
  const patterns = [/\bif\b/g, /\belse\b/g, /\bfor\b/g, /\bwhile\b/g, 
                    /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g, /&&|\|\|/g];
  let complexity = 1;
  for (const pattern of patterns) {
    const matches = code.match(pattern);
    if (matches) complexity += matches.length;
  }
  return complexity;
}

function calculateIdentifierEntropy(code) {
  // Extract identifiers and calculate Shannon entropy of their lengths
  const identifiers = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]{2,}\b/g) || [];
  if (identifiers.length === 0) return 3;
  
  const uniqueIds = new Set(identifiers);
  const lengths = [...uniqueIds].map(id => id.length);
  
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
  
  // Also check for unique name ratio
  const uniqueRatio = uniqueIds.size / identifiers.length;
  
  return (Math.sqrt(variance) + uniqueRatio * 3).toFixed(2);
}

function calculateRepetition(code) {
  const lines = code.split('\n').filter(l => l.trim());
  if (lines.length < 3) return 0;
  
  let duplicates = 0;
  const seen = new Set();
  
  for (const line of lines) {
    const normalized = line.trim().replace(/\s+/g, ' ');
    if (normalized.length > 10) {
      if (seen.has(normalized)) duplicates++;
      else seen.add(normalized);
    }
  }
  
  return Math.min(100, (duplicates / lines.length) * 200);
}

function calculateGenericNaming(code) {
  const genericPatterns = [
    /\b(data|temp|val|value|result|item|obj|arr|list|num|str|buf|ptr|flag|ret|ret_val)\b/gi,
    /\b(i|j|k|x|y|z|n|m|p|q)\b/g,
    /\b(foo|bar|baz|test|example|sample|dummy)\b/gi,
    /\b(func\d+|var\d+|method\d+|class\d+)\b/gi
  ];
  
  let genericCount = 0;
  for (const pattern of genericPatterns) {
    const matches = code.match(pattern);
    if (matches) genericCount += matches.length;
  }
  
  const totalIdentifiers = (code.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || []).length;
  if (totalIdentifiers === 0) return 50;
  
  return Math.min(100, (genericCount / totalIdentifiers) * 300);
}

function calculateModularity(code) {
  const functionCount = (code.match(/\b(function|def|void|int|string|bool)\s+\w+\s*\(/g) || []).length;
  const lines = code.split('\n').length;
  
  if (lines === 0) return 0;
  return Math.min(1, functionCount / (lines / 20));
}

const calculateFinalScore = (astScore, geminiScore) => {
  return Math.round((astScore * 0.6) + (geminiScore * 0.4));
};

module.exports = { analyzeAST, calculateFinalScore };
