<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Events</h1>
      <UButton
        v-if="user"
        to="/events/new"
        icon="i-heroicons-plus"
        label="Create Event"
        color="primary"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="event in events" :key="event.id" class="hover:border-primary cursor-pointer" @click="navigateTo(`/events/${event.id}`)">
        <img
          v-if="event.imageUrl"
          :src="event.imageUrl"
          :alt="event.title"
          class="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h3 class="text-lg font-semibold mb-2">{{ event.title }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {{ event.description }}
        </p>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            {{ formatDate(event.startDate) }}
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
            {{ event.location }}
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="w-4 h-4" />
            {{ event.attendees?.length || 0 }} attending
          </div>
        </div>
      </UCard>

      <p v-if="events.length === 0" class="col-span-3 text-center text-gray-500 py-12">
        No upcoming events
      </p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { format } from 'date-fns'

const { $firestore } = useNuxtApp()
const { user } = useAuth()

const events = ref([])

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

onMounted(async () => {
  const eventsQuery = query(
    collection($firestore, 'events'),
    orderBy('startDate', 'asc')
  )

  const snapshot = await getDocs(eventsQuery)
  events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})

useHead({ title: 'Events - AlbDev' })
</script>
