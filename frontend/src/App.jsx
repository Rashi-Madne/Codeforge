import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {

  const [code, setCode] = useState(`print(10)`);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runCode = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8082/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          language,
          input: "",
          testCases: [
            {
              input: "",
              expected: "10"
            }
          ]
        })
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      setResult({
        status: "ERROR",
        error: err.message
      });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>

      {/* LEFT SIDE */}
      <div style={styles.left}>

        {/* PROBLEM BOX */}
        <div style={styles.problemBox}>
          <h2>Problem</h2>
          <p>
            Print the number 10 using your program.
          </p>
        </div>

        {/* LANGUAGE + BUTTON */}
        <div style={styles.topBar}>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <button onClick={runCode} style={styles.button}>
            {loading ? "Running..." : "Run Code"}
          </button>

        </div>

        {/* EDITOR */}
        <Editor
          height="70vh"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(v) => setCode(v)}
        />

      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>

        <h2>Test Results</h2>

        {!result && <p>Run code to see results</p>}

        {result && (
          <>
            <div style={styles.statusBox}>
              STATUS: {result.status}
            </div>

            <div style={styles.outputBox}>
              OUTPUT: {result.output}
            </div>

            <div style={styles.countBox}>
              PASSED: {result.passed || 0}/{result.total || 0}
            </div>

            {/* TEST CASES */}
            <h3>Test Cases</h3>

            {result.testResults?.map((tc, index) => (
              <div
                key={index}
                style={{
                  ...styles.testCase,
                  backgroundColor: tc.passed ? "#1f6f3b" : "#7a1f1f"
                }}
              >
                <p><b>Input:</b> {tc.input}</p>
                <p><b>Expected:</b> {tc.expected}</p>
                <p><b>Actual:</b> {tc.actual}</p>
                <p>
                  <b>Status:</b>{" "}
                  {tc.passed ? "✔ PASS" : "❌ FAIL"}
                </p>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0d1117",
    color: "white",
    fontFamily: "Arial"
  },

  left: {
    flex: 1,
    borderRight: "1px solid #222",
    display: "flex",
    flexDirection: "column"
  },

  right: {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  },

  problemBox: {
    padding: "15px",
    backgroundColor: "#161b22",
    borderBottom: "1px solid #333"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#111827"
  },

  select: {
    backgroundColor: "#0d1117",
    color: "white",
    padding: "5px"
  },

  button: {
    backgroundColor: "#00ff88",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  statusBox: {
    padding: "10px",
    backgroundColor: "#1f2937",
    marginBottom: "10px"
  },

  outputBox: {
    padding: "10px",
    backgroundColor: "#111827",
    marginBottom: "10px"
  },

  countBox: {
    padding: "10px",
    backgroundColor: "#0f172a",
    marginBottom: "15px"
  },

  testCase: {
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px"
  }
};