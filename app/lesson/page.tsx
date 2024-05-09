import { getLesson, getUserProgress, getUserSubscription } from '@/db/queries'
import { redirect } from 'next/navigation'
import { Quiz } from './quiz'

const LessonPage = async () => {
  const lessonData = getLesson()
  const userProgressData = getUserProgress()
  // add:
  const userSubscriptionData = getUserSubscription()

  const [
    lesson,
    userProgress,
    // add
    userSubscription,
  ] = await Promise.all([
    lessonData,
    userProgressData,
    // add
    userSubscriptionData,
  ])

  if (!lesson || !userProgress) {
    redirect('/learn')
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100
  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      // prev: userSubscription={null}
      // add:
      userSubscription={userSubscription}
    />
  )
}
export default LessonPage
