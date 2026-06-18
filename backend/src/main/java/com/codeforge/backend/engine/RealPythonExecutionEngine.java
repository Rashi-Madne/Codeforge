package com.codeforge.backend.engine;

import java.io.*;
import java.nio.file.*;

public class RealPythonExecutionEngine {

    public String execute(String code) {

        try {

            String dir = System.getProperty("java.io.tmpdir") + "/codeforge";
            Files.createDirectories(Paths.get(dir));

            String filePath = dir + "/main.py";
            Files.write(Paths.get(filePath), code.getBytes());

            Process process = new ProcessBuilder("python", filePath)
                    .directory(new File(dir))
                    .start();

            boolean finished = process.waitFor(3, java.util.concurrent.TimeUnit.SECONDS);

            if (!finished) {
                process.destroy();
                return "RUNTIME_ERROR: Execution Timeout";
            }

            String output = read(process.getInputStream());
            String error = read(process.getErrorStream());

            if (!error.isEmpty()) {
                return "RUNTIME_ERROR:\n" + error;
            }

            return output.trim();

        } catch (Exception e) {
            return "ERROR:\n" + e.getMessage();
        }
    }

    private String read(InputStream input) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(input));

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = br.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString();
    }
}