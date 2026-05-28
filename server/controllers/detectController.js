const { getGeminiAnalysis, getCompareAnalysis } = require('../services/geminiService');
const { analyzeAST, calculateFinalScore } = require('../services/astService');
const Report = require('../models/Report');
const User = require('../models/User');
const AdmZip = require('adm-zip');
const path = require('path');

const SUPPORTED_EXTENSIONS = {
  '.c': 'C', '.cpp': 'C++', '.cc': 'C++', '.cxx': 'C++',
  '.java': 'Java', '.py': 'Python'
};

const detectSingle = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    if (code.length > 50000) {
      return res.status(400).json({ error: 'Code too long. Max 50,000 characters.' });
    }

    // Run AST analysis
    const astResult = analyzeAST(code, language);

    // Run Gemini analysis
    const geminiResult = await getGeminiAnalysis(code, language);

    // Calculate final score
    const finalAIScore = calculateFinalScore(astResult.score, geminiResult.aiScore);
    const finalHumanScore = 100 - finalAIScore;

    const result = getResultLabel(finalAIScore);

    const report = {
      type: 'single',
      language,
      aiScore: finalAIScore,
      humanScore: finalHumanScore,
      result,
      explanation: geminiResult.reason || 'Analysis complete.',
      factors: geminiResult.factors || [],
      astMetrics: astResult.metrics,
      codeSnippet: code.substring(0, 500)
    };

    // Save to DB if user is logged in
    if (req.user) {
      const savedReport = await Report.create({ ...report, userId: req.user._id });
      await User.findByIdAndUpdate(req.user._id, { $inc: { detectionCount: 1 } });
      report._id = savedReport._id;
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Detection failed: ' + error.message });
  }
};

const detectCompare = async (req, res) => {
  try {
    const { humanCode, aiCode, language } = req.body;

    if (!humanCode || !aiCode || !language) {
      return res.status(400).json({ error: 'Both code samples and language are required' });
    }

    if (humanCode.length > 50000 || aiCode.length > 50000) {
      return res.status(400).json({ error: 'Code too long. Max 50,000 characters each.' });
    }

    // getCompareAnalysis now handles similarity calculation internally
    const compareResult = await getCompareAnalysis(humanCode, aiCode, language);

    // similarity is now always accurate (computed locally before Gemini)
    const similarity = compareResult.similarity;

    // If identical, skip AST blending — scores are meaningless for same code
    let finalScoreA = compareResult.codeAScore;
    let finalScoreB = compareResult.codeBScore;

    if (similarity < 98) {
      // Only blend with AST when codes are genuinely different
      const astA = analyzeAST(humanCode, language);
      const astB = analyzeAST(aiCode, language);
      finalScoreA = calculateFinalScore(astA.score, compareResult.codeAScore);
      finalScoreB = calculateFinalScore(astB.score, compareResult.codeBScore);
    }

    const response = {
      codeAScore: Math.round(finalScoreA),
      codeBScore: Math.round(finalScoreB),
      similarity,
      verdict: compareResult.verdict,
      differences: compareResult.differences || [],
    };

    res.json({ success: true, comparison: response });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Comparison failed: ' + error.message });
  }
};

const detectUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (ext === '.zip') {
        // Process ZIP
        try {
          const zip = new AdmZip(file.buffer);
          const entries = zip.getEntries();
          
          for (const entry of entries) {
            const entryExt = path.extname(entry.entryName).toLowerCase();
            const lang = SUPPORTED_EXTENSIONS[entryExt];
            if (lang && !entry.isDirectory) {
              const code = entry.getData().toString('utf8');
              const astResult = analyzeAST(code, lang);
              const geminiResult = await getGeminiAnalysis(code.substring(0, 2000), lang);
              const finalScore = calculateFinalScore(astResult.score, geminiResult.aiScore);
              
              results.push({
                filename: entry.entryName,
                language: lang,
                aiScore: finalScore,
                humanScore: 100 - finalScore,
                result: getResultLabel(finalScore),
                lines: code.split('\n').length
              });
            }
          }
        } catch (zipErr) {
          console.error('ZIP error:', zipErr.message);
        }
      } else {
        const lang = SUPPORTED_EXTENSIONS[ext];
        if (lang) {
          const code = file.buffer.toString('utf8');
          const astResult = analyzeAST(code, lang);
          const geminiResult = await getGeminiAnalysis(code.substring(0, 2000), lang);
          const finalScore = calculateFinalScore(astResult.score, geminiResult.aiScore);
          
          results.push({
            filename: file.originalname,
            language: lang,
            aiScore: finalScore,
            humanScore: 100 - finalScore,
            result: getResultLabel(finalScore),
            lines: code.split('\n').length
          });
        }
      }
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'No supported files found (.c, .cpp, .java, .py, .zip)' });
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload processing failed: ' + error.message });
  }
};

function getResultLabel(score) {
  if (score >= 80) return 'Highly Likely AI Written';
  if (score >= 60) return 'Likely AI Written';
  if (score >= 40) return 'Uncertain';
  if (score >= 20) return 'Likely Human Written';
  return 'Highly Likely Human Written';
}

module.exports = { detectSingle, detectCompare, detectUpload };
