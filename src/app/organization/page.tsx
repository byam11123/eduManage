'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, ArrowLeft, Upload, GraduationCap } from 'lucide-react'
import { INDIAN_STATES } from '@/lib/constants'

interface OrganizationData {
  id?: string
  name: string
  description: string
  logo?: string
  industry?: string
  size?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

// Major cities by state (simplified)
const CITIES_BY_STATE: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Ghaziabad', 'Agra', 'Varanasi'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
}

export default function OrganizationPage() {
  const router = useRouter()
  const [organization, setOrganization] = useState<OrganizationData>({
    name: '',
    description: '',
    logo: '',
    industry: 'education',
    size: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [enableGST, setEnableGST] = useState(false)
  const [availableCities, setAvailableCities] = useState<string[]>([])

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch('/api/organization')
        const data = await response.json()

        if (data.success && data.organization) {
          setOrganization(data.organization)
        }
      } catch (err) {
        console.error('[Organization] Error fetching organization:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [])

  // Update cities when state changes
  useEffect(() => {
    if (organization.state) {
      const cities = CITIES_BY_STATE[organization.state] || []
      setAvailableCities(cities)
      // Reset city if it's not in the new state
      if (organization.city && !cities.includes(organization.city)) {
        setOrganization(prev => ({ ...prev, city: '' }))
      }
    } else {
      setAvailableCities([])
    }
  }, [organization.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      setError('Please accept the terms and conditions to continue')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const isExisting = !!organization.id
      const method = isExisting ? 'PUT' : 'POST'

      const response = await fetch('/api/organization', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organization),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to save organization')
        return
      }

      setSuccess('🎉 Organization created successfully! Redirecting to dashboard...')
      if (data.organization) {
        setOrganization(data.organization)
      }

      // Redirect after creation - use router.push for better navigation
      if (!isExisting) {
        const redirectPath = data.redirectTo || '/admin'
        console.log('[Organization] Redirecting to:', redirectPath)
        setTimeout(() => {
          router.push(redirectPath)
        }, 1000)
      }
    } catch (err) {
      console.error('[Organization] Error saving:', err)
      setError('Failed to save organization. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo file size must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setOrganization({ ...organization, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Demo data fill function
  const fillDemoData = () => {
    setOrganization({
      ...organization,
      name: 'Excellence Coaching Institute',
      description: 'A premier coaching institute specializing in competitive exam preparation including IIT-JEE, NEET, and other entrance examinations. We have been nurturing talent since 2015 with a track record of 500+ selections.',
      website: 'https://excellencecoaching.edu.in',
      phone: '+91 98765 43210',
      email: 'info@excellencecoaching.edu.in',
      address: '123, Knowledge Park, Sector 15',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302001',
      industry: 'education',
      size: '11-50',
    })
    setAcceptTerms(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-5xl mx-auto px-4 space-y-6">
          <div className="h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl animate-pulse" />
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="h-20 bg-indigo-100 dark:bg-indigo-900/30 animate-pulse" />
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg hidden sm:inline tracking-tight">EduManage</span>
            </div>
          </div>
        </div>
      </header>

      {/* Onboarding progress bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {[['✓', 'Account Created', true], ['2', 'Setup Institute', true], ['3', 'Launch', false]].map(([num, label, done], i) => (
              <div key={label as string} className="flex items-center gap-2">
                {i > 0 && <div className={`h-px w-8 sm:w-14 ${done ? 'bg-indigo-400' : 'bg-border'}`} />}
                <div className={`flex items-center gap-1.5 text-xs font-medium ${
                  i === 1 ? 'text-indigo-600 dark:text-indigo-400' :
                  (done as boolean) ? 'text-emerald-600' : 'text-muted-foreground'
                }`}>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs border-2 ${
                    i === 1 ? 'border-indigo-500 bg-indigo-500 text-white' :
                    (done as boolean) ? 'border-emerald-500 bg-emerald-500 text-white' :
                    'border-muted-foreground/30 text-muted-foreground'
                  }`}>{num}</div>
                  <span className="hidden sm:inline">{label as string}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              Setup Your Coaching Institute
            </h1>
            <p className="text-indigo-100 mt-1">Tell us about your institute — you can update this anytime</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Alerts */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Demo Data Button — dev only */}
            {!organization.id && process.env.NODE_ENV !== 'production' && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoData}
                  className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  Fill Demo Data
                </Button>
              </div>
            )}

            {/* Row 1: Name & Website */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Organization name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={organization.name}
                  onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                  placeholder="e.g., Excellence Coaching Institute"
                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Organization website URL
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={organization.website}
                  onChange={(e) => setOrganization({ ...organization, website: e.target.value })}
                  placeholder="https://yourcoaching.com"
                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Row 2: Logo & Country */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-6 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  {organization.logo ? (
                    <div className="flex items-center gap-2">
                      <img src={organization.logo} alt="Logo" className="h-12 w-12 rounded-lg object-cover border" />
                      <button
                        type="button"
                        onClick={() => setOrganization({ ...organization, logo: '' })}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No file chosen</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Organization Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={organization.country}
                  onValueChange={(value) => setOrganization({ ...organization, country: value })}
                >
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: State & City */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  Organization State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={organization.state}
                  onValueChange={(value) => setOrganization({ ...organization, state: value })}
                >
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Organization City <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={organization.city}
                  onValueChange={(value) => setOrganization({ ...organization, city: value })}
                  disabled={!organization.state}
                >
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder={organization.state ? "Select city" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.length > 0 ? (
                      availableCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="other">Other</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Pincode & Email */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium">
                  Organization pincode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  value={organization.zipCode}
                  onChange={(e) => setOrganization({ ...organization, zipCode: e.target.value })}
                  placeholder="e.g., 302001"
                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Organization e-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={organization.email}
                  onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                  placeholder="info@yourcoaching.com"
                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Row 5: Phone */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Organization phone number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select defaultValue="+91">
                    <SelectTrigger className="w-24 h-12 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">IN +91</SelectItem>
                      <SelectItem value="+1">US +1</SelectItem>
                      <SelectItem value="+44">UK +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    value={organization.phone}
                    onChange={(e) => setOrganization({ ...organization, phone: e.target.value })}
                    placeholder="98765 43210"
                    className="h-12 flex-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium">
                  Institute Size
                </Label>
                <Select
                  value={organization.size}
                  onValueChange={(value) => setOrganization({ ...organization, size: value })}
                >
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 students</SelectItem>
                    <SelectItem value="11-50">11-50 students</SelectItem>
                    <SelectItem value="51-200">51-200 students</SelectItem>
                    <SelectItem value="201-500">201-500 students</SelectItem>
                    <SelectItem value="500+">500+ students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 6: Address & About */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Organization address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  value={organization.address}
                  onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                  placeholder="Full address of your coaching institute"
                  className="min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  About organization
                </Label>
                <Textarea
                  id="description"
                  value={organization.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setOrganization({ ...organization, description: e.target.value })
                    }
                  }}
                  placeholder="Describe your coaching institute, courses offered, achievements, etc."
                  className="min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  Max 500 words ({organization.description?.length || 0}/500)
                </p>
              </div>
            </div>

            {/* GST Option */}
            <div className="flex items-center gap-6 py-2">
              <Label className="text-sm font-medium">Enable GST?</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gst"
                    checked={enableGST}
                    onChange={() => setEnableGST(true)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gst"
                    checked={!enableGST}
                    onChange={() => setEnableGST(false)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                  <span className="text-blue-600 hover:underline">
                    ACCEPT TERMS AND CONDITIONS
                  </span>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={saving || !acceptTerms}
                className="min-w-[200px] h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all duration-200"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'CREATE ORGANIZATION'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EduManage. All rights reserved.
      </footer>
    </div>
  )
}
