export default function TimetablePage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Timetable Management</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                This module is currently under development. Soon you'll be able to manage class schedules and timetables here.
            </p>
        </div>
    )
}
