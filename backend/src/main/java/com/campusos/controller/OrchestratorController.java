package com.campusos.controller;

import com.campusos.service.OrchestratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/orchestrator")
public class OrchestratorController {

    @Autowired
    private OrchestratorService orchestratorService;

    public static class AskRequest {
        public String message;
        public String prompt;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askAgent(@RequestBody AskRequest req) {
        String msg = req != null && req.message != null ? req.message :
                    (req != null && req.prompt != null ? req.prompt : "Hello");
        OrchestratorService.AgentResponse resp = orchestratorService.routeQuery(msg);
        return ResponseEntity.ok(resp);
    }
}
