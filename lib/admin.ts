import { auth } from '@clerk/nextjs/server'
const adminIds = new Set(['user_2g0WHiND3ZSO22p78YSfosM3SG1'])
export const isAdmin = () => {
  try {
    const { userId } = auth()
    console.log('User ID:', userId)

    // Check if userId exists and is in adminIds
    const isAdmin = userId && adminIds.has(userId)
    console.log('Is Admin:', isAdmin)

    return isAdmin
  } catch (error) {
    console.error('Error occurred while checking isAdmin:', error)
    return false // Return false if any error occurs
  }
}
