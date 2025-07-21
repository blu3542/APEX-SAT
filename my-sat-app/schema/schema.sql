-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Options (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  question_id bigint,
  text text,
  is_correct boolean,
  letter text,
  CONSTRAINT Options_pkey PRIMARY KEY (id),
  CONSTRAINT Options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.Question(id)
);
CREATE TABLE public.Question (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  question_set_id bigint,
  text text,
  type text,
  correct_answer real,
  image_url text,
  CONSTRAINT Question_pkey PRIMARY KEY (id),
  CONSTRAINT Question_question_set_id_fkey FOREIGN KEY (question_set_id) REFERENCES public.QuestionSet(id)
);
CREATE TABLE public.QuestionSet (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text,
  time_limit bigint,
  difficulty text,
  test_id bigint,
  CONSTRAINT QuestionSet_pkey PRIMARY KEY (id)
);
CREATE TABLE public.attempts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  student_id uuid,
  question_set_id bigint,
  score bigint,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  test_id bigint,
  CONSTRAINT attempts_pkey PRIMARY KEY (id),
  CONSTRAINT attempts_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id),
  CONSTRAINT attempts_question_set_id_fkey FOREIGN KEY (question_set_id) REFERENCES public.QuestionSet(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  display_name text,
  position text,
  email character varying,
  accomodation double precision,
  verified boolean,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.student_answers (
  attempt_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  question_id bigint NOT NULL,
  selected_option_id bigint,
  text_answer text,
  is_correct boolean,
  answered_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_answers_pkey PRIMARY KEY (attempt_id, question_id),
  CONSTRAINT student_answers_selected_option_id_fkey FOREIGN KEY (selected_option_id) REFERENCES public.Options(id),
  CONSTRAINT student_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id),
  CONSTRAINT student_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.Question(id)
);