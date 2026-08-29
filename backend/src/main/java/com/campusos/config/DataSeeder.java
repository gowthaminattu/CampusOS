package com.campusos.config;

import com.campusos.model.*;
import com.campusos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HostelRoomRepository hostelRoomRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobDriveRepository jobDriveRepository;

    @Autowired
    private LibraryBookRepository libraryBookRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedHostelRooms();
        seedLabs();
        seedCompaniesAndDrives();
        seedLibraryBooks();
        seedUsersAndSkills();
        System.out.println("🎓 CampusOS Java Spring Boot Backend: Data Seeding Completed Successfully!");
    }

    private void seedHostelRooms() {
        if (hostelRoomRepository.count() == 0) {
            hostelRoomRepository.saveAll(List.of(
                    new HostelRoom("A-101", "Single", 1, "A Block", "WiFi, AC, Attached Bathroom", 5000, true),
                    new HostelRoom("A-102", "Double", 1, "A Block", "WiFi, Fan, Shared Bathroom", 3500, true),
                    new HostelRoom("A-201", "Single", 2, "A Block", "WiFi, AC, Attached Bathroom, Balcony", 5500, true),
                    new HostelRoom("B-101", "Triple", 1, "B Block", "WiFi, Fan, Shared Bathroom", 2500, true),
                    new HostelRoom("B-102", "Double", 1, "B Block", "WiFi, AC", 4000, true),
                    new HostelRoom("B-201", "Single", 2, "B Block", "WiFi, AC, Attached Bathroom", 5000, true),
                    new HostelRoom("C-101", "Double", 1, "C Block", "WiFi, AC, Study Table", 4200, true),
                    new HostelRoom("C-102", "Single", 1, "C Block", "WiFi, Fan", 3000, true)
            ));
        }
    }

    private void seedLabs() {
        if (labRepository.count() == 0) {
            labRepository.saveAll(List.of(
                    new Lab("Lab 1", "Block A, Room 101", 30, "Python, C++, Java IDEs, 30 PCs", false, true),
                    new Lab("Lab 2", "Block A, Room 102", 25, "MATLAB, Simulink, Signal Processing Tools", false, true),
                    new Lab("Lab 3", "Block B, Room 201", 40, "Web Development Tools, Node.js, React", false, true),
                    new Lab("Networks Lab", "Block B, Room 202", 20, "Cisco Routers, Packet Tracer, Wireshark", false, true),
                    new Lab("AI/ML Lab", "Block C, Room 301", 20, "GPU Workstations, TensorFlow, PyTorch, CUDA", true, true),
                    new Lab("Electronics Lab", "Block C, Room 302", 30, "Oscilloscopes, Multimeters, Breadboards, Arduino", false, true)
            ));
        }
    }

    private void seedCompaniesAndDrives() {
        if (companyRepository.count() == 0) {
            Company c1 = companyRepository.save(new Company("Amazon", "Cloud & E-Commerce", "Bengaluru", "https://amazon.jobs"));
            Company c2 = companyRepository.save(new Company("Google", "Software & Internet", "Hyderabad", "https://careers.google.com"));
            Company c3 = companyRepository.save(new Company("TCS", "IT Services", "Mumbai", "https://tcs.com"));

            jobDriveRepository.saveAll(List.of(
                    new JobDrive(c1.getId(), "SDE-1 Graduate Drive 2026", "Software Development Engineer",
                            "Looking for strong algorithms, Java/Python, and Distributed Systems basics.",
                            7.5, 0, "CSE,ECE,IT", "Java, OOP, DSA, SQL, REST API", 28.5, "Bengaluru", "2026-09-10", "Active"),
                    new JobDrive(c2.getId(), "Software Engineer Campus Hire", "Software Engineer",
                            "Focus on System Design, Data Structures, and Clean Code principles.",
                            8.0, 0, "CSE,IT", "Python, C++, DSA, System Design", 36.0, "Hyderabad", "2026-09-25", "Active"),
                    new JobDrive(c3.getId(), "Ninja & Digital Hiring", "System Engineer",
                            "Core software development and IT infrastructure roles.",
                            6.0, 1, "CSE,ECE,EEE,MECH,CIVIL,IT", "Java, SQL, Git", 7.0, "Pan India", "2026-08-30", "Active")
            ));
        }
    }

    private void seedLibraryBooks() {
        if (libraryBookRepository.count() == 0) {
            libraryBookRepository.saveAll(List.of(
                    new LibraryBook("Introduction to Algorithms (CLRS)", "Cormen, Leiserson, Rivest, Stein", "9780262033848", "Computer Science", 6, 5),
                    new LibraryBook("Clean Code: A Handbook of Agile Software Craftsmanship", "Robert C. Martin", "9780132350884", "Software Engineering", 4, 4),
                    new LibraryBook("Design Patterns: Elements of Reusable Object-Oriented Software", "Erich Gamma et al.", "9780201633610", "Software Architecture", 5, 3),
                    new LibraryBook("Database System Concepts", "Silberschatz, Korth, Sudarshan", "9780073523323", "Database", 8, 7)
            ));
        }
    }

    private void seedUsersAndSkills() {
        if (userRepository.findByEmail("student@campusos.com").isEmpty()) {
            User demoStudent = new User("Aarav Sharma", "student@campusos.com", "21CS001", passwordEncoder.encode("student123"), "CSE", 4, "student");
            demoStudent.setGpa(8.4);
            demoStudent.setAttendance(88.5);
            demoStudent.setArrears(0);
            demoStudent.setTargetRole("Java Developer");
            demoStudent = userRepository.save(demoStudent);

            User demoFaculty = new User("Dr. Rajesh Kumar", "faculty@campusos.com", "FAC01", passwordEncoder.encode("faculty123"), "CSE", null, "faculty");
            User demoTpo = new User("Priya Nair (TPO Officer)", "tpo@campusos.com", "TPO01", passwordEncoder.encode("tpo123"), "Placement Cell", null, "tpo");
            User demoAdmin = new User("System Administrator", "admin@campusos.com", "ADM01", passwordEncoder.encode("admin123"), "Administration", null, "admin");

            userRepository.saveAll(List.of(demoFaculty, demoTpo, demoAdmin));

            // Seed skills for demo student
            studentSkillRepository.saveAll(List.of(
                    new StudentSkill(demoStudent.getId(), "Java", "Technical", 82.0),
                    new StudentSkill(demoStudent.getId(), "OOP", "Technical", 86.0),
                    new StudentSkill(demoStudent.getId(), "DSA", "Coding", 68.0),
                    new StudentSkill(demoStudent.getId(), "SQL", "Technical", 76.0),
                    new StudentSkill(demoStudent.getId(), "REST API", "Technical", 65.0),
                    new StudentSkill(demoStudent.getId(), "Spring Boot", "Technical", 48.0),
                    new StudentSkill(demoStudent.getId(), "Git", "Technical", 72.0),
                    new StudentSkill(demoStudent.getId(), "Quantitative Aptitude", "Aptitude", 74.0),
                    new StudentSkill(demoStudent.getId(), "Communication", "Soft", 80.0)
            ));
        }
    }
}
