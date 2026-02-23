const getElapsedSeconds = since => {
  if (!since) return 0
  const startedAt = new Date(since).getTime()
  if (Number.isNaN(startedAt)) return 0
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
}

const getOnlineTransitionUpdate = captain => {
  const updateDoc = { status: 'available' }
  if (!captain || captain.status !== 'available' || !captain.onlineSince) {
    updateDoc.onlineSince = new Date()
  }
  return updateDoc
}

const getOfflineTransitionUpdate = (captain, extraFields = {}) => {
  const totalOnlineSeconds = captain?.totalOnlineSeconds || 0
  const elapsed = captain?.status === 'available' ? getElapsedSeconds(captain.onlineSince) : 0

  return {
    ...extraFields,
    status: 'unavailable',
    onlineSince: null,
    totalOnlineSeconds: totalOnlineSeconds + elapsed
  }
}

const getEffectiveOnlineSeconds = captain => {
  if (!captain) return 0
  const base = captain.totalOnlineSeconds || 0
  const live = captain.status === 'available' ? getElapsedSeconds(captain.onlineSince) : 0
  return base + live
}

module.exports = {
  getOnlineTransitionUpdate,
  getOfflineTransitionUpdate,
  getEffectiveOnlineSeconds
}
