'use client'

import { FileX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DocumentsTab() {
    return (
        <Card className="border-none shadow-sm min-h-[400px] flex flex-col justify-center items-center">
            <CardHeader>
                <CardTitle className="sr-only">Student Documents</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-8">
                <div className="relative mb-6">
                    <div className="h-32 w-48 bg-gray-100 rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden">
                        <div className="absolute top-2 left-2 flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        </div>
                        <FileX className="h-12 w-12 text-gray-300" />

                        {/* Orange Question Marks (Decorative) */}
                        <span className="absolute -top-2 right-4 text-3xl font-bold text-orange-400 rotate-12">?</span>
                        <span className="absolute bottom-4 left-4 text-2xl font-bold text-orange-400 -rotate-12">?</span>

                        {/* Illustration Mockup similar to image */}
                        <div className="absolute bottom-0 right-8 w-16 h-16 bg-blue-600 rounded-t-lg opacity-80 z-10"></div>
                        <div className="absolute bottom-0 right-14 w-20 h-20 bg-orange-400 rounded-full z-0"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded border shadow-lg px-3 py-2 flex flex-col items-center z-20">
                            <span className="text-gray-300 font-bold text-lg leading-none">×</span>
                            <span className="text-[6px] text-gray-400">No Course Found!</span>
                        </div>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Student Documents</h3>
                <p className="text-gray-500 mt-2">No documents available for this student.</p>
            </CardContent>
        </Card>
    )
}
