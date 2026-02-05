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
        <div className="flex flex-col md:flex-row gap-6 p-6 h-[calc(100vh-4rem)] overflow-hidden">
            {/* Sidebar Steps */}
            <Sidebar
                currentStep={currentStep}
                onStepSelect={setCurrentStep}
            />

            {/* Main Form Area */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {ADMISSION_STEPS[currentStep - 1].title}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {ADMISSION_STEPS[currentStep - 1].description}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
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

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="w-24 uppercase font-semibold"
                        >
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleSaveDraft}
                            className="w-32 uppercase font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Save Draft
                        </Button>
                    </div>
                    <Button
                        onClick={currentStep === ADMISSION_STEPS.length ? handleSubmit : handleNext}
                        disabled={isSubmitting}
                        className="w-28 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-semibold"
                    >
                        {isSubmitting ? 'Saving...' : currentStep === ADMISSION_STEPS.length ? 'Confirm' : 'Next'}
                    </Button>
                </div>
            </div>

            {/* Resume Draft Dialog */}
            <AlertDialog open={hasDraft && currentStep === 1 && Object.values(formData).every(v => v === '' || (Array.isArray(v) && v.length === 0) || v === 'India' || v === 'OCI-1')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Resume previous session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            We found an incomplete admission form from your last visit. Would you like to resume where you left off?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDiscardDraft}>Discard Draft</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResumeDraft} className="bg-indigo-600 hover:bg-indigo-700">Resume Draft</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
