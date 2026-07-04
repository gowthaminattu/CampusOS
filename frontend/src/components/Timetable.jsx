// src/components/Timetable.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Timetable() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the orchestrator query to get the default student timetable
    const fetchTimetable = async () => {
      try {
        const res = await api.post("/orchestrator/chat", { message: "What classes do I have today?" });
        // Extract parsed data if returned
        if (res.data?.data?.timetable?.classes) {
          setSchedule(res.data.data.timetable.classes);
        } else {
          // Fallback static schedule
          setSchedule([
            {"time": "09:00 AM–10:00 AM", "subject": "Digital Signal Processing", "room": "Block A, LH-101"},
            {"time": "10:15 AM–11:15 AM", "subject": "Theory of Computation", "room": "Block A, LH-102"},
            {"time": "11:30 AM–01:30 PM", "subject": "Microprocessor Lab", "room": "Lab 1"}
          ]);
        }
      } catch (_) {
        // Fallback on error
        setSchedule([
          {"time": "09:00 AM–10:00 AM", "subject": "Digital Signal Processing", "room": "Block A, LH-101"},
          {"time": "10:15 AM–11:15 AM", "subject": "Theory of Computation", "room": "Block A, LH-102"},
          {"time": "11:30 AM–01:30 PM", "subject": "Microprocessor Lab", "room": "Lab 1"}
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  return (
    <div className="settings-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 className="settings-card-title">📅 Class & Lab Timetable</h2>
      <p className="page-subtitle" style={{ marginBottom: "20px" }}>Active schedule for this semester</p>

      {loading ? (
        <div className="mgmt-loading">
          <span className="spinner" /> Loading timetable...
        </div>
      ) : (
        <div className="recent-table-wrap">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Subject Name</th>
                <th>Room/Location</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, idx) => (
                <tr key={idx} className="recent-table-row">
                  <td style={{ fontWeight: "700" }}>{item.time}</td>
                  <td>
                    <div className="table-student-name">
                      <span className="table-avatar" style={{ background: "rgba(99,102,241,0.12)" }}>
                        {item.subject[0]}
                      </span>
                      {item.subject}
                    </div>
                  </td>
                  <td><span className="mgmt-dept-tag">{item.room}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
