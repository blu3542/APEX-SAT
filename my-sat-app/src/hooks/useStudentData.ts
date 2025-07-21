import { useState, useEffect } from 'react';
import { supabase } from '../components/supabase';

interface Student {
  id: string;
  display_name: string;
  email: string;
  verified: boolean;
}

interface StudentWithAttempts extends Student {
  attempts: Array<{
    id: number;
    test_id: number;
    started_at: string;
    completed_at: string | null;
    score: number;
    question_set_id: number;
  }>;
}

export function useStudentData() {
  const [students, setStudents] = useState<StudentWithAttempts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        // Get all students (position = 'student')
        const { data: studentProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, email, verified')
          .eq('position', 'student');

        if (profileError) throw profileError;

        // Get all attempts for these students
        const studentIds = studentProfiles?.map(s => s.id) || [];
        const { data: attempts, error: attemptsError } = await supabase
          .from('attempts')
          .select('id, student_id, test_id, started_at, completed_at, score, question_set_id')
          .in('student_id', studentIds)
          .order('started_at', { ascending: false });

        if (attemptsError) throw attemptsError;

        // Combine students with their attempts
        const studentsWithAttempts: StudentWithAttempts[] = (studentProfiles || []).map(student => ({
          ...student,
          attempts: (attempts || []).filter(attempt => attempt.student_id === student.id)
        }));

        setStudents(studentsWithAttempts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return { students, loading, error, refetch: () => {
    setLoading(true);
    setError(null);
  }};
}