<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome back, {{ userName }}! 👋
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Here's what's happening with your business today.
          </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link
            to="/create"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Invoice
          </router-link>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <!-- Total Revenue -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-green-50 p-3">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd class="text-lg font-medium text-gray-900">${{ totalRevenue }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Invoices -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-blue-50 p-3">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Invoices</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ totalInvoices }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Invoices -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-yellow-50 p-3">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pending Payment</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ pendingInvoices }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Paid Invoices -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-green-50 p-3">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Paid Invoices</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ paidInvoices }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Recent Invoices
          </h3>
          <router-link to="/history" class="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </router-link>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="invoice in recentInvoices" :key="invoice.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition block">
             <router-link :to="{ name: 'EditInvoice', params: { id: invoice.id } }" class="flex items-center justify-between"> 
                <div class="flex items-center truncate">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {{ invoice.clientName ? invoice.clientName.charAt(0).toUpperCase() : '#' }}
                  </div>
                  <div class="ml-4 truncate">
                    <div class="text-sm font-medium text-blue-600 truncate">{{ invoice.clientName || 'Unknown Client' }}</div>
                    <div class="text-sm text-gray-500">Invoice #{{ invoice.invoiceNumber }}</div>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <div class="text-sm font-bold text-gray-900">${{ calculateTotal(invoice) }}</div>
                   <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': invoice.status === 'paid',
                      'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                      'bg-gray-100 text-gray-800': invoice.status === 'draft'
                    }">
                    {{ invoice.status }}
                  </span>
                </div>
             </router-link>
          </li>
          <li v-if="recentInvoices.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
            No invoices yet. Create your first one to see stats!
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useAuthStore } from '@/stores/authStore'

const invoiceStore = useInvoiceStore()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || 'User')

// Use getters or computed properties for stats
const totalInvoices = computed(() => invoiceStore.invoices.length)

const pendingInvoices = computed(() => 
  invoiceStore.invoices.filter(inv => inv.status === 'pending').length
)

const paidInvoices = computed(() => 
  invoiceStore.invoices.filter(inv => inv.status === 'paid').length
)

const calculateTotal = (invoice) => {
  if (!invoice.items) return '0.00'
  return invoice.items.reduce((sum, item) => sum + (item.qty * item.rate), 0).toFixed(2)
}

const totalRevenue = computed(() => {
  return invoiceStore.invoices
    .filter(inv => inv.status === 'paid') // Only count paid invoices for revenue? Or all? Let's do paid.
    .reduce((sum, invoice) => sum + Number(calculateTotal(invoice)), 0)
    .toFixed(2)
})

const recentInvoices = computed(() => {
  // Sort by date (newest first) and take top 5
  // Assuming invoices have a 'date' or timestamp. If not, we take latest added.
  // The store probably adds them to the end, so reverse is good.
  return [...invoiceStore.invoices].reverse().slice(0, 5)
})
</script>
