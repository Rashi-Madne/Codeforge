package com.codeforge.backend.service;

import com.codeforge.backend.engine.RealJavaExecutionEngine;
import com.codeforge.backend.engine.RealPythonExecutionEngine;
import com.codeforge.backend.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExecutionService {

    private final RealJavaExecutionEngine javaEngine = new RealJavaExecutionEngine();
    private final RealPythonExecutionEngine pythonEngine = new RealPythonExecutionEngine();

    public ExecuteResponse execute(CodeRequest request) {

        ExecuteResponse response = new ExecuteResponse();

        try {

            String language = request.getLanguage();
            String code = request.getCode();

            String result = "";

            // =========================
            // JAVA EXECUTION (REAL)
            // =========================
            if ("java".equalsIgnoreCase(language)) {

                result = javaEngine.execute(code);

                if (result.startsWith("COMPILATION_ERROR")) {

                    response.setStatus("COMPILATION_ERROR");
                    response.setOutput("");
                    response.setError(result);

                } else if (result.startsWith("RUNTIME_ERROR")) {

                    response.setStatus("RUNTIME_ERROR");
                    response.setOutput("");
                    response.setError(result);

                } else {

                    response.setStatus("SUCCESS");
                    response.setOutput(result);
                    response.setError("");
                }
            }

            // =========================
            // PYTHON EXECUTION (REAL)
            // =========================
            else if ("python".equalsIgnoreCase(language)) {

                result = pythonEngine.execute(code);

                if (result.startsWith("RUNTIME_ERROR")) {

                    response.setStatus("RUNTIME_ERROR");
                    response.setOutput("");
                    response.setError(result);

                } else {

                    response.setStatus("SUCCESS");
                    response.setOutput(result);
                    response.setError("");
                }
            }

            // =========================
            // INVALID LANGUAGE
            // =========================
            else {

                response.setStatus("ERROR");
                response.setOutput("");
                response.setError("Unsupported language: " + language);
            }

            // =========================
            // TEST CASE EXECUTION
            // =========================
            List<TestResult> results = new ArrayList<>();
            int passed = 0;

            if (request.getTestCases() != null && !request.getTestCases().isEmpty()) {

                for (TestCase tc : request.getTestCases()) {

                    TestResult tr = new TestResult();

                    tr.setInput(tc.getInput());
                    tr.setExpected(tc.getExpected());

                    String actual = response.getOutput();

                    tr.setActual(actual);

                    boolean ok = actual != null &&
                            actual.trim().equals(tc.getExpected().trim());

                    tr.setPassed(ok);

                    if (ok) passed++;

                    results.add(tr);
                }

                response.setTestResults(results);
                response.setPassed(passed);
                response.setTotal(request.getTestCases().size());

            } else {

                response.setTestResults(new ArrayList<>());
                response.setPassed(0);
                response.setTotal(0);
            }

        } catch (Exception e) {

            response.setStatus("ERROR");
            response.setOutput("");
            response.setError(e.getMessage());
            response.setTestResults(new ArrayList<>());
            response.setPassed(0);
            response.setTotal(0);
        }

        return response;
    }
}