import { mergeAcademy } from './academy-core.js';
const clone = (value) => JSON.parse(JSON.stringify(value));
const latest = (first, second, field = 'updatedAt') => new Date(second?.[field] ?? 0) > new Date(first?.[field] ?? 0) ? second : first;
const union = (first = [], second = []) => [...new Set([...first, ...second])];
const uniqueBy = (first = [], second = [], key = 'id') => {
  const map = new Map();
  [...first, ...second].forEach((item) => {
    const id = item?.[key] ?? JSON.stringify(item);
    const current = map.get(id);
    map.set(id, current ? latest(current, item, 'at') : item);
  });
  return [...map.values()].sort((a, b) => new Date(b.at ?? b.updatedAt ?? 0) - new Date(a.at ?? a.updatedAt ?? 0));
};

function mergeScores(remote = {}, local = {}) {
  const result = { ...remote };
  Object.entries(local).forEach(([key, value]) => { result[key] = Math.max(Number(result[key]) || 0, Number(value) || 0); });
  return result;
}

function mergeIndexed(remote = [], local = [], key = 'exerciseId') {
  const map = new Map();
  [...remote, ...local].forEach((item) => {
    const id = item?.[key];
    if (id === undefined) return;
    const current = map.get(id);
    map.set(id, current ? { ...latest(current, item, 'lastReviewedAt'), attempts: Math.max(current.attempts ?? 0, item.attempts ?? 0), correctReviews: Math.max(current.correctReviews ?? 0, item.correctReviews ?? 0), mastered: Boolean(current.mastered || item.mastered) } : item);
  });
  return [...map.values()];
}

function mergeCards(remote = {}, local = {}) {
  const result = { ...remote };
  Object.entries(local).forEach(([key, card]) => { result[key] = result[key] ? latest(result[key], card, 'reviewedAt') : card; });
  return result;
}

function mergeActivity(remote = {}, local = {}) {
  const result = clone(remote);
  Object.entries(local).forEach(([day, entry]) => {
    const previous = result[day] ?? {};
    result[day] = {
      ...previous,
      ...entry,
      xp: Math.max(previous.xp ?? 0, entry.xp ?? 0),
      exercises: Math.max(previous.exercises ?? 0, entry.exercises ?? 0),
      lessons: Math.max(previous.lessons ?? 0, entry.lessons ?? 0),
      minutes: Math.max(previous.minutes ?? 0, entry.minutes ?? 0),
      events: uniqueBy(previous.events, entry.events, 'at').slice(-80),
    };
  });
  return result;
}

function mergeProjects(remote = {}, local = {}) {
  const result = clone(remote);
  Object.entries(local).forEach(([id, progress]) => {
    const previous = result[id] ?? {};
    result[id] = { ...previous, ...latest(previous, progress), currentStep: Math.max(previous.currentStep ?? 1, progress.currentStep ?? 1), completedSteps: union(previous.completedSteps, progress.completedSteps), completed: Boolean(previous.completed || progress.completed) };
  });
  return result;
}

export function mergeProgress(remote, local) {
  const newer = latest(remote, local);
  const result = { ...clone(remote), ...clone(newer) };
  result.user = {
    ...remote.user,
    ...newer.user,
    xp: Math.max(remote.user?.xp ?? 0, local.user?.xp ?? 0),
    streak: Math.max(remote.user?.streak ?? 0, local.user?.streak ?? 0),
    totalAttempted: Math.max(remote.user?.totalAttempted ?? 0, local.user?.totalAttempted ?? 0),
    totalCorrect: Math.max(remote.user?.totalCorrect ?? 0, local.user?.totalCorrect ?? 0),
    perfectLessons: Math.max(remote.user?.perfectLessons ?? 0, local.user?.perfectLessons ?? 0),
  };
  result.completedLessons = union(remote.completedLessons, local.completedLessons);
  result.lessonScores = mergeScores(remote.lessonScores, local.lessonScores);
  result.mistakes = mergeIndexed(remote.mistakes, local.mistakes);
  result.flashcards = mergeCards(remote.flashcards, local.flashcards);
  result.examAttempts = uniqueBy(remote.examAttempts, local.examAttempts);
  result.projectProgress = mergeProjects(remote.projectProgress, local.projectProgress);
  result.snippets = uniqueBy(remote.snippets, local.snippets);
  result.focusSessions = uniqueBy(remote.focusSessions, local.focusSessions);
  result.achievements = union(remote.achievements, local.achievements);
  result.activity = mergeActivity(remote.activity, local.activity);
  const remoteEnglish = remote.english ?? {};
  const localEnglish = local.english ?? {};
  result.english = {
    ...remoteEnglish,
    ...latest(remoteEnglish, localEnglish),
    xp: Math.max(remoteEnglish.xp ?? 0, localEnglish.xp ?? 0),
    streak: Math.max(remoteEnglish.streak ?? 0, localEnglish.streak ?? 0),
    totalAttempted: Math.max(remoteEnglish.totalAttempted ?? 0, localEnglish.totalAttempted ?? 0),
    totalCorrect: Math.max(remoteEnglish.totalCorrect ?? 0, localEnglish.totalCorrect ?? 0),
    completedLessons: union(remoteEnglish.completedLessons, localEnglish.completedLessons),
    lessonScores: mergeScores(remoteEnglish.lessonScores, localEnglish.lessonScores),
    mistakes: mergeIndexed(remoteEnglish.mistakes, localEnglish.mistakes),
    flashcards: mergeCards(remoteEnglish.flashcards, localEnglish.flashcards),
    activity: mergeActivity(remoteEnglish.activity, localEnglish.activity),
    sessions: uniqueBy(remoteEnglish.sessions, localEnglish.sessions).slice(0, 500),
    examAttempts: uniqueBy(remoteEnglish.examAttempts, localEnglish.examAttempts).slice(0, 100),
    resourcesCompleted: union(remoteEnglish.resourcesCompleted, localEnglish.resourcesCompleted),
  };
  const rn = remote.network ?? {}, ln = local.network ?? {};
  result.network = {
    ...rn, ...ln,
    xp: Math.max(rn.xp ?? 0, ln.xp ?? 0),
    completedLessons: union(rn.completedLessons, ln.completedLessons),
    lessonScores: mergeScores(rn.lessonScores, ln.lessonScores),
    labsCompleted: union(rn.labsCompleted, ln.labsCompleted),
    careerChecklist: union(rn.careerChecklist, ln.careerChecklist),
    ticketResults: { ...rn.ticketResults, ...ln.ticketResults },
    activity: mergeActivity(rn.activity, ln.activity),
  };
  result.notes = { ...remote.notes, ...local.notes };
  result.academy = mergeAcademy(remote.academy, local.academy);
  result.updatedAt = new Date().toISOString();
  return result;
}


