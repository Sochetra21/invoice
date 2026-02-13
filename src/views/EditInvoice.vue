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

      <!-- Page Header -->
      <div class="mb-4">
        <div class="flex items-center gap-3 mb-2">
          <router-link to="/history" class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </router-link>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Edit Invoice</h1>
        </div>
        <p class="text-gray-600 text-sm md:text-base ml-14">
          Update invoice #{{ invoice.invoiceNumber || 'Loading...' }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="mb-4 md:mb-6 flex flex-wrap items-center gap-2 md:gap-3">
        <button
          @click="updateInvoice"
          :disabled="!isFormValid || loading"
          class="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          <span class="hidden sm:inline">Update Invoice</span>
          <span class="sm:hidden">Update</span>
        </button>
        <button
          @click="handleDownloadClick"
          :disabled="isGeneratingPDF"
          class="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="!isGeneratingPDF"
            class="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4 md:w-5 md:h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="hidden sm:inline">{{
            isGeneratingPDF ? 'Generating...' : 'Download PDF'
          }}</span>
          <span class="sm:hidden">{{ isGeneratingPDF ? 'Wait...' : 'PDF' }}</span>
        </button>
        <button
          @click="togglePaidStatus"
          class="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border transition rounded-lg text-sm md:text-base"
          :class="
            invoice.status === STATUS.PAID
              ? 'border-green-300 text-green-700 bg-green-50'
              : 'border-green-300 text-green-700 hover:bg-green-50'
          "
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ invoice.status === STATUS.PAID ? 'Paid' : 'Mark Paid' }}
        </button>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Left Side - Form -->
        <div class="space-y-4 md:space-y-6">
          <!-- Business Details -->
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6">
            <h2 class="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
              Business Details
            </h2>

            <!-- Logo Upload -->
            <div class="mb-3 md:mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">Company Logo</label>
              <div class="flex flex-wrap items-center gap-2 md:gap-3">
                <div
                  class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                >
                  <img
                    v-if="invoice.logo"
                    :src="invoice.logo"
                    alt="Logo"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
                    class="w-6 h-6 md:w-8 md:h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <label
                  class="cursor-pointer text-blue-400 text-xs md:text-sm font-medium hover:text-blue-300"
                >
                  Choose File
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    @change="handleLogoUpload"
                    class="hidden"
                    ref="fileInput"
                  />
                </label>
                <span class="text-xs md:text-sm text-gray-400 truncate max-w-[150px]">{{
                  logoFileName
                }}</span>
                <button
                  v-if="invoice.logo"
                  @click="removeLogo"
                  class="text-xs md:text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG/WEBP</p>
            </div>

            <!-- Business Name -->
            <div class="mb-3 md:mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Business Name <span class="text-red-400">*</span>
              </label>
              <input
                v-model="invoice.businessName"
                type="text"
                placeholder="Enter business name"
                maxlength="100"
                class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <!-- Address -->
            <div class="mb-3 md:mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <textarea
                v-model="invoice.businessAddress"
                placeholder="Enter address"
                rows="2"
                maxlength="200"
                class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              ></textarea>
            </div>

            <!-- Email and Phone -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  v-model="invoice.businessEmail"
                  type="email"
                  placeholder="email@example.com"
                  maxlength="100"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  :class="{
                    'border-red-500': !isValidEmail(invoice.businessEmail) && invoice.businessEmail,
                  }"
                />
                <p
                  v-if="!isValidEmail(invoice.businessEmail) && invoice.businessEmail"
                  class="text-xs text-red-400 mt-1"
                >
                  Invalid email format
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  v-model="invoice.businessPhone"
                  type="tel"
                  placeholder="0123445"
                  maxlength="20"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <!-- Client Details -->
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6">
            <h2 class="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
              Client Details
            </h2>

            <div class="mb-3 md:mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Client Name <span class="text-red-400">*</span>
              </label>
              <input
                v-model="invoice.clientName"
                type="text"
                placeholder="Enter client name"
                maxlength="100"
                class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div class="mb-3 md:mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">Client Address</label>
              <textarea
                v-model="invoice.clientAddress"
                placeholder="Enter client address"
                rows="2"
                maxlength="200"
                class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Client Email</label>
              <input
                v-model="invoice.clientEmail"
                type="email"
                placeholder="client@example.com"
                maxlength="100"
                class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                :class="{
                  'border-red-500': !isValidEmail(invoice.clientEmail) && invoice.clientEmail,
                }"
              />
              <p
                v-if="!isValidEmail(invoice.clientEmail) && invoice.clientEmail"
                class="text-xs text-red-400 mt-1"
              >
                Invalid email format
              </p>
            </div>
          </div>

          <!-- Invoice Info -->
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6">
            <h2 class="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Invoice Info</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 md:mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Invoice # <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="invoice.invoiceNumber"
                  type="text"
                  placeholder="INV-1002"
                  maxlength="50"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  v-if="!showCustomCurrency"
                  v-model="invoice.currency"
                  @change="handleCurrencyChange"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="JPY (¥)">JPY (¥)</option>
                  <option value="CAD (C$)">CAD (C$)</option>
                  <option value="AUD (A$)">AUD (A$)</option>
                  <option value="OTHER">Other (Custom)</option>
                </select>
                <div v-else class="flex gap-2">
                  <input
                    v-model="invoice.currency"
                    type="text"
                    placeholder="e.g., PHP (₱)"
                    maxlength="20"
                    pattern="^.+\s\(.+\)$"
                    class="flex-1 px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  <button
                    @click="resetCurrency"
                    class="px-2 md:px-3 py-2 text-gray-400 hover:text-gray-200"
                  >
                    <svg
                      class="w-4 h-4 md:w-5 md:h-5"
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
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 md:mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Date <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="invoice.date"
                  type="date"
                  :max="maxDate"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  v-model="invoice.dueDate"
                  type="date"
                  :min="invoice.date"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': invoice.dueDate && invoice.dueDate < invoice.date }"
                />
                <p
                  v-if="invoice.dueDate && invoice.dueDate < invoice.date"
                  class="text-xs text-red-400 mt-1"
                >
                  Due date cannot be before invoice date
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Payment Terms</label>
              <select
                v-model="invoice.paymentTerms"
                class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
          </div>

          <!-- Line Items -->
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6">
            <div class="flex items-center justify-between mb-3 md:mb-4">
              <h2 class="text-base md:text-lg font-semibold text-white">Line Items</h2>
              <button
                @click="addLineItem"
                :disabled="invoice.lineItems.length >= MAX_LINE_ITEMS"
                class="text-xs md:text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  class="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Item
              </button>
            </div>

            <div class="space-y-2 md:space-y-3">
              <div
                v-for="(item, index) in invoice.lineItems"
                :key="index"
                class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  v-model="item.description"
                  type="text"
                  placeholder="Description"
                  maxlength="200"
                  class="flex-1 px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <div class="flex gap-2">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    placeholder="Qty"
                    min="0.01"
                    max="999999"
                    step="0.01"
                    class="w-20 px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder-gray-400"
                  />
                  <input
                    v-model.number="item.rate"
                    type="number"
                    placeholder="Rate"
                    min="0"
                    max="9999999"
                    step="0.01"
                    class="w-24 px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder-gray-400"
                  />
                  <button
                    @click="removeLineItem(index)"
                    class="p-2 text-gray-400 hover:text-red-400 transition"
                    :disabled="invoice.lineItems.length === 1"
                  >
                    <svg
                      class="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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

            <!-- Tax and Discount -->
            <div class="mt-3 md:mt-4 space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Tax Percentage (%)</label
                >
                <input
                  v-model.number="invoice.taxPercentage"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Discount (%)</label>
                <input
                  v-model.number="invoice.discount"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <!-- Notes & Terms -->
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6">
            <h2 class="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
              Notes & Terms
            </h2>
            <textarea
              v-model="invoice.notes"
              placeholder="Thank you for your business..."
              rows="4"
              maxlength="500"
              class="w-full px-3 py-2 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            ></textarea>
          </div>
        </div>

        <!-- Right Side - Live Preview -->
        <div class="lg:sticky lg:top-8 h-fit">
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6">
            <h3
              class="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 md:mb-4"
            >
              Live Preview
            </h3>

            <!-- Invoice Preview -->
            <div
              ref="invoicePreview"
              class="bg-white rounded-lg p-6 md:p-10 invoice-preview shadow-lg"
              id="invoice-content"
            >
              <!-- Header -->
              <div class="flex flex-col sm:flex-row items-start justify-between mb-8 gap-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 logo-container"
                  >
                    <img
                      v-if="invoice.logo"
                      :src="invoice.logo"
                      alt="Logo"
                      class="w-full h-full object-contain logo-image p-2"
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
                      {{ invoice.businessName || 'Your Business Name' }}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                      {{ invoice.businessAddress || 'Business Address' }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ invoice.businessEmail || 'email@example.com' }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ invoice.businessPhone || 'Phone Number' }}
                    </div>
                  </div>
                </div>
                <div class="text-left sm:text-right">
                  <h1 class="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <div class="text-sm text-gray-600 font-medium">
                    # {{ invoice.invoiceNumber || 'INV-1002' }}
                  </div>
                  <div class="text-sm text-gray-600 mt-2">
                    <div class="font-medium">Date: {{ formatDate(invoice.date) }}</div>
                    <div class="font-medium">Due: {{ formatDate(invoice.dueDate) }}</div>
                  </div>
                  <div class="mt-2">
                    <span
                      class="text-xs px-3 py-1 rounded-full font-semibold"
                      :class="
                        invoice.status === STATUS.PAID
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      "
                    >
                      {{ invoice.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Bill To -->
              <div class="mb-8 p-4 bg-gray-50 rounded-lg">
                <div class="text-xs font-bold text-gray-500 uppercase mb-2">Bill To</div>
                <div class="font-bold text-base text-gray-900">
                  {{ invoice.clientName || 'Client Name' }}
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ invoice.clientAddress || 'Client Address' }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ invoice.clientEmail || 'client@example.com' }}
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
                      v-for="(item, index) in invoice.lineItems"
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
                        {{ currencySymbol }}{{ formatNumber(item.rate) }}
                      </td>
                      <td class="py-3 text-sm text-gray-900 text-right pl-4 font-medium">
                        {{ currencySymbol }}{{ formatNumber(item.quantity * item.rate) }}
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
                    <span>{{ invoice.paymentTerms }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Subtotal</span>
                    <span>{{ currencySymbol }}{{ formatNumber(subtotal) }}</span>
                  </div>
                  <div
                    v-if="invoice.taxPercentage > 0"
                    class="flex justify-between text-sm text-gray-700 mb-2"
                  >
                    <span>Tax ({{ formatNumber(invoice.taxPercentage) }}%)</span>
                    <span>{{ currencySymbol }}{{ formatNumber(taxAmount) }}</span>
                  </div>
                  <div
                    v-if="invoice.discount > 0"
                    class="flex justify-between text-sm text-gray-700 mb-2"
                  >
                    <span>Discount ({{ formatNumber(invoice.discount) }}%)</span>
                    <span>-{{ currencySymbol }}{{ formatNumber(discountAmount) }}</span>
                  </div>
                  <div
                    class="border-t-2 border-gray-300 pt-3 mt-3 flex justify-between items-center"
                  >
                    <span class="text-base font-bold text-gray-900">TOTAL DUE</span>
                    <span class="text-2xl font-bold text-gray-900"
                      >{{ currencySymbol }}{{ formatNumber(total) }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="bg-blue-50 p-4 rounded-lg mb-6">
                <div class="text-xs font-bold text-gray-700 uppercase mb-2">Notes</div>
                <div class="text-sm text-gray-700 leading-relaxed">
                  {{ invoice.notes || 'Thank you for your business.' }}
                </div>
              </div>

              <!-- Footer Watermark -->
              <div class="pt-6 border-t border-gray-200 text-center">
                <p class="text-xs text-gray-400 mb-1">
                  Generated with SwiftInvoice - Professional Invoice Solutions
                </p>
                <router-link 
                  to="/donation" 
                  class="text-[10px] text-blue-400 hover:text-blue-600 transition"
                >
                  Support this free tool
                </router-link>
              </div>
              <!-- Google AdSense Placeholder (Bottom) -->
              <div class="mt-8 pt-6 border-t border-gray-100">
                <!-- PASTE YOUR GOOGLE ADSENSE CODE HERE -->
                <div class="w-full h-[90px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 overflow-hidden relative group">
                  <span class="text-xs font-semibold uppercase tracking-wider mb-1">Advertisement Space</span>
                  <span class="text-[10px] text-gray-400">728 x 90 Leaderboard</span>
                  <div class="absolute inset-0 bg-gray-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
                    <span class="opacity-0 group-hover:opacity-100 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                      Replace with AdSense Code
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ad Modal -->
    <AdModal :show="showAdModal" @close="handleAdClose" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoiceStore'
import AdModal from '@/components/AdModal.vue'

// Router, Route and Store
const router = useRouter()
const route = useRoute()
const invoiceStore = useInvoiceStore()

// Ad Modal State
const showAdModal = ref(false)

// Loading state
const loading = ref(true)
const invoiceId = ref(null)

// Constants
const STATUS = {
  DRAFT: 'DRAFT',
  PAID: 'PAID',
}

const MAX_LINE_ITEMS = 50
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Refs
const fileInput = ref(null)
const invoicePreview = ref(null)
const isGeneratingPDF = ref(false)

const invoice = ref({
  businessName: '',
  businessAddress: '',
  businessEmail: '',
  businessPhone: '',
  logo: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  invoiceNumber: 'INV-' + Date.now().toString().slice(-6),
  currency: 'USD ($)',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  paymentTerms: 'Net 30',
  lineItems: [{ description: '', quantity: 1, rate: 0 }],
  taxPercentage: 0,
  discount: 0,
  notes: '',
  status: STATUS.DRAFT,
})

const logoFileName = ref('No file chosen')
const showCustomCurrency = ref(false)

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success', // success or error
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Validation
const isValidEmail = (email) => {
  if (!email) return true // Empty is valid (optional field)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isFormValid = computed(() => {
  // Required fields
  if (!invoice.value.businessName.trim()) return false
  if (!invoice.value.clientName.trim()) return false
  if (!invoice.value.invoiceNumber.trim()) return false
  if (!invoice.value.date) return false

  // Email validation
  if (invoice.value.businessEmail && !isValidEmail(invoice.value.businessEmail)) return false
  if (invoice.value.clientEmail && !isValidEmail(invoice.value.clientEmail)) return false

  // Date validation
  if (invoice.value.dueDate && invoice.value.dueDate < invoice.value.date) return false

  // Line items validation
  const hasValidItems = invoice.value.lineItems.some(
    (item) => item.description.trim() && item.quantity > 0 && item.rate >= 0,
  )
  if (!hasValidItems) return false

  return true
})

const maxDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear() + 1
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// Handle logo upload with validation
const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    showToast('Please upload a valid image file (JPG, PNG, or WEBP)', 'error')
    return
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    showToast('File size must be less than 2MB', 'error')
    return
  }

  logoFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    invoice.value.logo = e.target.result
  }
  reader.onerror = () => {
    showToast('Failed to read file', 'error')
  }
  reader.readAsDataURL(file)
}

