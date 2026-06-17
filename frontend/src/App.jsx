import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println(10);
    }
}`);

  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await fetch(
        "http://localhost:8082/api/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            language: language,
            input: input,
            testCases: [],
          }),
        }
      );

      const data = await response.json();

      setOutput(
        `STATUS: ${data.status}

OUTPUT:
${data.output || ""}

ERROR:
${data.error || "None"}`
      );
    } catch (err) {
      setOutput(`Backend not reachable

${err.message}`);
    }

    setLoading(false);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);

    if (lang === "java") {
      setCode(`public class Main {
    public static void main(String[] args) {
        
    }
}`);
    } else {
      setCode(`print("Hello World")`);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#0d1117",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: "60px",
          background: "#161b22",
          borderBottom: "1px solid #30363d",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <h2 style={{ margin: 0 }}>🚀 CodeForge</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              padding: "8px",
              background: "#0d1117",
              color: "white",
              border: "1px solid #30363d",
            }}
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#238636",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            {loading ? "Running..." : "Run ▶"}
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
        }}
      >
        {/* EDITOR */}
        <div
          style={{
            flex: 1,
            borderRight: "1px solid #30363d",
          }}
        >
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        </div>

        {/* OUTPUT */}
        <div
          style={{
            width: "35%",
            background: "#161b22",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h3>Output</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#0d1117",
              padding: "15px",
              borderRadius: "8px",
              minHeight: "300px",
            }}
          >
            {output || "Run code to see output"}
          </pre>
        </div>
      </div>

      {/* TEST CASES / INPUT */}
      <div
        style={{
          height: "180px",
          background: "#161b22",
          borderTop: "1px solid #30363d",
          padding: "15px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Input</h3>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter program input here..."
          style={{
            width: "100%",
            height: "90px",
            background: "#0d1117",
            color: "white",
            border: "1px solid #30363d",
            padding: "10px",
            resize: "none",
          }}
        />
      </div>
    </div>
  );
}