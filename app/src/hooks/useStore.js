import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db'

// ============================================
// Helper — Lấy ID người dùng hiện tại
// ============================================
function getCurrentUserId() {
  return parseInt(localStorage.getItem('currentUserId') || '1', 10)
}

function getDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isJournalObjective(objective) {
  return objective?.title?.toLowerCase().includes('nhật ký')
}

// ============================================
// MILESTONES — Các mốc hành trình
// ============================================
const MILESTONES = [
  { name: 'Sao Thủy', entries: 20 },
  { name: 'Sao Kim', entries: 50 },
  { name: 'Mặt Trăng', entries: 75 },
  { name: 'Sao Hỏa', entries: 100 },
  { name: 'Sao Mộc', entries: 180 },
  { name: 'Sao Thổ', entries: 250 },
  { name: 'Thiên Vương Tinh', entries: 300 },
  { name: 'Hải Vương Tinh', entries: 365 },
  { name: 'Vành Đai Tiểu Hành Tinh', entries: 450 },
  { name: 'Tinh Vân', entries: 600 },
  { name: 'Chòm Sao', entries: 800 },
  { name: 'Cụm Sao', entries: 1000 },
  { name: 'Thiên Hà', entries: 1500 },
  { name: 'Ngân Hà', entries: 2500 },
  { name: 'Tâm Ngân Hà', entries: 5000 },
]

// XP cần để lên cấp (cấp N cần N * 200 XP)
function xpForLevel(level) {
  return level * 200
}

// ============================================
// useProfile — Thông tin người dùng
// ============================================
export function useProfile() {
  const userId = getCurrentUserId()
  const profile = useLiveQuery(() => db.userProfile.get(userId), [userId])

  const updateProfile = async (updates) => {
    await db.userProfile.update(userId, updates)
  }

  return { profile, updateProfile }
}

// ============================================
// useEntries — Các bài nhật ký
// ============================================
export function useEntries() {
  const userId = getCurrentUserId()
  const today = getDateKey()

  const entries = useLiveQuery(
    () =>
      db.entries
        .where('userId')
        .equals(userId)
        .reverse()
        .sortBy('createdAt'),
    [userId]
  )
  const profile = useLiveQuery(() => db.userProfile.get(userId), [userId])
  const hasEntryToday = Boolean(
    profile?.lastEntryDate === today ||
      entries?.some((entry) => getDateKey(entry.createdAt) === today)
  )

  const addEntry = async ({ title, content, mood, category }) => {
    const now = new Date()
    const today = getDateKey(now)
    const profile = await db.userProfile.get(userId)
    const todayEntry = await db.entries
      .where('userId')
      .equals(userId)
      .filter((entry) => getDateKey(entry.createdAt) === today)
      .first()

    if (profile?.lastEntryDate === today || todayEntry) {
      throw new Error('ENTRY_ALREADY_EXISTS_TODAY')
    }

    // Thêm entry
    await db.entries.add({
      title,
      content,
      mood,
      category,
      createdAt: now.toISOString(),
      userId,
    })

    // Cập nhật profile
    const lastDate = profile.lastEntryDate
    let newStreak = profile.currentStreak

    if (lastDate) {
      const lastDay = new Date(lastDate)
      const diffDays = Math.floor((now - lastDay) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        newStreak += 1
      } else if (diffDays > 1) {
        newStreak = 1
      }
      // diffDays === 0 → cùng ngày, giữ nguyên streak
    } else {
      newStreak = 1
    }

    const newTotalEntries = profile.totalEntries + 1
    let newXp = profile.xp + 25 // +25 XP cho mỗi entry
    let newLevel = profile.level

    // Kiểm tra lên cấp
    while (newXp >= xpForLevel(newLevel)) {
      newXp -= xpForLevel(newLevel)
      newLevel += 1
    }

    await db.userProfile.update(userId, {
      totalEntries: newTotalEntries,
      currentStreak: newStreak,
      lastEntryDate: today,
      xp: newXp,
      level: newLevel,
    })

    // Kiểm tra mở khóa achievements
    await checkAchievements(newTotalEntries)
  }

  return { entries, addEntry, hasEntryToday, canWriteToday: !hasEntryToday }
}

