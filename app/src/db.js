import Dexie from 'dexie'

const db = new Dexie('CelestialOdysseyDB')

// Phiên bản 1 — cấu trúc gốc
db.version(1).stores({
  // Bài nhật ký
  entries: '++id, title, mood, category, createdAt',
  // Nhiệm vụ hàng ngày
  objectives: '++id, title, completed, date',
  // Huy chương thành tựu
  achievements: 'id, unlocked',
  // Thông tin người dùng (chỉ 1 bản ghi)
  userProfile: 'id',
})

// Phiên bản 2 — Thêm bảng accounts và hỗ trợ đa người dùng (userId)
db.version(2).stores({
  accounts: '++id, username',
  entries: '++id, userId, title, mood, category, createdAt',
  objectives: '++id, userId, title, completed, date',
  achievements: 'id, userId, unlocked',
  userProfile: 'id',
}).upgrade(async (tx) => {
  // Di chuyển dữ liệu cũ: gán userId = 1 cho tất cả entries và objectives hiện có
  await tx.table('entries').toCollection().modify((entry) => {
    entry.userId = 1
  })
  await tx.table('objectives').toCollection().modify((obj) => {
    obj.userId = 1
  })

  // Di chuyển achievements: chuyển khoá chính sang dạng "userId_id" và gán userId
  const oldAchievements = await tx.table('achievements').toArray()
  // Xoá tất cả achievements cũ
  await tx.table('achievements').clear()
  // Thêm lại với khoá chính mới
  for (const ach of oldAchievements) {
    const newId = `1_${ach.id}`
    await tx.table('achievements').add({
      ...ach,
      id: newId,
      userId: 1,
    })
  }

  // Tạo tài khoản mặc định từ profile hiện tại
  const profile = await tx.table('userProfile').get(1)
  const defaultUsername = profile
    ? profile.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
    : 'astronaut'

  await tx.table('accounts').add({
    id: 1,
    username: defaultUsername || 'astronaut',
    password: 'password123',
  })
})

export default db
