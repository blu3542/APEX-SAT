import { useState, useEffect } from 'react';
import { supabase } from '../components/supabase';
import { Attempt, QuestionSet, StudentAnswer } from '../types/question_ds';

export function useSolutionData(attempts: Attempt[]) {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        // 1) fetch the four QuestionSets and nest their Questions + Options
        const { data: qsData, error: qsError } = await supabase
          .from('QuestionSet')
          .select(`
            id,
            title,
            time_limit,
            questions:Question (
              id,
              question_set_id,
              text,
              type,
              correct_answer,
              image_url,
              Options (
                id,
                letter,
                text,
                is_correct
              )
            )
          `)
          .in('id', attempts.map(a => a.question_set_id));
        if (qsError) throw qsError;
        setQuestionSets(qsData || []);

        // 2) fetch all student answers for those four attempts
        const { data: saData, error: saError } = await supabase
          .from('student_answers')
          .select('*')
          .in('attempt_id', attempts.map(a => a.id));
        if (saError) throw saError;
        setStudentAnswers(saData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (attempts.length) fetchAll();
  }, [attempts]);

  return { questionSets, studentAnswers, loading, error };
}
