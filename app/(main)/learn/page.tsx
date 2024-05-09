import { FeedWrapper } from '@/components/feed-wrapper'
import { UserProgress } from '@/components/user-progress'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { Header } from './header'
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from '@/db/queries'
import { redirect } from 'next/navigation'
import { Unit } from './unit'
import { lessons, units as unitsSchema, userSubscription } from '@/db/schema'
import { Promo } from '@/components/promo'
import { Quests } from '@/components/quests'

const LearnPage = async () => {
  const userProgressData = getUserProgress()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()
  const unitsData = getUnits()
  // add:
  const userSubscriptionData = getUserSubscription()
  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    // add
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    // add:
    userSubscriptionData,
  ])

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }
  if (!courseProgress) {
    redirect('/courses')
  }
  // add:
  const isPro = !!userSubscription?.isActive
  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          // add:
          // hasActiveSubscription={false}
          hasActiveSubscription={isPro}
        />
        {/* add: */}
        {!isPro && <Promo />}
        {/* add: */}
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className='mb-10'>
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress?.activeLesson as
                  | (typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect
                    })
                  | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}
export default LearnPage