// Remove logo
const removeLogo = () => {
  invoice.value.logo = ''
  logoFileName.value = 'No file chosen'
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetCurrency = () => {
  showCustomCurrency.value = false
  invoice.value.currency = 'USD ($)'
}

// Handle currency change
const handleCurrencyChange = (event) => {
  if (event.target.value === 'OTHER') {
    showCustomCurrency.value = true
    invoice.value.currency = ''
  }
}

// Get currency symbol
const currencySymbol = computed(() => {
  const match = invoice.value.currency.match(/\(([^)]+)\)/)
  return match ? match[1] : '$'
})

// Line items functions
const addLineItem = () => {
  if (invoice.value.lineItems.length < MAX_LINE_ITEMS) {
    invoice.value.lineItems.push({ description: '', quantity: 1, rate: 0 })
  }
}

const removeLineItem = (index) => {
  if (invoice.value.lineItems.length > 1) {
    invoice.value.lineItems.splice(index, 1)
  }
}

// Calculations with validation
const subtotal = computed(() => {
  return invoice.value.lineItems.reduce((sum, item) => {
    const qty = Math.max(0, Number(item.quantity) || 0)
    const rate = Math.max(0, Number(item.rate) || 0)
    return sum + qty * rate
  }, 0)
})

const taxAmount = computed(() => {
  const tax = Math.max(0, Math.min(100, Number(invoice.value.taxPercentage) || 0))
  return (subtotal.value * tax) / 100
})

