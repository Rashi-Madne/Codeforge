package com.codeforge.backend.engine;

import java.io.*;
import java.nio.file.*;

public class RealJavaExecutionEngine {

    public String execute(String userCode) {

        String output = "";

        try {

            String dirPath = System.getProperty("java.io.tmpdir") + "/codeforge";
            Files.createDirectories(Paths.get(dirPath));

            String filePath = dirPath + "/Main.java";
            Files.write(Paths.get(filePath), userCode.getBytes());

            // Compile
            Process compileProcess = new ProcessBuilder("javac", filePath)
                    .directory(new File(dirPath))
                    .start();

            String compileError = read(compileProcess.getErrorStream());

            boolean compileFinished = compileProcess.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);

            if (!compileFinished) {
                compileProcess.destroy();
                return "COMPILATION_ERROR: Timeout";
            }

            if (!compileError.isEmpty()) {
                return "COMPILATION_ERROR:\n" + compileError;
            }

            // Run program
            Process runProcess = new ProcessBuilder("java", "-cp", dirPath, "Main")
                    .directory(new File(dirPath))
                    .start();

            boolean finished = runProcess.waitFor(3, java.util.concurrent.TimeUnit.SECONDS);

            if (!finished) {
                runProcess.destroy();
                return "RUNTIME_ERROR: Execution Timeout (Infinite loop detected)";
            }

            String result = read(runProcess.getInputStream());
            String error = read(runProcess.getErrorStream());

            if (!error.isEmpty()) {
                return "RUNTIME_ERROR:\n" + error;
            }

            return result.trim();

        } catch (Exception e) {
            return "ERROR:\n" + e.getMessage();
        }
    }

    private String read(InputStream inputStream) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = br.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString();
    }
}