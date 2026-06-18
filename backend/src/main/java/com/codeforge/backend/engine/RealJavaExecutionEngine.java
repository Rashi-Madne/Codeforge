package com.codeforge.backend.engine;

import java.io.*;
import java.nio.file.*;

public class RealJavaExecutionEngine {

    public String execute(String userCode) {

        String output = "";

        try {

            // 1. Create temp directory
            String dirPath = System.getProperty("java.io.tmpdir") + "/codeforge";
            Files.createDirectories(Paths.get(dirPath));

            // 2. Write Java file
            String filePath = dirPath + "/Main.java";
            Files.write(Paths.get(filePath), userCode.getBytes());

            // 3. Compile Java file
            Process compileProcess = new ProcessBuilder(
                    "javac",
                    filePath
            ).directory(new File(dirPath)).start();

            String compileError = readStream(compileProcess.getErrorStream());
            compileProcess.waitFor();

            if (!compileError.isEmpty()) {
                return "COMPILATION_ERROR:\n" + compileError;
            }

            // 4. Run Java program
            Process runProcess = new ProcessBuilder(
                    "java",
                    "-cp",
                    dirPath,
                    "Main"
            ).directory(new File(dirPath)).start();

            output = readStream(runProcess.getInputStream());
            String runtimeError = readStream(runProcess.getErrorStream());

            runProcess.waitFor();

            if (!runtimeError.isEmpty()) {
                return "RUNTIME_ERROR:\n" + runtimeError;
            }

            return output.trim();

        } catch (Exception e) {
            return "ERROR:\n" + e.getMessage();
        }
    }

    private String readStream(InputStream inputStream) throws IOException {

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(inputStream)
        );

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString();
    }
}