import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StudentAdmissionFormData } from '@/lib/types'

interface AdmissionDraftState {
    draftData: StudentAdmissionFormData | null
    currentStep: number
    hasDraft: boolean

    // Actions
    saveDraft: (data: StudentAdmissionFormData, step: number) => void
    clearDraft: () => void
}

export const useAdmissionDraftStore = create<AdmissionDraftState>()(
    persist(
        (set) => ({
            draftData: null,
            currentStep: 1,
            hasDraft: false,

            saveDraft: (data, step) => set({
                draftData: data,
                currentStep: step,
                hasDraft: true
            }),

            clearDraft: () => set({
                draftData: null,
                currentStep: 1,
                hasDraft: false
            }),
        }),
        {
            name: 'admission-form-draft',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
