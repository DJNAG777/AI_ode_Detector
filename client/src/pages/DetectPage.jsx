import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor.jsx'
import { detectAPI } from '../services/api.js'

const LANGUAGES = ['C', 'C++', 'Java', 'Python']

const SAMPLES = {
  'C++': `#include <iostream>\n#include <vector>\n#include <cstdlib>\n#include <cmath>\n#include <ctime>\nusing namespace std;\nconst double SLOT_TIME = 51.2;\n\nint main(){\n    srand(static_cast<unsigned int>(time(0)));\n    int N, totalSlots;\n    cout<<"Enter the number of stations (N): ";\n    cin>> N;\n    cout<<"Enter the total number of time slots to simulate: ";\n    cin>>totalSlots;\n    vector<bool> stationReady(N,true);\n    vector<vector<double>>successfulTransmissionTimes(N);\n    vector<double>backoffTimers(N,0);\n    vector<int>collisions(N,0);\n    for(int currentSlot=0; currentSlot < totalSlots; currentSlot++){\n        int transmittingStations =0;\n        for(int i=0; i < N; i++){\n            if(backoffTimers[i] <= 0 && stationReady[i]){\n                transmittingStations++;\n            }\n        }\n    }\n    return 0;\n}`,
  Python: `def calculate_fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    fib_sequence = [0, 1]\n    for i in range(2, n):\n        fib_sequence.append(fib_sequence[i-1] + fib_sequence[i-2])\n    return fib_sequence\n\ndef main():\n    num_terms = int(input("Enter number of terms: "))\n    result = calculate_fibonacci(num_terms)\n    print(f"Fibonacci sequence: {result}")\n\nif __name__ == "__main__":\n    main()`,
  Java: `import java.util.Scanner;\nimport java.util.ArrayList;\n\npublic class StudentGradeCalculator {\n    private ArrayList<Integer> grades;\n    private String studentName;\n    \n    public StudentGradeCalculator(String name) {\n        this.studentName = name;\n        this.grades = new ArrayList<>();\n    }\n    \n    public void addGrade(int grade) {\n        if (grade >= 0 && grade <= 100) { grades.add(grade); }\n    }\n    \n    public double calculateAverage() {\n        if (grades.isEmpty()) return 0.0;\n        int sum = 0;\n        for (int grade : grades) { sum += grade; }\n        return (double) sum / grades.size();\n    }\n    \n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print("Enter student name: ");\n        String name = scanner.nextLine();\n        StudentGradeCalculator calc = new StudentGradeCalculator(name);\n        System.out.println("Average: " + calc.calculateAverage());\n    }\n}`,
  C: `#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX_SIZE 100\n\ntypedef struct {\n    int data[MAX_SIZE];\n    int top;\n} Stack;\n\nvoid initStack(Stack *s) { s->top = -1; }\nint isEmpty(Stack *s) { return s->top == -1; }\n\nvoid push(Stack *s, int val) {\n    if (s->top < MAX_SIZE - 1) s->data[++s->top] = val;\n}\n\nint pop(Stack *s) {\n    if (!isEmpty(s)) return s->data[s->top--];\n    return -1;\n}\n\nint main() {\n    Stack stack;\n    initStack(&stack);\n    push(&stack, 10); push(&stack, 20); push(&stack, 30);\n    printf("Popped: %d\\n", pop(&stack));\n    return 0;\n}`,
}

export default function DetectPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('C++')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!code.trim()) return setError('Please paste some code to analyze.')
    if (code.trim().length < 20) return setError('Code is too short. Please paste more code.')
    setError('')
    setLoading(true)
    try {
      const res = await detectAPI.single({ code, language })
      navigate('/result', { state: { report: res.data.report, code, language } })
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', padding: '56px 0', background: 'linear-gradient(135deg,#f8f9ff,#eef2ff)' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 10 }}>AI Detection Analysis</h1>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Paste your source code to detect if it was written by AI or a human</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Language */}
          <div className="form-group" style={{ maxWidth: 280 }}>
            <label className="form-label">Programming Language:</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Code input */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="form-label" style={{ margin: 0 }}>Paste Your Code:</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCode(SAMPLES[language] || SAMPLES['C++'])} className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>📋 Load Example</button>
                <button onClick={() => setCode('')} className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>🗑️ Clear</button>
              </div>
            </div>
            <CodeEditor value={code} onChange={setCode} language={language.toLowerCase().replace('++', 'pp')} placeholder={`Paste your ${language} code here...\n\nOr click "Load Example" to try with sample code.`} height={360} />
            <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af' }}>{code.length} characters • {code.split('\n').length} lines</div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button onClick={handleAnalyze} disabled={loading || !code.trim()} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 17, marginTop: 4 }}>
            {loading ? <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analyzing Code...</> : '🔍 Analyze Code'}
          </button>

          {loading && (
            <div style={{ marginTop: 18, padding: 18, background: 'rgba(99,102,241,0.05)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ color: '#6366f1', fontWeight: 600, marginBottom: 6 }}>🤖 Running Analysis...</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>AST parsing → Gemini AI evaluation → Score calculation</div>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="grid-3" style={{ marginTop: 20 }}>
          {[
            { icon: '🌳', title: 'AST Analysis', desc: 'Syntax tree structure, naming, nesting depth' },
            { icon: '🤖', title: 'Gemini AI', desc: 'Google AI evaluates style and human footprints' },
            { icon: '📊', title: 'Combined Score', desc: 'Final = AST (60%) + Gemini (40%)' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 18, border: '1px solid rgba(99,102,241,0.1)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 22, minWidth: 28 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
