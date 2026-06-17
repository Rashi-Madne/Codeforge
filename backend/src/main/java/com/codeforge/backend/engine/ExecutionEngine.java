package com.codeforge.backend.engine;

import com.codeforge.backend.model.CodeRequest;
import com.codeforge.backend.model.ExecuteResponse;

public interface ExecutionEngine {
    ExecuteResponse execute(CodeRequest request);
}