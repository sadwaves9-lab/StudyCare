import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  filterQuestions,
  filterNotes,
  filterTests,
} from '../utils/contentFilter';

export function useFilteredContent() {
  const content = useSelector((s) => s.content);
  const prefs = useSelector((s) => s.userPrefs);

  const questions = useMemo(
    () => filterQuestions(content.questions, prefs),
    [content.questions, prefs]
  );

  const notes = useMemo(
    () => filterNotes(content.notes, prefs),
    [content.notes, prefs]
  );

  const tests = useMemo(
    () => filterTests(content.tests, prefs),
    [content.tests, prefs]
  );

  return {
    questions,
    notes,
    tests,
    loading: content.loading,
    refreshing: content.refreshing,
    error: content.error,
    fromCache: content.fromCache,
  };
}

export default useFilteredContent;
