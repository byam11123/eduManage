'use client'

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
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditStudentPage() {
    const router = useRouter()
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
    } = useAdmissionForm()

    // Loading state for initial data fetch
    if (formData.firstName === '' && !isSubmitting) {
        // We can show a skeleton or loader here while useEffect in hook is fetching
        // But since hook initializes with INITIAL_DATA, we need a better check
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden p-6 gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Student</h1>
                    <p className="text-sm text-gray-500">Update student enrollment and record information</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
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

                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="w-24 uppercase font-semibold text-xs"
                        >
                            Back
                        </Button>

                        {currentStep < 6 ? (
                            <Button
                                onClick={handleNext}
                                className="w-24 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-semibold text-xs"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-32 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-semibold text-xs"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Update Student'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
