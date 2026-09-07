'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
    ScanLine, 
    Camera, 
    Printer, 
    Settings2, 
    RefreshCw, 
    Zap, 
    FileText, 
    Trash2,
    CheckCircle2,
    Loader2,
    Maximize2,
    Minimize2
} from 'lucide-react'
import Webcam from 'react-webcam'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ScannerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onScanComplete: (file: File) => void
    title?: string
}

export const ScannerDialog: React.FC<ScannerDialogProps> = ({
    open,
    onOpenChange,
    onScanComplete,
    title = "Advanced Document Scanner"
}) => {
    // Mode Selection: 'camera' | 'physical'
    const [scanMode, setScanMode] = useState<'camera' | 'physical'>('camera')
    const [isScanning, setIsScanning] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    
    // Scanner Settings
    const [settings, setSettings] = useState({
        pageSize: 'A4',
        dpi: '300',
        colorMode: 'grayscale', // 'color' | 'grayscale' | 'bw'
        autoCrop: true,
        brightness: 50,
        contrast: 60
    })

    const webcamRef = useRef<Webcam>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Reset state on open
    useEffect(() => {
        if (open) {
            setCapturedImage(null)
            setIsScanning(false)
        }
    }, [open])

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            applyFilters(imageSrc)
        }
    }, [webcamRef])

    const applyFilters = (imageSrc: string) => {
        const img = new Image()
        img.src = imageSrc
        img.onload = () => {
            const canvas = canvasRef.current
            if (!canvas) return
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data

            // Apply Brightness/Contrast
            const b = (settings.brightness - 50) * 2.55
            const c = (settings.contrast / 50) ** 2

            for (let i = 0; i < data.length; i += 4) {
                // Color mode processing
                if (settings.colorMode === 'grayscale' || settings.colorMode === 'bw') {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
                    
                    let val = avg
                    if (settings.colorMode === 'bw') {
                        val = avg > 128 ? 255 : 0
                    }

                    // Apply Contrast & Brightness
                    val = (val - 128) * c + 128 + b
                    
                    data[i] = data[i + 1] = data[i + 2] = Math.min(255, Math.max(0, val))
                } else {
                    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * c + 128 + b))
                    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * c + 128 + b))
                    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * c + 128 + b))
                }
            }

            ctx.putImageData(imageData, 0, 0)
            setCapturedImage(canvas.toDataURL('image/jpeg', 0.9))
        }
    }

    const handlePhysicalScan = async () => {
        setIsScanning(true)
        // Simulated Physical Scan Logic
        // In a real implementation, this would call a local bridge API (e.g. localhost:18622)
        toast.info(`Connecting to ${settings.pageSize} Scanner at ${settings.dpi} DPI...`)
        
        setTimeout(() => {
            setIsScanning(false)
            toast.error("Physical scanner bridge not detected. Please ensure 'EduManage Scan Agent' is running.")
            // For demo purposes, we fall back to a simulation message
        }, 2000)
    }

    const handleFinalize = () => {
        if (!capturedImage) return
        
        // Convert base64 to file
        const byteString = atob(capturedImage.split(',')[1])
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([ab], { type: 'image/jpeg' })
        const file = new File([blob], `scan_${Date.now()}.jpg`, { type: 'image/jpeg' })
        
        onScanComplete(file)
        onOpenChange(false)
        toast.success("Document scanned and processed successfully")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl rounded-[3rem] border-none p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-3xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex h-[700px]">
                    {/* Sidebar Settings */}
                    <div className="w-80 bg-gray-50/50 dark:bg-gray-950/50 border-r border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-8">
                        <div>
                            <h3 className="text-xl font-black tracking-tight mb-1">Scan Protocol</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Configure your hardware</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Source Device</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                        variant={scanMode === 'camera' ? 'default' : 'outline'}
                                        onClick={() => setScanMode('camera')}
                                        className="h-12 rounded-xl gap-2 font-bold"
                                    >
                                        <Camera className="h-4 w-4" /> Camera
                                    </Button>
                                    <Button 
                                        variant={scanMode === 'physical' ? 'default' : 'outline'}
                                        onClick={() => setScanMode('physical')}
                                        className="h-12 rounded-xl gap-2 font-bold"
                                    >
                                        <Printer className="h-4 w-4" /> Scanner
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Page Size</Label>
                                <Select value={settings.pageSize} onValueChange={(v) => setSettings({...settings, pageSize: v})}>
                                    <SelectTrigger className="h-12 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A4">A4 (Standard)</SelectItem>
                                        <SelectItem value="Legal">Legal</SelectItem>
                                        <SelectItem value="Letter">Letter</SelectItem>
                                        <SelectItem value="ID_Card">ID Card / Passport</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Resolution (DPI)</Label>
                                <Select value={settings.dpi} onValueChange={(v) => setSettings({...settings, dpi: v})}>
                                    <SelectTrigger className="h-12 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="75">75 DPI (Draft)</SelectItem>
                                        <SelectItem value="150">150 DPI (Fast)</SelectItem>
                                        <SelectItem value="300">300 DPI (HQ)</SelectItem>
                                        <SelectItem value="600">600 DPI (Ultra)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Color Profile</Label>
                                <div className="flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                    {(['color', 'grayscale', 'bw'] as const).map((m) => (
                                        <Button
                                            key={m}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setSettings({...settings, colorMode: m})}
                                            className={cn(
                                                "flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                settings.colorMode === m ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400"
                                            )}
                                        >
                                            {m}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Auto Crop</Label>
                                    <Switch 
                                        checked={settings.autoCrop} 
                                        onCheckedChange={(v) => setSettings({...settings, autoCrop: v})} 
                                    />
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contrast</Label>
                                        <span className="text-[10px] font-black text-indigo-600">{settings.contrast}%</span>
                                    </div>
                                    <Slider 
                                        value={[settings.contrast]} 
                                        onValueChange={([v]) => setSettings({...settings, contrast: v})}
                                        max={100} 
                                        step={1} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Preview Area */}
                    <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex flex-col">
                        <div className="p-6 flex items-center justify-between bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Maximize2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Live Feed Preview</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resolution: {settings.pageSize} @ {settings.dpi}DPI</p>
                                </div>
                            </div>
                            {capturedImage && (
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setCapturedImage(null)}
                                    className="text-rose-500 hover:text-rose-600 font-bold text-xs gap-2"
                                >
                                    <Trash2 className="h-4 w-4" /> Discard Scan
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 p-10 flex items-center justify-center relative overflow-hidden">
                            {!capturedImage ? (
                                <div className="relative w-full max-w-2xl aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 transition-all duration-500">
                                    {scanMode === 'camera' ? (
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={{
                                                facingMode: "environment",
                                                width: 1280,
                                                height: 720
                                            }}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-gray-500">
                                            <div className={cn(
                                                "h-24 w-24 bg-gray-800 rounded-3xl flex items-center justify-center text-indigo-500",
                                                isScanning && "animate-pulse"
                                            )}>
                                                <Printer className="h-12 w-12" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-lg text-white">Physical Scanner Active</p>
                                                <p className="text-sm font-medium">Waiting for hardware trigger...</p>
                                            </div>
                                        </div>
                                    )}
                                    {/* Scan Guidelines */}
                                    <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                                        <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Align Document Here</p>
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-2">
                                            <Zap className="h-3 w-3 text-yellow-400" /> Auto Exposure
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full max-w-2xl aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
                                    <img src={capturedImage} className="w-full h-full object-contain" alt="Captured Scan" />
                                </div>
                            )}

                            {/* Hidden canvas for processing */}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="p-10 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Scanner Online</span>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => onOpenChange(false)}
                                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-900"
                                >
                                    Cancel
                                </Button>
                                {!capturedImage ? (
                                    <Button 
                                        onClick={scanMode === 'camera' ? handleCapture : handlePhysicalScan}
                                        disabled={isScanning}
                                        className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95 gap-3"
                                    >
                                        {isScanning ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                {scanMode === 'camera' ? <Zap className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                                                {scanMode === 'camera' ? 'Capture Scan' : 'Initialize Scan'}
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleFinalize}
                                        className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-100 dark:shadow-none transition-all hover:scale-105 active:scale-95 gap-3"
                                    >
                                        <CheckCircle2 className="h-4 w-4" /> Use This Scan
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