const discountAmount = computed(() => {
  const discount = Math.max(0, Math.min(100, Number(invoice.value.discount) || 0))
  return (subtotal.value * discount) / 100
})

const total = computed(() => {
  return Math.max(0, subtotal.value + taxAmount.value - discountAmount.value)
})

// Format numbers
const formatNumber = (num) => {
  const n = Number(num) || 0
  return n.toFixed(2)
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Toggle paid status
const togglePaidStatus = () => {
  invoice.value.status = invoice.value.status === STATUS.PAID ? STATUS.DRAFT : STATUS.PAID
}

// Update invoice using store
const updateInvoice = () => {
  if (!isFormValid.value) {
    showToast('Please fill in all required fields correctly', 'error')
    return
  }

  try {
    const success = invoiceStore.updateInvoice(invoiceId.value, invoice.value)
    if (success) {
      showToast('Invoice updated successfully!', 'success')
      // Navigate to history page
      setTimeout(() => {
        router.push('/history')
      }, 1500)
    } else {
      showToast('Failed to update invoice', 'error')
    }
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      showToast('Storage quota exceeded. Please clear some old invoices.', 'error')
    } else {
      showToast('Failed to update invoice. Please try again.', 'error')
    }
    console.error('Update error:', error)
  }
}

// Handle download click with 60% chance of ad
const handleDownloadClick = () => {
  if (isFormValid.value) {
    const chance = Math.random()
    if (chance < 0.6) {
      showAdModal.value = true
    } else {
      downloadPDF()
    }
  } else {
    showToast('Please fill in all required fields correctly', 'error')
  }
}

