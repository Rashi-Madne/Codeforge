import { useState } from "react";
import Editor from "@monaco-editor/react";

const problems = [
  {
    id: 1,
    title: "Print 10",
    difficulty: "Easy",
    category: "Basics",
    description: "Print the number 10.",
    expected: "10",
    starterPython: "print(10)",
    starterJava: `public class Main {
    public static void main(String[] args) {
        System.out.println(10);
    }
}`
  },

  {
    id: 2,
    title: "Print Hello World",
    difficulty: "Easy",
    category: "Strings",
    description: "Print Hello World exactly.",
    expected: "Hello World",
    starterPython: `print("Hello World")`,
    starterJava: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
  },

  {
    id: 3,
    title: "Print Your Name",
    difficulty: "Medium",
    category: "Strings",
    description: "Print your name.",
    expected: "Rashi",
    starterPython: `print("Rashi")`,
    starterJava: `public class Main {
        public static void main(String[] args) {
            System.out.println("Rashi");
        }
    }`
  }
];

function App() {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(problems[0].starterPython);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
const [solvedProblems, setSolvedProblems] = useState([]);

  const filteredProblems = problems.filter((problem) =>
  problem.title.toLowerCase().includes(search.toLowerCase())
);

  const changeProblem = (problem) => {
    setSelectedProblem(problem);

    if (language === "python") {
      setCode(problem.starterPython);
    } else {
      setCode(problem.starterJava);
    }

    setResult(null);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);

    if (lang === "python") {
      setCode(selectedProblem.starterPython);
    } else {
      setCode(selectedProblem.starterJava);
    }
  };

  const runCode = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8082/api/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            language,
            code,
            input: "",
            testCases: [
              {
                input: "",
                expected: selectedProblem.expected
              }
            ]
          })
        }
      );

      const data = await response.json();

setResult(data);

if (
  data.status === "SUCCESS" &&
  data.passed === data.total
) {
  setSolvedProblems((prev) => {

    if (
      prev.includes(selectedProblem.id)
    ) {
      return prev;
    }

    return [
      ...prev,
      selectedProblem.id
    ];
  });
}
    } catch (error) {
      setResult({
        status: "ERROR",
        error: error.message
      });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>CodeForge</h2>

        <p
  style={{
    color: "#9ca3af",
    marginBottom: "15px"
  }}
>
  Solved:
  {" "}
  {solvedProblems.length}
  /
  {problems.length}
</p>

<h3>
  Problems ({filteredProblems.length})
</h3>

<input
  type="text"
  placeholder="Search Problems..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  style={styles.searchBox}
/>

{filteredProblems.map((problem) => (
  <div
    key={problem.id}
    onClick={() => changeProblem(problem)}
    style={{
      ...styles.problemCard,
      backgroundColor:
        selectedProblem.id === problem.id
          ? "#2563eb"
          : "#1f2937"
    }}
  >
    <div>
      {problem.difficulty === "Easy" && "🟢"}
      {problem.difficulty === "Medium" && "🟡"}
      {problem.difficulty === "Hard" && "🔴"}

      {" "}
      {problem.title}

      {solvedProblems.includes(problem.id) && (
        <span
          style={{
            color: "#22c55e",
            marginLeft: "8px"
          }}
        >
          ✓
        </span>
      )}
    </div>

    <small>
      {problem.category}
    </small>
  </div>
))}
    
        </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.problemBox}>
  <h2>{selectedProblem.title}</h2>

  <p>{selectedProblem.description}</p>

  <p>
    <strong>Difficulty:</strong>
    {" "}
    {selectedProblem.difficulty}
  </p>

<p>
  <strong>Category:</strong>{" "}
  {selectedProblem.category}
</p>

<p>
  <strong>Acceptance:</strong>{" "}
  92%
</p>

<p>
  <strong>Submissions:</strong>{" "}
  1450
</p>

  <p>
    <b>Expected Output:</b>
    {" "}
    {selectedProblem.expected}
  </p>
</div>

        <div style={styles.toolbar}>
          <select
            value={language}
            onChange={(e) =>
              changeLanguage(e.target.value)
            }
            style={styles.select}
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={runCode}
            style={styles.runButton}
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        <Editor
          height="70vh"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) =>
            setCode(value || "")
          }
        />
      </div>

      {/* Results */}
      <div style={styles.results}>
        <h2>Results</h2>

        {!result && (
          <p>Run code to see results.</p>
        )}

        {result && (
          <>
            <div style={styles.resultCard}>
              <p>
                <strong>Status:</strong>{" "}
                {result.status}
              </p>

              <p>
                <strong>Passed:</strong>{" "}
                {result.passed || 0}/
                {result.total || 0}
              </p>

              <p>
                <strong>Output:</strong>
              </p>

              <pre>{result.output}</pre>

              {result.error && (
                <>
                  <p>
                    <strong>Error:</strong>
                  </p>

                  <pre>{result.error}</pre>
                </>
              )}
            </div>

            {result.testResults &&
              result.testResults.map(
                (test, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.testCard,
                      backgroundColor:
                        test.passed
                          ? "#14532d"
                          : "#7f1d1d"
                    }}
                  >
                    <p>
                      <strong>Expected:</strong>{" "}
                      {test.expected}
                    </p>

                    <p>
                      <strong>Actual:</strong>{" "}
                      {test.actual}
                    </p>

                    <p>
                      {test.passed
                        ? "✔ PASS"
                        : "❌ FAIL"}
                    </p>
                  </div>
                )
              )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {

  searchBox: {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none"
},

problemCard: {
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.2s"
},
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0d1117",
    color: "white"
  },

  sidebar: {
    width: "240px",
    backgroundColor: "#111827",
    padding: "20px",
    overflowY: "auto"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  problemBox: {
    backgroundColor: "#161b22",
    padding: "15px"
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#111827"
  },

  select: {
    padding: "8px"
  },

  runButton: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  results: {
    width: "350px",
    backgroundColor: "#111827",
    padding: "20px",
    overflowY: "auto"
  },

  resultCard: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px"
  },

  testCard: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px"
  }
};

export default App;