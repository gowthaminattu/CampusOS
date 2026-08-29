package com.campusos.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrchestratorService {

    public static class AgentResponse {
        public String agentName;
        public String answer;
        public List<String> suggestions;

        public AgentResponse(String agentName, String answer, List<String> suggestions) {
            this.agentName = agentName;
            this.answer = answer;
            this.suggestions = suggestions;
        }
    }

    public AgentResponse routeQuery(String message) {
        String lower = message.toLowerCase();

        if (lower.contains("hostel") || lower.contains("room") || lower.contains("rent")) {
            return new AgentResponse(
                    "HostelAgent",
                    "CampusOS Hostel Management: Single, Double, and Triple occupancy rooms are available in Blocks A, B, and C with high-speed WiFi, AC, and attached bathrooms.",
                    List.of("View Available Hostel Rooms", "Check My Hostel Booking Status")
            );
        } else if (lower.contains("lab") || lower.contains("slot") || lower.contains("equipment")) {
            return new AgentResponse(
                    "LabAgent",
                    "CampusOS Lab Scheduler: Labs 1-3, Networks Lab, Electronics Lab, and restricted AI/ML GPU Workstation Labs can be booked online.",
                    List.of("View Active Labs", "Book a Lab Slot")
            );
        } else if (lower.contains("job") || lower.contains("drive") || lower.contains("placement") || lower.contains("eligible")) {
            return new AgentResponse(
                    "PlacementAgent",
                    "CampusOS Placement Intelligence: Active recruitment drives include Amazon SDE-1 (28.5 LPA), Google Software Engineer (36.0 LPA), and TCS Digital/Ninja (7.0 LPA).",
                    List.of("Check Job Drive Eligibility", "View Recommended Jobs", "Start AI Mock Interview")
            );
        } else if (lower.contains("book") || lower.contains("library") || lower.contains("isbn") || lower.contains("fine")) {
            return new AgentResponse(
                    "LibraryAgent",
                    "CampusOS Digital Library: Core reference textbooks including CLRS Introduction to Algorithms, Clean Code by Martin, and Design Patterns are available in catalog.",
                    List.of("View Library Catalog", "Check Issued Books & Fines")
            );
        } else if (lower.contains("fee") || lower.contains("tuition") || lower.contains("payment")) {
            return new AgentResponse(
                    "FeeAgent",
                    "CampusOS Fee Management: Tuition fees and hostel mess charges can be settled online with instant digital receipt generation.",
                    List.of("View Pending Fee Breakdown", "Download Fee Receipt")
            );
        } else {
            return new AgentResponse(
                    "CampusOS Master Assistant",
                    "Welcome to CampusOS 2.0! I am your AI campus assistant. How can I assist you today across Academics, Placements, Labs, Hostel, or Library?",
                    List.of("Calculate Employability Index", "Run Skill Gap Benchmark", "Explore Campus Recruitment Drives")
            );
        }
    }
}
