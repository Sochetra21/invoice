import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  // State
  const invoices = ref([])

  // Load invoices from localStorage on initialization
  const loadInvoices = () => {
    try {
      const stored = localStorage.getItem('invoices')
      if (stored) {
        invoices.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading invoices:', error)
      invoices.value = []
    }
  }

  // PDF Click Tracking logic
  const pdfClickCount = ref(parseInt(localStorage.getItem('pdfClickCount') || '0'))

  const incrementPdfClick = () => {
    pdfClickCount.value++
    localStorage.setItem('pdfClickCount', pdfClickCount.value.toString())
    
    // Trigger ONLY at specific thresholds
    const thresholds = [5, 20, 40]
    return thresholds.includes(pdfClickCount.value)
  }

  // Save invoices to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('invoices', JSON.stringify(invoices.value))
    } catch (error) {
      console.error('Error saving invoices:', error)
    }
  }

  // Getters
  const getInvoiceById = (id) => {
    return invoices.value.find((inv) => inv.id === id)
  }

  const allInvoices = computed(() => invoices.value)

  const paidInvoices = computed(() => invoices.value.filter((inv) => inv.status === 'PAID'))

  const draftInvoices = computed(() => invoices.value.filter((inv) => inv.status === 'DRAFT'))

  // Actions
  const addInvoice = (invoiceData) => {
    const newInvoice = {
      id: Date.now().toString(),
      number: invoiceData.invoiceNumber,
      client: invoiceData.clientName,
      date: invoiceData.date,
      status: invoiceData.status,
      total: calculateTotal(invoiceData),
      data: invoiceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    invoices.value.push(newInvoice)
    saveToStorage()
    return newInvoice
  }

  const updateInvoice = (id, invoiceData) => {
    const index = invoices.value.findIndex((inv) => inv.id === id)
    if (index !== -1) {
      invoices.value[index] = {
        ...invoices.value[index],
        number: invoiceData.invoiceNumber,
        client: invoiceData.clientName,
        date: invoiceData.date,
        status: invoiceData.status,
        total: calculateTotal(invoiceData),
        data: invoiceData,
        updatedAt: new Date().toISOString(),
      }
      saveToStorage()
      return invoices.value[index]
    }
    return null
  }

  const deleteInvoice = (id) => {
    const index = invoices.value.findIndex((inv) => inv.id === id)
    if (index !== -1) {
      invoices.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // Helper function to calculate total
  const calculateTotal = (invoiceData) => {
    const subtotal = invoiceData.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0,
    )
    const taxAmount = (subtotal * (invoiceData.taxPercentage || 0)) / 100
    const discountAmount = (subtotal * (invoiceData.discount || 0)) / 100
    return subtotal + taxAmount - discountAmount
  }

  // Initialize store
  loadInvoices()

  return {
    // State
    invoices,
    pdfClickCount,
    // Getters
    getInvoiceById,
    allInvoices,
    paidInvoices,
    draftInvoices,
    // Actions
    addInvoice,
    updateInvoice,
    deleteInvoice,
    loadInvoices,
    incrementPdfClick
  }
})
