package com.campusos.controller;

import com.campusos.engine.MockInterviewEngine;
import com.campusos.model.InterviewAnswer;
import com.campusos.model.MockInterview;
import com.campusos.repository.InterviewAnswerRepository;
import com.campusos.repository.MockInterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mock-interviews")
public class MockInterviewController {

    @Autowired
    private MockInterviewRepository interviewRepository;

    @Autowired
    private InterviewAnswerRepository answerRepository;

    @Autowired
    private MockInterviewEngine interviewEngine;

    public static class StartRequest {
        public Long student_id;
        public String target_role;
    }

    public static class AnswerRequest {
        public String answer;
        public String question;
        public Integer question_number;
    }

    @PostMapping
    public ResponseEntity<?> startInterview(@RequestBody(required = false) StartRequest req) {
        Long studentId = req != null && req.student_id != null ? req.student_id : 1L;
        String role = req != null && req.target_role != null ? req.target_role : "Java Developer";

        MockInterview interview = new MockInterview(studentId, role, "Medium");
        interviewRepository.save(interview);

        String firstQuestion = interviewEngine.getNextQuestion(role, "Medium", 1);

        Map<String, Object> res = new HashMap<>();
        res.put("interview_id", interview.getId());
        res.put("target_role", role);
        res.put("difficulty", "Medium");
        res.put("question_number", 1);
        res.put("question", firstQuestion);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<?> submitAnswer(@PathVariable Long id, @RequestBody AnswerRequest req) {
        Optional<MockInterview> interviewOpt = interviewRepository.findById(id);
        if (interviewOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MockInterview interview = interviewOpt.get();
        int qNum = req.question_number != null ? req.question_number : 1;
        String qText = req.question != null ? req.question : "Explain Java Collections framework";

        Double score = interviewEngine.evaluateAnswer(qText, req.answer, interview.getDifficulty());

        String eval;
        if (score >= 85) {
            eval = "Strong technical explanation with clear architectural concepts.";
            interview.setDifficulty("Hard"); // Adaptively scale difficulty UP
        } else if (score >= 70) {
            eval = "Satisfactory answer covering basic principles.";
        } else {
            eval = "Answer lacks technical depth and edge-case handling.";
            interview.setDifficulty("Easy"); // Adaptively scale difficulty DOWN
        }

        InterviewAnswer ans = new InterviewAnswer(id, qNum, qText, req.answer, eval, score, interview.getDifficulty());
        answerRepository.save(ans);
        interviewRepository.save(interview);

        Map<String, Object> res = new HashMap<>();
        res.put("interview_id", id);
        res.put("submitted_score", score);
        res.put("ai_evaluation", eval);
        res.put("next_difficulty", interview.getDifficulty());

        if (qNum < 4) {
            res.put("next_question_number", qNum + 1);
            res.put("next_question", interviewEngine.getNextQuestion(interview.getTargetRole(), interview.getDifficulty(), qNum + 1));
            res.put("is_completed", false);
        } else {
            List<InterviewAnswer> allAns = answerRepository.findByInterviewId(id);
            interviewEngine.updateReportCard(interview, allAns);
            interviewRepository.save(interview);
            res.put("is_completed", true);
            res.put("overall_report", interview);
        }

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<?> getResult(@PathVariable Long id) {
        Optional<MockInterview> interviewOpt = interviewRepository.findById(id);
        if (interviewOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MockInterview interview = interviewOpt.get();
        List<InterviewAnswer> answers = answerRepository.findByInterviewId(id);

        Map<String, Object> res = new HashMap<>();
        res.put("interview", interview);
        res.put("answers", answers);

        return ResponseEntity.ok(res);
    }
}
