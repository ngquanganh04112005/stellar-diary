import db from './db'

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'earth',
    icon: 'public',
    title: 'Khởi hành từ Trái Đất',
    subtitle: 'Bắt đầu hành trình (0 bài)',
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    requiredEntries: 0,
    color: 'primary-container',
  },
  {
    id: 'mercury',
    icon: 'wb_sunny',
    title: 'Vượt sóng Sao Thủy',
    subtitle: 'Đạt 20 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 20,
    color: 'primary-container',
  },
  {
    id: 'venus',
    icon: 'filter_drama',
    title: 'Bình minh Sao Kim',
    subtitle: 'Đạt 50 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 50,
    color: 'primary-container',
  },
  {
    id: 'moon',
    icon: 'dark_mode',
    title: 'Dấu chân Mặt Trăng',
    subtitle: 'Đạt 75 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 75,
    color: 'primary-container',
  },
  {
    id: 'mars',
    icon: 'explore',
    title: 'Đồi cát Sao Hỏa',
    subtitle: 'Đạt 100 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 100,
    color: 'primary-container',
  },
  {
    id: 'jupiter',
    icon: 'cyclone',
    title: 'Bão tố Sao Mộc',
    subtitle: 'Đạt 180 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 180,
    color: 'primary-container',
  },
  {
    id: 'saturn',
    icon: 'album',
    title: 'Vành đai Sao Thổ',
    subtitle: 'Đạt 250 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 250,
    color: 'primary-container',
  },
  {
    id: 'uranus',
    icon: 'ac_unit',
    title: 'Băng giá Thiên Vương',
    subtitle: 'Đạt 300 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 300,
    color: 'primary-container',
  },
  {
    id: 'neptune',
    icon: 'water',
    title: 'Vùng vịnh Hải Vương',
    subtitle: 'Đạt 365 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 365,
    color: 'primary-container',
  },
  {
    id: 'asteroid',
    icon: 'texture',
    title: 'Vành đai Tiểu hành tinh',
    subtitle: 'Đạt 450 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 450,
    color: 'secondary',
  },
  {
    id: 'nebula',
    icon: 'blur_on',
    title: 'Nôi sinh Tinh Vân',
    subtitle: 'Đạt 600 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 600,
    color: 'secondary',
  },
  {
    id: 'constellation',
    icon: 'auto_awesome',
    title: 'Bản đồ Chòm Sao',
    subtitle: 'Đạt 800 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 800,
    color: 'secondary',
  },
  {
    id: 'cluster',
    icon: 'grain',
    title: 'Hội tụ Cụm Sao',
    subtitle: 'Đạt 1000 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 1000,
    color: 'secondary',
  },
  {
    id: 'galaxy',
    icon: 'all_inclusive',
    title: 'Hải đồ Thiên Hà',
    subtitle: 'Đạt 1500 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 1500,
    color: 'secondary',
  },
  {
    id: 'milkyway',
    icon: 'rocket_launch',
    title: 'Du hành Ngân Hà',
    subtitle: 'Đạt 2500 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 2500,
    color: 'secondary',
  },
  {
    id: 'core',
    icon: 'stars',
    title: 'Trái tim Tâm Ngân Hà',
    subtitle: 'Đạt 5000 bài viết',
    unlocked: false,
    unlockedAt: null,
    requiredEntries: 5000,
    color: 'secondary',
  },
]

/**
 * Khởi tạo dữ liệu cho một người dùng mới vừa đăng ký.
 * @param {number} userId - ID tài khoản từ bảng accounts
 * @param {string} username - Tên hiển thị
 */
