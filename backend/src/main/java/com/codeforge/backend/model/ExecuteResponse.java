package com.codeforge.backend.model;

import java.util.List;

public class ExecuteResponse {

    private String output;
    private String error;
    private String status;

    private List<String> testResults;
    private int passed;
    private int total;

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getTestResults() { return testResults; }
    public void setTestResults(List<String> testResults) { this.testResults = testResults; }

    public int getPassed() { return passed; }
    public void setPassed(int passed) { this.passed = passed; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
}