// Handle ad close
const handleAdClose = () => {
  showAdModal.value = false
  // Small delay to make it feel natural
  setTimeout(() => {
    downloadPDF()
  }, 300)
}

// Download PDF using html2pdf.js with complete style isolation
const downloadPDF = async () => {
  if (isGeneratingPDF.value) return

  isGeneratingPDF.value = true

  try {
    // Load html2pdf library if not already loaded
    if (typeof window.html2pdf === 'undefined') {
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
      )
    }

    // Create wrapper div
    const wrapper = document.createElement('div')
    wrapper.style.cssText =
      'position: fixed; left: -9999px; top: 0; width: 210mm; background: #ffffff;'
    wrapper.innerHTML = generateInvoiceHTML()
    document.body.appendChild(wrapper)

    const opt = {
      margin: 10,
      filename: `invoice-${invoice.value.invoiceNumber}.pdf`,
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

    // Pass the first child (the actual invoice div)
    const invoiceElement = wrapper.querySelector('div')
    if (!invoiceElement) {
      throw new Error('Invoice element not found')
    }

    await window.html2pdf().set(opt).from(invoiceElement).save()

    // Clean up
    document.body.removeChild(wrapper)

    showToast('PDF downloaded successfully!', 'success')
  } catch (error) {
    console.error('PDF generation error:', error)
    showToast('Failed to generate PDF. Please try again.', 'error')
  } finally {
    isGeneratingPDF.value = false
  }
}

