import { getLessonsByLevel, getExamPuzzlesByLevel, getSecretCards, getFailPatterns } from '../src/lib/school/api';

async function main() {
  console.log('🏫 Testing School Data Layer\n');
  
  const lessons = await getLessonsByLevel(1);
  console.log(`✅ Level 1 Lessons: ${lessons.length}`);
  lessons.forEach(l => console.log(`   - ${l.title} (${l.slug})`));
  
  const exams = await getExamPuzzlesByLevel(1);
  console.log(`\n✅ Level 1 Exams: ${exams.length}`);
  
  const lessons2 = await getLessonsByLevel(2);
  console.log(`\n✅ Level 2 Lessons: ${lessons2.length}`);
  lessons2.forEach(l => console.log(`   - ${l.title} (${l.slug})`));
  
  const exams2 = await getExamPuzzlesByLevel(2);
  console.log(`\n✅ Level 2 Exams: ${exams2.length}`);
  
  const lessons3 = await getLessonsByLevel(3);
  console.log(`\n✅ Level 3 Lessons: ${lessons3.length}`);
  lessons3.forEach(l => console.log(`   - ${l.title} (${l.slug})`));
  
  const exams3 = await getExamPuzzlesByLevel(3);
  console.log(`\n✅ Level 3 Exams: ${exams3.length}`);
  
  const cards = await getSecretCards();
  console.log(`\n✅ Secret Cards: ${cards.length}`);
  cards.forEach(c => console.log(`   - ${c.title}`));
  
  const patterns = await getFailPatterns();
  console.log(`\n✅ Fail Patterns: ${patterns.length}`);
  patterns.forEach(p => console.log(`   - ${p.name}`));
  
  console.log('\n✅ All data loaded successfully!');
}

main().catch(console.error);
