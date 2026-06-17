package com.codeforge.backend.engine;

import com.codeforge.backend.model.ExecuteResponse;

import java.io.*;

import org.springframework.stereotype.Component;

@Component
public class PythonExecutionEngine {

    public ExecuteResponse execute(String code, String input) throws Exception {

        ExecuteResponse response = new ExecuteResponse();

        File tempFile = File.createTempFile("script", ".py");

        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(code);
        }

        ProcessBuilder pb = new ProcessBuilder("python", tempFile.getAbsolutePath());
        Process process = pb.start();

        if (input != null && !input.isEmpty()) {
            OutputStream os = process.getOutputStream();
            os.write(input.getBytes());
            os.flush();
            os.close();
        }

        String output = readStream(process.getInputStream());
        String error = readStream(process.getErrorStream());

        response.setOutput(output);
        response.setError(error);
        response.setStatus(error.isEmpty() ? "SUCCESS" : "RUNTIME_ERROR");

        return response;
    }

    private String readStream(InputStream stream) throws IOException {

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder sb = new StringBuilder();

        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString().trim();
    }
}