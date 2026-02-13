<template>
  <div class="px-4 md:px-6 py-4 md:py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Success/Error Toast -->
      <transition name="slide-fade">
        <div
          v-if="toast.show"
          class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
          :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
        >
          <svg
            v-if="toast.type === 'success'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span class="text-white text-sm font-medium">{{ toast.message }}</span>
        </div>
      </transition>

      <!-- Confirm Dialog -->
      <transition name="fade">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          @click.self="showDeleteConfirm = false"
        >
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Delete Invoice</h3>
                <p class="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p class="text-gray-700 mb-6">
              Are you sure you want to delete invoice
              <strong>{{ invoiceToDelete?.number }}</strong> for
              <strong>{{ invoiceToDelete?.client }}</strong
              >?
            </p>
            <div class="flex gap-3 justify-end">
              <button
                @click="showDeleteConfirm = false"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- View Invoice Modal -->
      <transition name="fade">
        <div
          v-if="viewingInvoice"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          @click.self="viewingInvoice = null"
        >
          <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10"
            >
              <h2 class="text-xl font-bold text-gray-900">Invoice {{ viewingInvoice.number }}</h2>
              <div class="flex items-center gap-2">
                <button
                  @click="downloadInvoicePDF(viewingInvoice)"
                  class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </button>
                <button
                  @click="viewingInvoice = null"
                  class="p-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body - Invoice Preview -->
            <div class="p-6">
              <div
                :id="'invoice-preview-' + viewingInvoice.id"
                class="bg-white rounded-lg p-6 md:p-10 border-2 border-gray-200"
              >
                <!-- Header -->
                <div class="flex flex-col sm:flex-row items-start justify-between mb-8 gap-6">
                  <div class="flex items-start gap-4">
                    <div
                      class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                      <img
                        v-if="viewingInvoice.data.logo"
                        :src="viewingInvoice.data.logo"
                        alt="Logo"
                        class="w-full h-full object-contain p-2"
                      />
                      <svg
                        v-else
                        class="w-10 h-10 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-lg text-gray-900">
                        {{ viewingInvoice.data.businessName || 'Your Business Name' }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">
                        {{ viewingInvoice.data.businessAddress || 'Business Address' }}
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ viewingInvoice.data.businessEmail || 'email@example.com' }}
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ viewingInvoice.data.businessPhone || 'Phone Number' }}
                      </div>
                    </div>
                  </div>
                  <div class="text-left sm:text-right">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <div class="text-sm text-gray-600 font-medium">
                      # {{ viewingInvoice.number }}
                    </div>
                    <div class="text-sm text-gray-600 mt-2">
                      <div class="font-medium">Date: {{ formatDate(viewingInvoice.date) }}</div>
                      <div class="font-medium">
                        Due: {{ formatDate(viewingInvoice.data.dueDate) }}
                      </div>
                    </div>
                    <div class="mt-2">
                      <span
                        class="text-xs px-3 py-1 rounded-full font-semibold"
                        :class="getStatusClass(viewingInvoice.status)"
                      >
                        {{ viewingInvoice.status }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Bill To -->
                <div class="mb-8 p-4 bg-gray-50 rounded-lg">
                  <div class="text-xs font-bold text-gray-500 uppercase mb-2">Bill To</div>
                  <div class="font-bold text-base text-gray-900">
                    {{ viewingInvoice.client }}
                  </div>
                  <div class="text-sm text-gray-600 mt-1">
                    {{ viewingInvoice.data.clientAddress || 'Client Address' }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ viewingInvoice.data.clientEmail || 'client@example.com' }}
                  </div>
                </div>

                <!-- Line Items Table -->
                <div class="overflow-x-auto mb-8">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b-2 border-gray-300">
                        <th class="text-left text-sm font-bold text-gray-700 pb-3 pr-4">
                          Description
                        </th>
                        <th class="text-center text-sm font-bold text-gray-700 pb-3 px-2">Qty</th>
                        <th class="text-center text-sm font-bold text-gray-700 pb-3 px-2">Rate</th>
                        <th class="text-right text-sm font-bold text-gray-700 pb-3 pl-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in viewingInvoice.data.lineItems"
                        :key="index"
                        class="border-b border-gray-200"
                      >
                        <td class="py-3 text-sm text-gray-900 pr-4">
                          {{ item.description || 'Item Description' }}
                        </td>
                        <td class="py-3 text-sm text-gray-700 text-center px-2">
                          {{ formatNumber(item.quantity) }}
                        </td>
                        <td class="py-3 text-sm text-gray-700 text-center px-2">
                          {{ getCurrencySymbol(viewingInvoice.data.currency)
                          }}{{ formatNumber(item.rate) }}
                        </td>
                        <td class="py-3 text-sm text-gray-900 text-right pl-4 font-medium">
                          {{ getCurrencySymbol(viewingInvoice.data.currency)
                          }}{{ formatNumber(item.quantity * item.rate) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Totals -->
                <div class="flex justify-end mb-8">
                  <div class="w-full sm:w-80 bg-gray-50 p-4 rounded-lg">
                    <div
                      class="flex justify-between text-sm text-gray-700 mb-2 pb-2 border-b border-gray-200"
                    >
                      <span class="font-semibold">Payment Terms</span>
                      <span>{{ viewingInvoice.data.paymentTerms }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-700 mb-2">
                      <span>Subtotal</span>
                      <span
                        >{{ getCurrencySymbol(viewingInvoice.data.currency)
                        }}{{ formatNumber(calculateSubtotal(viewingInvoice.data)) }}</span
                      >
                    </div>
                    <div
                      v-if="viewingInvoice.data.taxPercentage > 0"
                      class="flex justify-between text-sm text-gray-700 mb-2"
                    >
                      <span>Tax ({{ formatNumber(viewingInvoice.data.taxPercentage) }}%)</span>
                      <span
                        >{{ getCurrencySymbol(viewingInvoice.data.currency)
                        }}{{ formatNumber(calculateTax(viewingInvoice.data)) }}</span
                      >
                    </div>
                    <div
                      v-if="viewingInvoice.data.discount > 0"
                      class="flex justify-between text-sm text-gray-700 mb-2"
                    >
                      <span>Discount ({{ formatNumber(viewingInvoice.data.discount) }}%)</span>
                      <span
                        >-{{ getCurrencySymbol(viewingInvoice.data.currency)
                        }}{{ formatNumber(calculateDiscount(viewingInvoice.data)) }}</span
                      >
                    </div>
                    <div
                      class="border-t-2 border-gray-300 pt-3 mt-3 flex justify-between items-center"
                    >
                      <span class="text-base font-bold text-gray-900">TOTAL DUE</span>
                      <span class="text-2xl font-bold text-gray-900"
                        >{{ getCurrencySymbol(viewingInvoice.data.currency)
                        }}{{ formatNumber(viewingInvoice.total) }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div class="bg-blue-50 p-4 rounded-lg mb-6">
                  <div class="text-xs font-bold text-gray-700 uppercase mb-2">Notes</div>
                  <div class="text-sm text-gray-700 leading-relaxed">
                    {{ viewingInvoice.data.notes || 'Thank you for your business.' }}
                  </div>
                </div>

                <!-- Footer Watermark -->
                <div class="pt-6 border-t border-gray-200 text-center">
                  <p class="text-xs text-gray-400">
                    Generated with SwiftInvoice - Professional Invoice Solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Page Header -->
      <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Invoice History</h1>
          <p class="text-gray-600 text-sm md:text-base">
            Track and manage your generated invoices.
          </p>
        </div>
        <router-link
          to="/"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Invoice
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Invoices</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoices.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Paid</p>
              <p class="text-2xl font-bold text-green-600">{{ paidCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Draft</p>
              <p class="text-2xl font-bold text-gray-600">{{ draftCount }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-blue-600">${{ totalRevenue }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by client, invoice number, or date..."
            class="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      <!-- Invoice Table -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <!-- Table Header -->
          <div
            class="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-800 border-b border-gray-700 text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            <div>Invoice #</div>
            <div>Client</div>
            <div>Date</div>
            <div>Total</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          <!-- Table Body -->
          <div class="divide-y divide-gray-200">
            <!-- Empty State -->
            <div v-if="filteredInvoices.length === 0" class="px-6 py-12 text-center">
              <svg
                class="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-1">
                {{ invoices.length === 0 ? 'No invoices yet' : 'No results found' }}
              </h3>
              <p class="text-gray-500 mb-4">
                {{
                  invoices.length === 0
                    ? 'Get started by creating your first invoice'
                    : 'Try adjusting your search or filters'
                }}
              </p>
              <router-link
                v-if="invoices.length === 0"
                to="/"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Invoice
              </router-link>
              <button
                v-else
                @click="
                  () => {
                    searchQuery = ''
                    statusFilter = 'ALL'
                  }
                "
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Clear Filters
              </button>
            </div>

            <!-- Invoice Rows -->
            <div
              v-for="invoice in filteredInvoices"
              :key="invoice.id"
              class="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition"
            >
              <div class="font-semibold text-gray-900">{{ invoice.number }}</div>
              <div class="flex items-center gap-2 text-gray-700">
                <svg
                  class="w-5 h-5 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="truncate">{{ invoice.client }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <svg
                  class="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(invoice.date) }}
              </div>
              <div class="font-semibold text-gray-900">
                {{ getCurrencySymbol(invoice.data.currency) }}{{ formatNumber(invoice.total) }}
              </div>
              <div>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(invoice.status)"
                >
                  {{ invoice.status }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="editInvoice(invoice)"
                  class="p-1 text-gray-400 hover:text-blue-600 transition"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="downloadInvoicePDF(invoice)"
                  class="p-1 text-gray-400 hover:text-green-600 transition"
                  title="Download PDF"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteInvoice(invoice)"
                  class="p-1 text-gray-400 hover:text-red-600 transition"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-gray-200">
          <!-- Empty State -->
          <div v-if="filteredInvoices.length === 0" class="px-4 py-12 text-center">
            <svg
              class="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">
              {{ invoices.length === 0 ? 'No invoices yet' : 'No results found' }}
            </h3>
            <p class="text-gray-500 mb-4">
              {{
                invoices.length === 0
                  ? 'Get started by creating your first invoice'
                  : 'Try adjusting your search or filters'
              }}
            </p>
            <router-link
              v-if="invoices.length === 0"
              to="/"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Invoice
            </router-link>
          </div>

          <!-- Mobile Invoice Cards -->
          <div v-for="invoice in filteredInvoices" :key="invoice.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between mb-3">
              <div>
                <div class="font-semibold text-gray-900 text-lg">{{ invoice.number }}</div>
                <div class="text-sm text-gray-600">{{ invoice.client }}</div>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(invoice.status)"
              >
                {{ invoice.status }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm text-gray-600">{{ formatDate(invoice.date) }}</div>
              <div class="font-semibold text-gray-900">
                {{ getCurrencySymbol(invoice.data.currency) }}{{ formatNumber(invoice.total) }}
              </div>
            </div>
            <div class="flex items-center gap-2 pt-3 border-t border-gray-200">
              <button
                @click="editInvoice(invoice)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                @click="downloadInvoicePDF(invoice)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                PDF
              </button>
              <button
                @click="deleteInvoice(invoice)"
                class="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoiceStore'

// Router and Store
const router = useRouter()
const invoiceStore = useInvoiceStore()

// State
const searchQuery = ref('')
const statusFilter = ref('ALL')
const showDeleteConfirm = ref(false)
const invoiceToDelete = ref(null)
const viewingInvoice = ref(null)

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Get invoices from store
const invoices = computed(() => {
  // Sort by date (newest first)
  return [...invoiceStore.allInvoices].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Computed properties for stats
const paidCount = computed(() => {
  return invoices.value.filter((inv) => inv.status === 'PAID').length
})

const draftCount = computed(() => {
  return invoices.value.filter((inv) => inv.status === 'DRAFT').length
})

const totalRevenue = computed(() => {
  const total = invoices.value
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.total || 0), 0)
  return total.toFixed(2)
})

// Filtered invoices based on search and status
const filteredInvoices = computed(() => {
  let filtered = invoices.value

  // Filter by status
  if (statusFilter.value !== 'ALL') {
    filtered = filtered.filter((inv) => inv.status === statusFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((inv) => {
      return (
        inv.number.toLowerCase().includes(query) ||
        inv.client.toLowerCase().includes(query) ||
        inv.date.includes(query)
      )
    })
  }

  return filtered
})

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Format number
const formatNumber = (num) => {
  const n = Number(num) || 0
  return n.toFixed(2)
}

// Get currency symbol
const getCurrencySymbol = (currency) => {
  if (!currency) return '$'
  const match = currency.match(/\(([^)]+)\)/)
  return match ? match[1] : '$'
}

// Calculate subtotal
const calculateSubtotal = (invoiceData) => {
  return invoiceData.lineItems.reduce((sum, item) => {
    return sum + item.quantity * item.rate
  }, 0)
}

// Calculate tax
const calculateTax = (invoiceData) => {
  const subtotal = calculateSubtotal(invoiceData)
  return (subtotal * invoiceData.taxPercentage) / 100
}

// Calculate discount
const calculateDiscount = (invoiceData) => {
  const subtotal = calculateSubtotal(invoiceData)
  return (subtotal * invoiceData.discount) / 100
}

// Get status class
const getStatusClass = (status) => {
  const classes = {
    DRAFT: 'text-gray-700 bg-gray-100',
    PAID: 'text-green-700 bg-green-100',
  }
  return classes[status] || 'text-gray-700 bg-gray-100'
}

// View invoice
const viewInvoice = (invoice) => {
  viewingInvoice.value = invoice
}

// Delete invoice
const deleteInvoice = (invoice) => {
  invoiceToDelete.value = invoice
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  if (!invoiceToDelete.value) return

  try {
    const success = invoiceStore.deleteInvoice(invoiceToDelete.value.id)
    if (success) {
      showToast(`Invoice ${invoiceToDelete.value.number} deleted successfully`, 'success')
    } else {
      showToast('Failed to delete invoice', 'error')
    }
    showDeleteConfirm.value = false
    invoiceToDelete.value = null
  } catch (error) {
    console.error('Failed to delete invoice:', error)
    showToast('Failed to delete invoice', 'error')
  }
}

// Navigate to edit page
const editInvoice = (invoice) => {
  router.push(`/edit/${invoice.id}`)
}

// UPDATE generateInvoiceHTML to match cleaner design from invoice component:
const generateInvoiceHTML = (invoice) => {
  const data = invoice.data
  const currencySymbol = getCurrencySymbol(data.currency)
  const subtotal = calculateSubtotal(data)
  const tax = calculateTax(data)
  const discount = calculateDiscount(data)

  return `
    <div style="background: #ffffff; padding: 40px; font-family: Arial, Helvetica, sans-serif; color: #000000; box-sizing: border-box; width: 100%;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 32px; gap: 24px;">
        <div style="display: flex; gap: 16px; align-items: flex-start;">
          <div style="width: 64px; height: 64px; min-width: 64px; min-height: 64px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${
              data.logo
                ? `<img src="${data.logo}" alt="Logo" style="width: 56px; height: 56px; object-fit: contain;"/>`
                : `<svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                     <path stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                   </svg>`
            }
          </div>
          <div>
            <div style="font-weight: bold; font-size: 18px; color: #111827; font-family: Arial, Helvetica, sans-serif; line-height: 1.4;">${data.businessName || 'Business Name'}</div>
            <div style="font-size: 14px; color: #4b5563; margin-top: 4px; font-family: Arial, Helvetica, sans-serif;">${data.businessAddress || 'Address'}</div>
            <div style="font-size: 14px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">${data.businessEmail || 'email@example.com'}</div>
            <div style="font-size: 14px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">${data.businessPhone || 'Phone'}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-size: 36px; font-weight: bold; color: #111827; margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif;">INVOICE</h1>
          <div style="font-size: 14px; color: #4b5563; font-weight: 500; font-family: Arial, Helvetica, sans-serif;"># ${invoice.number}</div>
          <div style="font-size: 14px; color: #4b5563; margin-top: 8px; font-family: Arial, Helvetica, sans-serif;">
            <div style="font-weight: 500; color: #4b5563;">Date: ${formatDate(invoice.date)}</div>
            <div style="font-weight: 500; color: #4b5563;">Due: ${formatDate(data.dueDate)}</div>
          </div>
          <div style="margin-top: 8px;">
            <span style="display: inline-block; font-size: 12px; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-family: Arial, Helvetica, sans-serif; ${
              invoice.status === 'PAID'
                ? 'background: #dcfce7; color: #15803d;'
                : 'background: #f3f4f6; color: #374151;'
            }">${invoice.status}</span>
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div style="margin-bottom: 32px; padding: 16px; background: #f9fafb; border-radius: 8px; box-sizing: border-box;">
        <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">Bill To</div>
        <div style="font-weight: bold; font-size: 16px; color: #111827; font-family: Arial, Helvetica, sans-serif;">${invoice.client}</div>
        <div style="font-size: 14px; color: #4b5563; margin-top: 4px; font-family: Arial, Helvetica, sans-serif;">${data.clientAddress || 'Client Address'}</div>
        <div style="font-size: 14px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">${data.clientEmail || 'client@example.com'}</div>
      </div>

      <!-- Line Items -->
      <table style="width: 100%; margin-bottom: 32px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif;">
        <thead>
          <tr style="border-bottom: 2px solid #d1d5db;">
            <th style="text-align: left; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-right: 16px; font-family: Arial, Helvetica, sans-serif;">Description</th>
            <th style="text-align: center; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-left: 8px; padding-right: 8px; font-family: Arial, Helvetica, sans-serif;">Qty</th>
            <th style="text-align: center; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-left: 8px; padding-right: 8px; font-family: Arial, Helvetica, sans-serif;">Rate</th>
            <th style="text-align: right; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-left: 16px; font-family: Arial, Helvetica, sans-serif;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.lineItems
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 16px 12px 0; font-size: 14px; color: #111827; font-family: Arial, Helvetica, sans-serif;">${item.description || 'Item'}</td>
              <td style="padding: 12px 8px; font-size: 14px; color: #374151; text-align: center; font-family: Arial, Helvetica, sans-serif;">${formatNumber(item.quantity)}</td>
              <td style="padding: 12px 8px; font-size: 14px; color: #374151; text-align: center; font-family: Arial, Helvetica, sans-serif;">${currencySymbol}${formatNumber(item.rate)}</td>
              <td style="padding: 12px 0 12px 16px; font-size: 14px; color: #111827; text-align: right; font-weight: 500; font-family: Arial, Helvetica, sans-serif;">${currencySymbol}${formatNumber(item.quantity * item.rate)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
        <div style="width: 320px; background: #f9fafb; padding: 16px; border-radius: 8px; box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; font-family: Arial, Helvetica, sans-serif;">
            <span style="font-weight: 600; color: #374151;">Payment Terms</span>
            <span style="color: #374151;">${data.paymentTerms}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">
            <span>Subtotal</span>
            <span>${currencySymbol}${formatNumber(subtotal)}</span>
          </div>
          ${
            data.taxPercentage > 0
              ? `
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">
              <span>Tax (${formatNumber(data.taxPercentage)}%)</span>
              <span>${currencySymbol}${formatNumber(tax)}</span>
            </div>
          `
              : ''
          }
          ${
            data.discount > 0
              ? `
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">
              <span>Discount (${formatNumber(data.discount)}%)</span>
              <span>-${currencySymbol}${formatNumber(discount)}</span>
            </div>
          `
              : ''
          }
          <div style="border-top: 2px solid #d1d5db; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: #111827; font-family: Arial, Helvetica, sans-serif;">TOTAL DUE</span>
            <span style="font-size: 24px; font-weight: bold; color: #111827; font-family: Arial, Helvetica, sans-serif;">${currencySymbol}${formatNumber(invoice.total)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 24px; box-sizing: border-box;">
        <div style="font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">Notes</div>
        <div style="font-size: 14px; color: #374151; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">${data.notes || 'Thank you for your business.'}</div>
      </div>

      <!-- Footer -->
      <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0; font-family: Arial, Helvetica, sans-serif;">Generated with SwiftInvoice - Professional Invoice Solutions</p>
      </div>
    </div>
  `
}

// UPDATE downloadInvoicePDF to use simpler approach:
const downloadInvoicePDF = async (invoice) => {
  try {
    if (typeof window.html2pdf === 'undefined') {
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
      )
    }

    // Create wrapper div
    const wrapper = document.createElement('div')
    wrapper.style.cssText =
      'position: fixed; left: -9999px; top: 0; width: 210mm; background: #ffffff;'
    wrapper.innerHTML = generateInvoiceHTML(invoice)
    document.body.appendChild(wrapper)

    const opt = {
      margin: 10,
      filename: `invoice-${invoice.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }

    const invoiceElement = wrapper.querySelector('div')
    if (!invoiceElement) {
      throw new Error('Invoice element not found')
    }

    await window.html2pdf().set(opt).from(invoiceElement).save()
    document.body.removeChild(wrapper)

    showToast('PDF downloaded successfully!', 'success')
  } catch (error) {
    console.error('PDF generation error:', error)
    showToast('Failed to generate PDF. Please try again.', 'error')
  }
}

// Download invoice PDF
// const downloadInvoicePDF = async (invoice) => {
//   try {
//     // Load html2pdf library if not already loaded
//     if (typeof window.html2pdf === 'undefined') {
//       await loadScript(
//         'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
//       )
//     }

//     // Create temporary element with safe colors
//     const element = createInvoiceElement(invoice)
//     document.body.appendChild(element)

//     // Convert any oklch/modern colors to hex (fixes html2canvas compatibility)
//     convertColorsToHex(element)

//     const opt = {
//       margin: 10,
//       filename: `invoice-${invoice.number}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         letterRendering: true,
//         backgroundColor: '#ffffff',
//       },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//     }

//     await window.html2pdf().set(opt).from(element).save()

//     // Remove temporary element
//     document.body.removeChild(element)

//     showToast('PDF downloaded successfully!', 'success')
//   } catch (error) {
//     console.error('PDF generation error:', error)
//     showToast('Failed to generate PDF. Please try again.', 'error')
//   }
// }

// Create invoice element for PDF
const createInvoiceElement = (invoice) => {
  const div = document.createElement('div')
  div.className = 'bg-white p-10'
  div.style.width = '210mm'
  div.innerHTML = generateInvoiceHTML(invoice)
  return div
}

// Generate invoice HTML with safe hex colors
// const generateInvoiceHTML = (invoice) => {
//   const data = invoice.data
//   const currencySymbol = getCurrencySymbol(data.currency)
//   const subtotal = calculateSubtotal(data)
//   const tax = calculateTax(data)
//   const discount = calculateDiscount(data)

//   return `
//     <div style="background: #ffffff; border-radius: 8px; padding: 40px; font-family: Arial, sans-serif;">
//       <!-- Header -->
//       <div style="display: flex; justify-content: space-between; margin-bottom: 32px; gap: 24px;">
//         <div style="display: flex; gap: 16px;">
//           <div style="width: 64px; height: 64px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
//             ${
//               data.logo
//                 ? `<img src="${data.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 8px;"/>`
//                 : `<svg style="width: 40px; height: 40px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
//                    </svg>`
//             }
//           </div>
//           <div>
//             <div style="font-weight: bold; font-size: 18px; color: #111827;">${data.businessName || 'Business Name'}</div>
//             <div style="font-size: 14px; color: #4b5563; margin-top: 4px;">${data.businessAddress || 'Address'}</div>
//             <div style="font-size: 14px; color: #4b5563;">${data.businessEmail || 'email@example.com'}</div>
//             <div style="font-size: 14px; color: #4b5563;">${data.businessPhone || 'Phone'}</div>
//           </div>
//         </div>
//         <div style="text-align: right;">
//           <h1 style="font-size: 36px; font-weight: bold; color: #111827; margin: 0 0 8px 0;">INVOICE</h1>
//           <div style="font-size: 14px; color: #4b5563; font-weight: 500;"># ${invoice.number}</div>
//           <div style="font-size: 14px; color: #4b5563; margin-top: 8px;">
//             <div style="font-weight: 500;">Date: ${formatDate(invoice.date)}</div>
//             <div style="font-weight: 500;">Due: ${formatDate(data.dueDate)}</div>
//           </div>
//           <div style="margin-top: 8px;">
//             <span style="font-size: 12px; padding: 4px 12px; border-radius: 9999px; font-weight: 600; ${
//               invoice.status === 'PAID'
//                 ? 'background: #dcfce7; color: #15803d;'
//                 : 'background: #f3f4f6; color: #374151;'
//             }">${invoice.status}</span>
//           </div>
//         </div>
//       </div>

//       <!-- Bill To -->
//       <div style="margin-bottom: 32px; padding: 16px; background: #f9fafb; border-radius: 8px;">
//         <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 8px;">Bill To</div>
//         <div style="font-weight: bold; font-size: 16px; color: #111827;">${invoice.client}</div>
//         <div style="font-size: 14px; color: #4b5563; margin-top: 4px;">${data.clientAddress || 'Client Address'}</div>
//         <div style="font-size: 14px; color: #4b5563;">${data.clientEmail || 'client@example.com'}</div>
//       </div>

//       <!-- Line Items -->
//       <table style="width: 100%; margin-bottom: 32px; border-collapse: collapse;">
//         <thead>
//           <tr style="border-bottom: 2px solid #d1d5db;">
//             <th style="text-align: left; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-right: 16px;">Description</th>
//             <th style="text-align: center; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-left: 8px; padding-right: 8px;">Qty</th>
//             <th style="text-align: center; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-left: 8px; padding-right: 8px;">Rate</th>
//             <th style="text-align: right; font-size: 14px; font-weight: bold; color: #374151; padding-bottom: 12px; padding-left: 16px;">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${data.lineItems
//             .map(
//               (item) => `
//             <tr style="border-bottom: 1px solid #e5e7eb;">
//               <td style="padding: 12px 16px 12px 0; font-size: 14px; color: #111827;">${item.description || 'Item'}</td>
//               <td style="padding: 12px 8px; font-size: 14px; color: #374151; text-align: center;">${formatNumber(item.quantity)}</td>
//               <td style="padding: 12px 8px; font-size: 14px; color: #374151; text-align: center;">${currencySymbol}${formatNumber(item.rate)}</td>
//               <td style="padding: 12px 0 12px 16px; font-size: 14px; color: #111827; text-align: right; font-weight: 500;">${currencySymbol}${formatNumber(item.quantity * item.rate)}</td>
//             </tr>
//           `,
//             )
//             .join('')}
//         </tbody>
//       </table>

//       <!-- Totals -->
//       <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
//         <div style="width: 320px; background: #f9fafb; padding: 16px; border-radius: 8px;">
//           <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
//             <span style="font-weight: 600;">Payment Terms</span>
//             <span>${data.paymentTerms}</span>
//           </div>
//           <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px;">
//             <span>Subtotal</span>
//             <span>${currencySymbol}${formatNumber(subtotal)}</span>
//           </div>
//           ${
//             data.taxPercentage > 0
//               ? `
//             <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px;">
//               <span>Tax (${formatNumber(data.taxPercentage)}%)</span>
//               <span>${currencySymbol}${formatNumber(tax)}</span>
//             </div>
//           `
//               : ''
//           }
//           ${
//             data.discount > 0
//               ? `
//             <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px;">
//               <span>Discount (${formatNumber(data.discount)}%)</span>
//               <span>-${currencySymbol}${formatNumber(discount)}</span>
//             </div>
//           `
//               : ''
//           }
//           <div style="border-top: 2px solid #d1d5db; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
//             <span style="font-size: 16px; font-weight: bold; color: #111827;">TOTAL DUE</span>
//             <span style="font-size: 24px; font-weight: bold; color: #111827;">${currencySymbol}${formatNumber(invoice.total)}</span>
//           </div>
//         </div>
//       </div>

//       <!-- Notes -->
//       <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
//         <div style="font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase; margin-bottom: 8px;">Notes</div>
//         <div style="font-size: 14px; color: #374151; line-height: 1.6;">${data.notes || 'Thank you for your business.'}</div>
//       </div>

//       <!-- Footer -->
//       <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
//         <p style="font-size: 12px; color: #9ca3af;">Generated with SwiftInvoice - Professional Invoice Solutions</p>
//       </div>
//     </div>
//   `
// }

// Convert oklch and modern CSS colors to hex for html2canvas compatibility
const convertColorsToHex = (element) => {
  const colorMap = {
    // Grays
    'rgb(17, 24, 39)': '#111827',
    'rgb(31, 41, 55)': '#1f2937',
    'rgb(55, 65, 81)': '#374151',
    'rgb(75, 85, 99)': '#4b5563',
    'rgb(107, 114, 128)': '#6b7280',
    'rgb(156, 163, 175)': '#9ca3af',
    'rgb(209, 213, 219)': '#d1d5db',
    'rgb(229, 231, 235)': '#e5e7eb',
    'rgb(243, 244, 246)': '#f3f4f6',
    'rgb(249, 250, 251)': '#f9fafb',
    'rgb(255, 255, 255)': '#ffffff',
    'rgb(0, 0, 0)': '#000000',

    // Blues
    'rgb(239, 246, 255)': '#eff6ff',
    'rgb(219, 234, 254)': '#dbeafe',
    'rgb(37, 99, 235)': '#2563eb',
    'rgb(29, 78, 216)': '#1d4ed8',

    // Greens
    'rgb(220, 252, 231)': '#dcfce7',
    'rgb(21, 128, 61)': '#15803d',
    'rgb(22, 163, 74)': '#16a34a',

    // Reds
    'rgb(254, 226, 226)': '#fee2e2',
    'rgb(220, 38, 38)': '#dc2626',
  }

  const allElements = element.querySelectorAll('*')
  allElements.forEach((el) => {
    const computed = window.getComputedStyle(el)

    // Convert background colors
    const bgColor = computed.backgroundColor
    if (bgColor && bgColor.startsWith('rgb')) {
      el.style.backgroundColor = colorMap[bgColor] || bgColor
    }

    // Convert text colors
    const color = computed.color
    if (color && color.startsWith('rgb')) {
      el.style.color = colorMap[color] || color
    }

    // Convert border colors
    const borderColor = computed.borderColor
    if (borderColor && borderColor.startsWith('rgb')) {
      el.style.borderColor = colorMap[borderColor] || borderColor
    }
  })
}

// Load external script
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'ALL'
}

// Invoices are automatically loaded from store

</script>

<style scoped>
/* Smooth transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