// Generate invoice HTML with safe hex colors for PDF (simplified)
const generateInvoiceHTML = () => {
  const currSymbol = currencySymbol.value

  return `
    <div style="background: #ffffff; padding: 40px; font-family: Arial, Helvetica, sans-serif; color: #000000; box-sizing: border-box; width: 100%;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 32px; gap: 24px;">
        <div style="display: flex; gap: 16px; align-items: flex-start;">
          <div style="width: 64px; height: 64px; min-width: 64px; min-height: 64px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${
              invoice.value.logo
                ? `<img src="${invoice.value.logo}" alt="Logo" style="width: 56px; height: 56px; object-fit: contain;"/>`
                : `<svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                     <path stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                   </svg>`
            }
          </div>
          <div>
            <div style="font-weight: bold; font-size: 18px; color: #111827; font-family: Arial, Helvetica, sans-serif; line-height: 1.4;">${invoice.value.businessName || 'Your Business Name'}</div>
            <div style="font-size: 14px; color: #4b5563; margin-top: 4px; font-family: Arial, Helvetica, sans-serif;">${invoice.value.businessAddress || 'Business Address'}</div>
            <div style="font-size: 14px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">${invoice.value.businessEmail || 'email@example.com'}</div>
            <div style="font-size: 14px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">${invoice.value.businessPhone || 'Phone Number'}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-size: 36px; font-weight: bold; color: #111827; margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif;">INVOICE</h1>
          <div style="font-size: 14px; color: #4b5563; font-weight: 500; font-family: Arial, Helvetica, sans-serif;"># ${invoice.value.invoiceNumber || 'INV-1002'}</div>
          <div style="font-size: 14px; color: #4b5563; margin-top: 8px; font-family: Arial, Helvetica, sans-serif;">
            <div style="font-weight: 500; color: #4b5563;">Date: ${formatDate(invoice.value.date)}</div>
            <div style="font-weight: 500; color: #4b5563;">Due: ${formatDate(invoice.value.dueDate)}</div>
          </div>
          <div style="margin-top: 8px;">
            <span style="display: inline-block; font-size: 12px; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-family: Arial, Helvetica, sans-serif; ${
              invoice.value.status === STATUS.PAID
                ? 'background: #dcfce7; color: #15803d;'
                : 'background: #f3f4f6; color: #374151;'
            }">${invoice.value.status}</span>
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div style="margin-bottom: 32px; padding: 16px; background: #f9fafb; border-radius: 8px; box-sizing: border-box;">
        <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">Bill To</div>
        <div style="font-weight: bold; font-size: 16px; color: #111827; font-family: Arial, Helvetica, sans-serif;">${invoice.value.clientName || 'Client Name'}</div>
        <div style="font-size: 14px; color: #4b5563; margin-top: 4px; font-family: Arial, Helvetica, sans-serif;">${invoice.value.clientAddress || 'Client Address'}</div>
        <div style="font-size: 14px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">${invoice.value.clientEmail || 'client@example.com'}</div>
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
          ${invoice.value.lineItems
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 16px 12px 0; font-size: 14px; color: #111827; font-family: Arial, Helvetica, sans-serif;">${item.description || 'Item Description'}</td>
              <td style="padding: 12px 8px; font-size: 14px; color: #374151; text-align: center; font-family: Arial, Helvetica, sans-serif;">${formatNumber(item.quantity)}</td>
              <td style="padding: 12px 8px; font-size: 14px; color: #374151; text-align: center; font-family: Arial, Helvetica, sans-serif;">${currSymbol}${formatNumber(item.rate)}</td>
              <td style="padding: 12px 0 12px 16px; font-size: 14px; color: #111827; text-align: right; font-weight: 500; font-family: Arial, Helvetica, sans-serif;">${currSymbol}${formatNumber(item.quantity * item.rate)}</td>
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
            <span style="color: #374151;">${invoice.value.paymentTerms}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">
            <span>Subtotal</span>
            <span>${currSymbol}${formatNumber(subtotal.value)}</span>
          </div>
          ${
            invoice.value.taxPercentage > 0
              ? `
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">
              <span>Tax (${formatNumber(invoice.value.taxPercentage)}%)</span>
              <span>${currSymbol}${formatNumber(taxAmount.value)}</span>
            </div>
          `
              : ''
          }
          ${
            invoice.value.discount > 0
              ? `
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">
              <span>Discount (${formatNumber(invoice.value.discount)}%)</span>
              <span>-${currSymbol}${formatNumber(discountAmount.value)}</span>
            </div>
          `
              : ''
          }
          <div style="border-top: 2px solid #d1d5db; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: #111827; font-family: Arial, Helvetica, sans-serif;">TOTAL DUE</span>
            <span style="font-size: 24px; font-weight: bold; color: #111827; font-family: Arial, Helvetica, sans-serif;">${currSymbol}${formatNumber(total.value)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 24px; box-sizing: border-box;">
        <div style="font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif;">Notes</div>
        <div style="font-size: 14px; color: #374151; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">${invoice.value.notes || 'Thank you for your business.'}</div>
      </div>

      <!-- Footer -->
      <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0; font-family: Arial, Helvetica, sans-serif;">Generated with SwiftInvoice - Professional Invoice Solutions</p>
      </div>
    </div>
  `
}

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

// Load external script dynamically
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Load invoice data on mount
onMounted(() => {
  const id = route.params.id
  invoiceId.value = id
  
  const foundInvoice = invoiceStore.getInvoiceById(id)
  
  if (foundInvoice && foundInvoice.data) {
    // Populate form with existing data
    invoice.value = { ...foundInvoice.data }
  } else {
    showToast('Invoice not found', 'error')
    setTimeout(() => {
      router.push('/history')
    }, 2000)
  }
  
  loading.value = false
})
</script>

<style scoped>
/* Logo constraints */
.logo-container {
  max-width: 64px;
  max-height: 64px;
}

.logo-image {
  object-fit: contain !important;
}

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

/* Print styles */
@media print {
  .logo-container {
    width: 64px !important;
    height: 64px !important;
  }

  .logo-image {
    max-width: 60px !important;
    max-height: 60px !important;
  }
}

/* Responsive table */
@media (max-width: 640px) {
  .invoice-preview {
    font-size: 13px;
  }
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
