import { useState, useEffect } from "react";
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
  const [history, setHistory] = useState(() => {
  const saved =
    localStorage.getItem("history");

  return saved
    ? JSON.parse(saved)
    : [];
});
  const [user, setUser] = useState(() => {
  const saved =
    localStorage.getItem("user");

  return saved
    ? JSON.parse(saved)
    : {
        name: "Rashi",
        points: 0,
        streak: 0
      };
});
  const [solvedProblems, setSolvedProblems] = useState(() => {
    const saved =
    localStorage.getItem("solvedProblems");

    return saved
    ? JSON.parse(saved)
    : [];
});
useEffect(() => {
  localStorage.setItem(
    "solvedProblems",
    JSON.stringify(solvedProblems)
  );
}, [solvedProblems]);

useEffect(() => {
  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}, [history]);

useEffect(() => {
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
}, [user]);
useEffect(() => {
  const savedCode = localStorage.getItem("code");
  if (savedCode) {
    setCode(savedCode);
  }
}, []);

useEffect(() => {
  localStorage.setItem("code", code);
}, [code]);

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
setHistory((prev) => [
  {
    problem: selectedProblem.title,
    status:
String(data.status).trim().toUpperCase() === "SUCCESS" &&
data.passed === data.total
  ? "ACCEPTED"
  : "FAILED",
    passed: data.passed,
    total: data.total,
    time: new Date().toLocaleTimeString()
  },
  ...prev
]);

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
  setUser((prev) => {
  const today =
    new Date().toDateString();

  const lastSolved =
    localStorage.getItem(
      "lastSolvedDate"
    );

  let newStreak =
    prev.streak;

  if (
    lastSolved !== today
  ) {
    newStreak =
      prev.streak + 1;

    localStorage.setItem(
      "lastSolvedDate",
      today
    );
  }

  return {
    ...prev,
    points:
      prev.points + 10,
    streak:
      newStreak
  };
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
        <div
  style={{
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "10px",
    marginBottom: "15px"
  }}
>
  <h3>
  {user.name}
  {" "}
  🏆
</h3>
<p>
  Rank:
  {" "}
  {user.points >= 100
    ? "Advanced"
    : user.points >= 50
    ? "Intermediate"
    : "Beginner"}
</p>

  <p>
  🔥 Streak:
  {" "}
  {user.streak}
  {" "}
  Day
  {user.streak !== 1
    ? "s"
    : ""}
</p>

  <p>⭐ Points: {user.points}</p>
</div>
        <p style={{ color: "#9ca3af", marginTop: "5px" }}>
  LeetCode Style Practice Platform
</p>

        <div
  style={{
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px"
  }}
>
  <button
  onClick={() => {
  setSolvedProblems([]);
  setHistory([]);

  setUser({
    name: "Rashi",
    points: 0,
    streak: 0
  });

  localStorage.removeItem("solvedProblems");
  localStorage.removeItem("history");
  localStorage.removeItem("user");
  localStorage.removeItem("lastSolvedDate");
}}
  style={{
    width: "100%",
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
  }}
>
  Reset Progress
</button>
  <h4>Progress</h4>

  <p>
    {solvedProblems.length}
    /
    {problems.length}
    solved
  </p>

  <div
    style={{
      width: "100%",
      height: "10px",
      backgroundColor: "#374151",
      borderRadius: "10px"
    }}
  >
    <div
      style={{
        width: `${
          (solvedProblems.length /
            problems.length) *
          100
        }%`,
        height: "100%",
        backgroundColor: "#22c55e",
        borderRadius: "10px"
      }}
    />
  </div>
</div>

<h3 style={{ marginTop: "10px" }}>
  Problem List
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
        <hr style={{ margin: "20px 0" }} />

<h3>Submission History</h3>

{history.length === 0 && (
  <p>No submissions yet.</p>
)}

{history.map((item, index) => (
  <div
    key={index}
    style={{
      backgroundColor: "#1f2937",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "10px"
    }}
  >
    <div>
      <strong>{item.problem}</strong>
    </div>

    <div>
      {item.status === "ACCEPTED"
  ? "✔ Accepted"
  : "❌ Failed"}
    </div>

    <div>
      {item.passed}/{item.total}
    </div>

    <small>{item.time}</small>
  </div>
))}

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
    minHeight: "100vh",
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