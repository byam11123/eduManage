'use client'

import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useAdmissionForm } from '@/hooks'
import {
    AdmissionSidebar as Sidebar,
    ADMISSION_STEPS,
    Step1BasicDetails as Step1,
    Step2Qualifications as Step2,
    Step3CourseBatch as Step3,
    Step4PaymentDetails as Step4,
    Step5InstallmentDetails as Step5,
    Step6ReviewDetails as Step6
} from '@/components/admin/students/admission-form'

export default function StudentAdmissionPage() {
    const {
        currentStep,
        setCurrentStep,
        formData,
        isSubmitting,
        isAddCourseOpen,
        setIsAddCourseOpen,
        isAddBatchOpen,
        setIsAddBatchOpen,
        savingNewCourse,
        savingNewBatch,
        newCourseData,
        setNewCourseData,
        newBatchData,
        setNewBatchData,
        courses,
        batches,
        handleInputChange,
        handleSelectChange,
        handleInstallmentChange,
        handleImageUpload,
        handleAddCourse,
        handleAddBatch,
        handleNext,
        handleBack,
        handleSubmit,
        handleSaveDraft,
        handleResumeDraft,
        handleDiscardDraft,
        hasDraft
    } = useAdmissionForm()

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <div className="flex flex-col xl:flex-row gap-10 items-start">
                {/* Sidebar Steps */}
                <Sidebar
                    currentStep={currentStep}
                    onStepSelect={setCurrentStep}
                />

                {/* Main Form Area */}
                <div className="flex-1 w-full max-w-5xl">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                        <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Onboarding Protocol</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                                        Step {currentStep}: {ADMISSION_STEPS[currentStep - 1].title}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-6 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure Entry Active</span>
                            </div>
                        </div>

                        <div className="p-10 min-h-[500px]">
                            {currentStep === 1 && (
                                <Step1
                                    formData={formData}
                                    onChange={handleInputChange}
                                    onSelectChange={handleSelectChange}
                                    onDateChange={handleSelectChange}
                                    onImageUpload={handleImageUpload}
                                    onImageRemove={() => handleSelectChange('imageUrl', '')}
                                />
                            )}

                            {currentStep === 2 && (
                                <Step2
                                    formData={formData}
                                    onChange={handleInputChange}
                                    onSelectChange={handleSelectChange}
                                />
                            )}

                            {currentStep === 3 && (
                                <Step3
                                    formData={formData}
                                    onSelectChange={handleSelectChange}
                                    courses={courses}
                                    batches={batches}
                                    isAddCourseOpen={isAddCourseOpen}
                                    setIsAddCourseOpen={setIsAddCourseOpen}
                                    isAddBatchOpen={isAddBatchOpen}
                                    setIsAddBatchOpen={setIsAddBatchOpen}
                                    savingNewCourse={savingNewCourse}
                                    savingNewBatch={savingNewBatch}
                                    newCourseData={newCourseData}
                                    setNewCourseData={setNewCourseData}
                                    newBatchData={newBatchData}
                                    setNewBatchData={setNewBatchData}
                                    onAddCourse={handleAddCourse}
                                    onAddBatch={handleAddBatch}
                                />
                            )}

                            {currentStep === 4 && (
                                <Step4
                                    formData={formData}
                                    onChange={handleInputChange}
                                    onSelectChange={handleSelectChange}
                                />
                            )}

                            {currentStep === 5 && (
                                <Step5
                                    formData={formData}
                                    onSelectChange={handleSelectChange}
                                    handleInstallmentChange={handleInstallmentChange}
                                />
                            )}

                            {currentStep === 6 && (
                                <Step6
                                    formData={formData}
                                    courses={courses}
                                    batches={batches}
                                />
                            )}
                        </div>

                        <div className="p-10 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex gap-4 w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="flex-1 sm:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Previous Step
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSaveDraft}
                                    className="flex-1 sm:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-100 transition-all"
                                >
                                    Save Session
                                </Button>
                            </div>
                            <Button
                                onClick={currentStep === ADMISSION_STEPS.length ? handleSubmit : handleNext}
                                disabled={isSubmitting}
                                className="w-full sm:w-56 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {isSubmitting ? 'Synchronizing...' : currentStep === ADMISSION_STEPS.length ? 'Finalize Admission' : 'Continue Entry'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Resume Draft Dialog */}
            <AlertDialog open={hasDraft && currentStep === 1 && Object.values(formData).every(v => v === '' || (Array.isArray(v) && v.length === 0) || v === 'India' || v === 'OCI-1')}>
                <AlertDialogContent className="rounded-[3rem] border-none p-12 shadow-3xl bg-white dark:bg-gray-950">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Resume Session?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 font-bold text-base mt-4 leading-relaxed">
                            We found an incomplete admission protocol from your last visit. Would you like to resume your institutional entry or start fresh?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-12 gap-5">
                        <AlertDialogCancel onClick={handleDiscardDraft} className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 border-none hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">Discard Session</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResumeDraft} className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] border-none shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02]">Resume Protocol</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
