package com.codeforge.backend.service;

import com.codeforge.backend.model.*;
import com.codeforge.backend.engine.JavaExecutionEngine;
import com.codeforge.backend.engine.PythonExecutionEngine;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExecutionService {

    @Autowired
    private JavaExecutionEngine javaEngine;

    @Autowired
    private PythonExecutionEngine pythonEngine;

    public ExecuteResponse execute(CodeRequest request) {

        ExecuteResponse res = new ExecuteResponse();
        List<String> results = new ArrayList<>();

        int passed = 0;

        try {

            if (request.getTestCases() == null || request.getTestCases().isEmpty()) {
                return runSingle(request);
            }

            int total = request.getTestCases().size();

            for (int i = 0; i < total; i++) {

                TestCase tc = request.getTestCases().get(i);

                CodeRequest temp = new CodeRequest();
                temp.setCode(request.getCode());
                temp.setLanguage(request.getLanguage());
                temp.setInput(tc.getInput());

                ExecuteResponse r = runSingle(temp);

                String out = r.getOutput() == null ? "" : r.getOutput().trim();
                String exp = tc.getExpectedOutput() == null ? "" : tc.getExpectedOutput().trim();

                if (out.equals(exp)) {
                    results.add("TestCase " + (i + 1) + " → PASS");
                    passed++;
                } else {
                    results.add("TestCase " + (i + 1) + " → FAIL");
                }
            }

            res.setTestResults(results);
            res.setPassed(passed);
            res.setTotal(request.getTestCases().size());
            res.setStatus(passed == request.getTestCases().size() ? "ACCEPTED" : "FAILED");

            return res;

        } catch (Exception e) {
            res.setStatus("ERROR");
            res.setError(e.getMessage());
            return res;
        }
    }

    private ExecuteResponse runSingle(CodeRequest request) throws Exception {

        if ("java".equalsIgnoreCase(request.getLanguage())) {
            return javaEngine.execute(request.getCode(), request.getInput());
        }

        if ("python".equalsIgnoreCase(request.getLanguage())) {
            return pythonEngine.execute(request.getCode(), request.getInput());
        }

        ExecuteResponse r = new ExecuteResponse();
        r.setStatus("ERROR");
        r.setError("Unsupported language");
        return r;
    }
}