export async function seedUser(userId, username) {
  const today = new Date().toISOString().split('T')[0]

  // Tạo hồ sơ người dùng
  await db.userProfile.put({
    id: userId,
    name: username,
    level: 1,
    xp: 0,
    totalEntries: 0,
    currentStreak: 0,
    lastEntryDate: null,
  })

  // Tạo 16 huy chương mặc định (mở khóa sẵn Trái Đất)
  const achievements = DEFAULT_ACHIEVEMENTS.map((ach) => ({
    ...ach,
    id: `${userId}_${ach.id}`,
    userId,
  }))
  await db.achievements.bulkPut(achievements)

  // Tạo nhiệm vụ hàng ngày
  await db.objectives.bulkAdd([
    { title: 'Ôn tập tiếng Anh buổi sáng', subtitle: 'Từ vựng & Ngữ pháp', xp: 50, completed: false, date: today, userId },
    { title: 'Tập luyện thể lực', subtitle: '20 phút', xp: 75, completed: false, date: today, userId },
    { title: 'Luyện nói và nghe', subtitle: 'Cải thiện giao tiếp', xp: 60, completed: false, date: today, userId },
  ])

  // Bài nhật ký mẫu đầu tiên
  await db.entries.add({
    title: 'Khởi đầu hành trình',
    content: 'Hôm nay tôi bắt đầu hành trình đến những vì sao. Mọi thứ đều mới mẻ và đầy hứng khởi. Tôi sẽ ghi lại mỗi ngày trên con đường chinh phục vũ trụ này.',
    mood: 'stardust',
    category: 'general',
    createdAt: new Date().toISOString(),
    userId,
  })

  // Cập nhật profile với entry đầu tiên
  await db.userProfile.update(userId, {
    totalEntries: 1,
    currentStreak: 1,
    lastEntryDate: today,
    xp: 25,
  })

  console.log(`✅ Đã khởi tạo dữ liệu cho người dùng ${username} (ID: ${userId})`)
}

/**
 * Hàm seed chính — chạy khi app khởi động, đảm bảo dữ liệu cho người dùng hiện tại.
 */
export async function seedDatabase() {
  const currentUserId = parseInt(localStorage.getItem('currentUserId') || '0', 10)

  // Nếu chưa đăng nhập (chưa có currentUserId), chỉ cần đảm bảo DB sẵn sàng
  if (!currentUserId) return

  const today = new Date().toISOString().split('T')[0]

  // Đồng bộ danh sách huy chương (achievements) nếu số lượng không khớp 16
  const userAchievements = await db.achievements
    .where('userId')
    .equals(currentUserId)
    .toArray()

  if (userAchievements.length !== DEFAULT_ACHIEVEMENTS.length) {
    console.log('🔄 Đang đồng bộ lại danh sách huy chương thành tựu...')
    const profile = await db.userProfile.get(currentUserId)
    const currentTotalEntries = profile ? profile.totalEntries : 0

    // Xóa achievements cũ của user này
    const oldIds = userAchievements.map((a) => a.id)
    if (oldIds.length > 0) {
      await db.achievements.bulkDelete(oldIds)
    }

    const newAchievements = DEFAULT_ACHIEVEMENTS.map((ach) => {
      const isUnlocked = currentTotalEntries >= ach.requiredEntries
      return {
        ...ach,
        id: `${currentUserId}_${ach.id}`,
        userId: currentUserId,
        unlocked: isUnlocked,
        unlockedAt: isUnlocked ? new Date().toISOString() : null,
      }
    })
    await db.achievements.bulkPut(newAchievements)
    console.log('✅ Đồng bộ huy chương thành công!')
  }

  // Đảm bảo có nhiệm vụ cho ngày hôm nay
  const todayObjectives = await db.objectives
    .where('[userId+date]')
    .equals([currentUserId, today])
    .toArray()
    .catch(() => {
      // Fallback nếu compound index không tồn tại
      return db.objectives
        .where('userId')
        .equals(currentUserId)
        .filter((o) => o.date === today)
        .toArray()
    })

  if (todayObjectives.length === 0) {
    console.log('📅 Khởi tạo nhiệm vụ mới cho ngày hôm nay...')
    await db.objectives.bulkAdd([
      { title: 'Ôn tập tiếng Anh buổi sáng', subtitle: 'Từ vựng & Ngữ pháp', xp: 50, completed: false, date: today, userId: currentUserId },
      { title: 'Tập luyện thể lực', subtitle: '20 phút', xp: 75, completed: false, date: today, userId: currentUserId },
      { title: 'Luyện nói và nghe', subtitle: 'Cải thiện giao tiếp', xp: 60, completed: false, date: today, userId: currentUserId },
    ])
  }

  console.log('✅ Cơ sở dữ liệu đã sẵn sàng!')
}
