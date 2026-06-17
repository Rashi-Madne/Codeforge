package com.codeforge.backend.engine;

import com.codeforge.backend.model.ExecuteResponse;
import org.springframework.stereotype.Component;
import java.io.*;
import java.nio.file.*;

@Component
public class JavaExecutionEngine {

    public ExecuteResponse execute(String code, String input) throws Exception {

        ExecuteResponse response = new ExecuteResponse();

        String className = "Main";
        String dir = System.getProperty("java.io.tmpdir");

        String filePath = dir + File.separator + className + ".java";

        // write code to file
        Files.write(Paths.get(filePath), code.getBytes());

        // compile
        ProcessBuilder compile = new ProcessBuilder("javac", filePath);
        Process compileProcess = compile.start();

        String compileError = readStream(compileProcess.getErrorStream());

        if (!compileError.isEmpty()) {
            response.setStatus("COMPILATION_ERROR");
            response.setError(compileError);
            return response;
        }

        // run
        ProcessBuilder run = new ProcessBuilder(
                "java",
                "-cp",
                dir,
                className
        );

        Process runProcess = run.start();

        if (input != null && !input.isEmpty()) {
            BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(runProcess.getOutputStream())
            );
            writer.write(input);
            writer.flush();
            writer.close();
        }

        String output = readStream(runProcess.getInputStream());
        String error = readStream(runProcess.getErrorStream());

        response.setOutput(output);
        response.setError(error);
        response.setStatus(error.isEmpty() ? "SUCCESS" : "RUNTIME_ERROR");

        return response;
    }

    private String readStream(InputStream stream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(stream));
        StringBuilder sb = new StringBuilder();

        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString().trim();
    }
}