// ============================================
// useObjectives — Nhiệm vụ hàng ngày
// ============================================
export function useObjectives() {
  const userId = getCurrentUserId()
  const today = getDateKey()

  const objectives = useLiveQuery(
    () =>
      db.objectives
        .where('userId')
        .equals(userId)
        .filter((o) => o.date === today)
        .toArray(),
    [userId, today]
  )

  const completeObjective = async (id) => {
    const obj = await db.objectives.get(id)
    if (!obj || obj.completed) return

    await db.objectives.update(id, { completed: true })

    // Thêm XP
    const profile = await db.userProfile.get(userId)
    let newXp = profile.xp + obj.xp
    let newLevel = profile.level

    while (newXp >= xpForLevel(newLevel)) {
      newXp -= xpForLevel(newLevel)
      newLevel += 1
    }

    await db.userProfile.update(userId, { xp: newXp, level: newLevel })
  }

  const resetObjectives = async () => {
    const todayObjs = await db.objectives
      .where('userId')
      .equals(userId)
      .filter((o) => o.date === today)
      .toArray()

    let xpDeduction = 0
    for (const obj of todayObjs) {
      if (obj.completed) {
        xpDeduction += obj.xp
        await db.objectives.update(obj.id, { completed: false })
      }
    }

    if (xpDeduction > 0) {
      const profile = await db.userProfile.get(userId)
      let newXp = profile.xp - xpDeduction
      let newLevel = profile.level

      while (newXp < 0 && newLevel > 1) {
        newLevel -= 1
        newXp += xpForLevel(newLevel)
      }
      if (newXp < 0) newXp = 0

      await db.userProfile.update(userId, { xp: newXp, level: newLevel })
    }
  }

  const visibleObjectives = objectives?.filter((o) => !isJournalObjective(o)) || []
  const completedCount = visibleObjectives.filter((o) => o.completed).length
  const totalCount = visibleObjectives.length

  return { objectives: visibleObjectives, completeObjective, resetObjectives, completedCount, totalCount }
}

// ============================================
// useAchievements — Huy chương thành tựu
// ============================================
export function useAchievements() {
  const userId = getCurrentUserId()

  const achievements = useLiveQuery(async () => {
    const list = await db.achievements
      .where('userId')
      .equals(userId)
      .toArray()
    return list ? list.sort((a, b) => a.requiredEntries - b.requiredEntries) : []
  }, [userId])

  return { achievements }
}

async function checkAchievements(totalEntries) {
  const userId = getCurrentUserId()
  const all = await db.achievements
    .where('userId')
    .equals(userId)
    .toArray()

  for (const ach of all) {
    if (!ach.unlocked && totalEntries >= ach.requiredEntries) {
      await db.achievements.update(ach.id, {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      })
    }
  }
}

// ============================================
// useStats — Thống kê tổng hợp
// ============================================
export function useStats() {
  const userId = getCurrentUserId()
  const profile = useLiveQuery(() => db.userProfile.get(userId), [userId])

  const totalEntries = profile?.totalEntries || 0

  // Tính tiến trình hành trình (%)
  const currentMilestoneIndex = MILESTONES.findIndex(
    (m) => totalEntries < m.entries
  )
  const currentMilestone =
    currentMilestoneIndex >= 0
      ? MILESTONES[currentMilestoneIndex]
      : MILESTONES[MILESTONES.length - 1]
  const prevMilestoneEntries =
    currentMilestoneIndex > 0
      ? MILESTONES[currentMilestoneIndex - 1].entries
      : 0

  const journeyProgress =
    currentMilestoneIndex < 0
      ? 100
      : Math.min(
          100,
          Math.round(
            ((totalEntries - prevMilestoneEntries) /
              (currentMilestone.entries - prevMilestoneEntries)) *
              100
          )
        )

  // Tính XP progress trong level hiện tại (%)
  const xpProgress = profile
    ? Math.round((profile.xp / xpForLevel(profile.level)) * 100)
    : 0

  const xpToNextLevel = profile
    ? xpForLevel(profile.level) - profile.xp
    : 0

  // Tổng planets đã ghé thăm
  const planetsVisited = MILESTONES.filter(
    (m) => totalEntries >= m.entries
  ).length + 1 // +1 cho Trái Đất

  const totalXp = profile
    ? 100 * profile.level * (profile.level - 1) + profile.xp
    : 0

  return {
    profile,
    totalEntries,
    journeyProgress,
    currentMilestone,
    xpProgress,
    xpToNextLevel,
    planetsVisited,
    totalXp,
    milestones: MILESTONES,
  }
}
