<template>
  <UContainer class="py-8 max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">Notifications</h1>

    <div class="space-y-3">
      <UCard v-for="notification in notifications" :key="notification.id" :class="{ 'bg-gray-50 dark:bg-gray-800': !notification.isRead }">
        <div class="flex items-start gap-3">
          <UAvatar :alt="notification.actorUsername" size="sm" :src="notification.actorAvatar" />
          <div class="flex-1">
            <p class="text-sm">
              <span class="font-semibold">{{ notification.actorUsername }}</span>
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ formatTimeAgo(notification.createdAt) }}
            </p>
          </div>
          <UBadge v-if="!notification.isRead" color="primary" variant="soft">New</UBadge>
        </div>
      </UCard>

      <p v-if="notifications.length === 0" class="text-center text-gray-500 py-12">
        No notifications yet
      </p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { $firestore } = useNuxtApp()

const notifications = ref([])

const formatTimeAgo = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

onMounted(async () => {
  if (!user.value) return

  const notificationsQuery = query(
    collection($firestore, 'notifications'),
    where('userId', '==', user.value.uid),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(notificationsQuery)
  notifications.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})

useHead({ title: 'Notifications - AlbDev' })
</script>
