package com.codeforge.backend.controller;

import com.codeforge.backend.model.CodeRequest;
import com.codeforge.backend.model.ExecuteResponse;
import com.codeforge.backend.service.ExecutionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExecutionController {

    @Autowired
    private ExecutionService executionService;

    @PostMapping("/execute")
    public ExecuteResponse execute(@RequestBody CodeRequest request) {
        return executionService.execute(request);
    }
}