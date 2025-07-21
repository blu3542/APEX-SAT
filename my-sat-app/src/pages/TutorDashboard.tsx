import React, { useState } from "react";
import { useTutorAuth } from "../hooks/useTutorAuth";
import { useStudentData } from "../hooks/useStudentData";
import { Button } from "../components/Button";
import TutorSolutionView from "../components/TutorSolutionView";

export default function TutorDashboard() {
  const { isTutor, loading: authLoading, error: authError } = useTutorAuth();
  const { students, loading: dataLoading, error: dataError } = useStudentData();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  if (authLoading) return <div className="p-6">Checking authorization...</div>;
  
  if (authError) return <div className="p-6 text-red-600">Authorization error: {authError}</div>;
  
  if (!isTutor) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="mt-4">You must be a tutor to access this page.</p>
      </div>
    );
  }

  if (selectedSession) {
    return (
      <TutorSolutionView 
        session={selectedSession}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  if (dataLoading) return <div className="p-6">Loading student data...</div>;
  
  if (dataError) return <div className="p-6 text-red-600">Error loading data: {dataError}</div>;

  // Group attempts by test_id and session (every 4 attempts = 1 session)
  const getStudentSessions = (attempts: any[]) => {
    const completedAttempts = attempts.filter(a => a.completed_at);
    const sessions: Array<{
      testNumber: number;
      sessionIndex: number;
      attempts: any[];
      averageScore: number;
      completedAt: string;
    }> = [];

    // Group by test_id
    const testGroups = completedAttempts.reduce((groups, attempt) => {
      if (!groups[attempt.test_id]) groups[attempt.test_id] = [];
      groups[attempt.test_id].push(attempt);
      return groups;
    }, {} as Record<number, any[]>);

    Object.entries(testGroups).forEach(([testId, testAttempts]) => {
      // Sort by started_at and group every 4 attempts as one session
      const sortedAttempts = testAttempts.sort((a, b) => 
        new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
      );

      for (let i = 0; i < sortedAttempts.length; i += 4) {
        const sessionAttempts = sortedAttempts.slice(i, i + 4);
        if (sessionAttempts.length === 4) { // Only complete sessions
          const averageScore = sessionAttempts.reduce((sum, a) => sum + a.score, 0) / 4;
          const lastCompleted = sessionAttempts.reduce((latest, a) => 
            new Date(a.completed_at) > new Date(latest) ? a.completed_at : latest
          , sessionAttempts[0].completed_at);

          sessions.push({
            testNumber: parseInt(testId),
            sessionIndex: Math.floor(i / 4) + 1,
            attempts: sessionAttempts,
            averageScore: Math.round(averageScore * 100) / 100,
            completedAt: lastCompleted
          });
        }
      }
    });

    return sessions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tutor Dashboard</h1>
      <p className="text-gray-600 mb-8">View test results for all students</p>

      <div className="space-y-6">
        {students.map(student => {
          const sessions = getStudentSessions(student.attempts);
          
          return (
            <div key={student.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{student.display_name}</h2>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    student.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {sessions.length} completed session{sessions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {sessions.length === 0 ? (
                <p className="text-gray-500 italic">No completed test sessions</p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <div>
                        <span className="font-medium">
                          Test {session.testNumber}, Session {session.sessionIndex}
                        </span>
                        <span className="ml-4 text-sm text-gray-600">
                          Average Score: {session.averageScore}
                        </span>
                        <span className="ml-4 text-sm text-gray-600">
                          Completed: {new Date(session.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        onClick={() => setSelectedSession({
                          student,
                          session,
                          testNumber: session.testNumber,
                          sessionIdx: session.sessionIndex,
                          attempts: session.attempts
                        })}
                      >
                        View Solutions
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {students.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
