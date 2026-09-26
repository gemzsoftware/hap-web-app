'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    UserCircle,
    Loader2,
    Calculator,
    CreditCard,
    Wallet,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Users,
    Building2,
    ShieldCheck,
    ArrowLeft,
    ChevronDown
} from 'lucide-react'

import { applicationsAPI, propertiesAPI } from '@/lib/api/client'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'

// ─── Country data ──────────────────────────────────────────────────────────

const C = (
    id,
    name,
    code,
    flag,
    example,
    min,
    max,
    nationalPrefix = '0',
    displayFormat = ''
) => ({
    id,
    name,
    code,
    flag,
    displayFormat,
    example,
    minDigits: min,
    maxDigits: max,
    nationalPrefix
})

const COUNTRIES = {
    NG: C(
        'NG',
        'Nigeria',
        '+234',
        '🇳🇬',
        '808 267 9797',
        10,
        11
    ),

    GH: C(
        'GH',
        'Ghana',
        '+233',
        '🇬🇭',
        '302 123 456',
        7,
        9
    ),

    KE: C(
        'KE',
        'Kenya',
        '+254',
        '🇰🇪',
        '712 123 456',
        7,
        9
    ),

    ZA: C(
        'ZA',
        'South Africa',
        '+27',
        '🇿🇦',
        '82 123 4567',
        7,
        9
    ),

    EG: C(
        'EG',
        'Egypt',
        '+20',
        '🇪🇬',
        '123 456 7890',
        7,
        10
    ),

    MA: C(
        'MA',
        'Morocco',
        '+212',
        '🇲🇦',
        '612 345 678',
        7,
        9
    ),

    TZ: C(
        'TZ',
        'Tanzania',
        '+255',
        '🇹🇿',
        '712 345 678',
        7,
        9
    ),

    UG: C(
        'UG',
        'Uganda',
        '+256',
        '🇺🇬',
        '712 345 678',
        7,
        9
    ),

    RW: C(
        'RW',
        'Rwanda',
        '+250',
        '🇷🇼',
        '788 123 456',
        7,
        9
    ),

    ZM: C(
        'ZM',
        'Zambia',
        '+260',
        '🇿🇲',
        '966 123 456',
        7,
        9
    ),

    ZW: C(
        'ZW',
        'Zimbabwe',
        '+263',
        '🇿🇼',
        '712 345 678',
        7,
        9
    ),

    US: C(
        'US',
        'United States',
        '+1',
        '🇺🇸',
        '555 555 5555',
        10,
        10,
        '',
        '(XXX) XXX-XXXX'
    ),

    CA: C(
        'CA',
        'Canada',
        '+1',
        '🇨🇦',
        '555 555 5555',
        10,
        10,
        '',
        '(XXX) XXX-XXXX'
    ),

    GB: C(
        'GB',
        'United Kingdom',
        '+44',
        '🇬🇧',
        '7911 123456',
        7,
        10
    ),

    DE: C(
        'DE',
        'Germany',
        '+49',
        '🇩🇪',
        '1512 3456789',
        7,
        11
    ),

    FR: C(
        'FR',
        'France',
        '+33',
        '🇫🇷',
        '6 12 34 56 78',
        7,
        9
    ),

    AU: C(
        'AU',
        'Australia',
        '+61',
        '🇦🇺',
        '412 345 678',
        7,
        9
    ),

    IN: C(
        'IN',
        'India',
        '+91',
        '🇮🇳',
        '98765 43210',
        10,
        10,
        '0',
        'XXXXX XXXXX'
    ),

    PK: C(
        'PK',
        'Pakistan',
        '+92',
        '🇵🇰',
        '300 1234567',
        7,
        10
    ),

    BD: C(
        'BD',
        'Bangladesh',
        '+880',
        '🇧🇩',
        '1712 345678',
        7,
        10
    )
}

const ALL_COUNTRIES = Object.values(COUNTRIES).sort((a, b) =>
    a.name.localeCompare(b.name)
)

const getCountryById = id =>
    COUNTRIES[id] || COUNTRIES.NG

const getCountryByCode = code =>
    Object.values(COUNTRIES).find(country => country.code === code) ||
    COUNTRIES.NG

// ─── Phone helpers ─────────────────────────────────────────────────────────

const normalizePhone = phone =>
    String(phone || '').replace(/[\s\-()[\]]/g, '')

const getNationalDigits = (phone, countryCode) => {
    const cleaned = normalizePhone(phone)

    if (!cleaned) {
        return ''
    }

    const country = getCountryByCode(countryCode)

    if (cleaned.startsWith(country.code)) {
        return cleaned.substring(country.code.length)
    }

    if (
        country.nationalPrefix &&
        cleaned.startsWith(country.nationalPrefix)
    ) {
        return cleaned.substring(1)
    }

    return cleaned
}

const buildInternationalPhone = (phone, countryCode) => {
    const country = getCountryByCode(countryCode)
    const digits = getNationalDigits(phone, countryCode)

    if (!digits) {
        return ''
    }

    return `${country.code}${digits}`
}

const validatePhone = (phone, countryCode) => {
    const country = getCountryByCode(countryCode)
    const digits = getNationalDigits(phone, countryCode)

    if (!/^\d+$/.test(digits)) {
        return false
    }

    return (
        digits.length >= country.minDigits &&
        digits.length <= country.maxDigits
    )
}

const formatPhone = (phone, countryCode) => {
    const country = getCountryByCode(countryCode || '+234')
    const nationalDigits = getNationalDigits(phone, country.code)

    if (country.id === 'NG') {
        if (nationalDigits.length === 10) {
            return `${nationalDigits.slice(0, 3)} ${nationalDigits.slice(3, 6)} ${nationalDigits.slice(6)}`
        }

        if (nationalDigits.length === 11) {
            return `${nationalDigits.slice(0, 4)} ${nationalDigits.slice(4, 7)} ${nationalDigits.slice(7)}`
        }
    }

    if (
        ['US', 'CA'].includes(country.id) &&
        nationalDigits.length === 10
    ) {
        return `(${nationalDigits.slice(0, 3)}) ${nationalDigits.slice(3, 6)}-${nationalDigits.slice(6)}`
    }

    if (
        country.id === 'GB' &&
        nationalDigits.length === 10
    ) {
        return `${nationalDigits.slice(0, 5)} ${nationalDigits.slice(5)}`
    }

    if (
        country.id === 'IN' &&
        nationalDigits.length === 10
    ) {
        return `${nationalDigits.slice(0, 5)} ${nationalDigits.slice(5)}`
    }

    return nationalDigits.length > 4
        ? nationalDigits.match(/.{1,3}/g)?.join(' ') ||
          nationalDigits
        : nationalDigits
}

const detectCountry = phone => {
    const cleaned = normalizePhone(phone)

    if (!cleaned) {
        return COUNTRIES.NG
    }

    const matches = Object.values(COUNTRIES)
        .filter(country => cleaned.startsWith(country.code))
        .sort((a, b) => b.code.length - a.code.length)

    return matches[0] || COUNTRIES.NG
}

const getPhoneError = (phone, countryCode) => {
    if (!phone) {
        return null
    }

    const country = getCountryByCode(countryCode)
    const digits = getNationalDigits(phone, countryCode)

    if (!/^\d+$/.test(digits)) {
        return 'Phone number can only contain digits'
    }

    if (digits.length < country.minDigits) {
        return `Phone number must be at least ${country.minDigits} digits`
    }

    if (digits.length > country.maxDigits) {
        return `Phone number cannot exceed ${country.maxDigits} digits`
    }

    return null
}

// ─── UI primitives ─────────────────────────────────────────────────────────

const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'

const phoneInputCls = error =>
    `w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-slate-900 outline-none transition-all ${
        error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
    }`

const Field = ({
    label,
    children,
    className = ''
}) => (
    <div className={className}>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            {label}
        </label>

        {children}
    </div>
)

const Section = ({
    title,
    icon: Icon,
    iconColor,
    children
}) => (
    <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            {title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
)

const TextField = ({
    label,
    value,
    onChange,
    className,
    placeholder,
    type = 'text',
    required,
    icon: Icon
}) => (
    <Field
        label={label}
        className={className}
    >
        {Icon ? (
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`${inputCls} pl-10`}
                    placeholder={placeholder}
                />
            </div>
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className={inputCls}
                placeholder={placeholder}
            />
        )}
    </Field>
)

// ─── Page shell ─────────────────────────────────────────────────────────────
//
// IMPORTANT:
// This component MUST remain outside ApplyPage.
// If it is declared inside ApplyPage, React creates a new component type
// on every form state update, causing inputs to lose focus/remount.

const Shell = ({ children }) => (
    <div className="bg-white min-h-screen flex flex-col">
        {children}
    </div>
)

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ApplyPage() {
    const { id } = useParams()
    const router = useRouter()

    const {
        user,
        isAuthenticated,
        loading: authLoading
    } = useAuth()

    const fileInputRef = useRef(null)

    const [land, setLand] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const [paymentType, setPaymentType] = useState(null)

    const [selectedCountryId, setSelectedCountryId] =
        useState('NG')

    const [showCountryDropdown, setShowCountryDropdown] =
        useState(false)

    const [manualCountryCode, setManualCountryCode] =
        useState('+234')

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        dateOfBirth: '',
        gender: '',
        phone: user?.phone || '',
        maritalStatus: '',
        residentialAddress: '',
        idNumber: '',
        email: user?.email || '',
        occupation: '',

        selectedMonths: '',

        kinName: '',
        kinPhone: '',
        kinRelationship: '',
        kinEmail: '',
        kinAddress: '',

        realtorName: '',
        realtorPhone: '',
        realtorEmail: '',
        realtorGroup: '',

        declarationAgreed: false
    })

    const updateField = (field, value) => {
        setFormData(previous => ({
            ...previous,
            [field]: value
        }))
    }

    const country = getCountryById(selectedCountryId)

    const totalPrice = Number(land?.price || 0)

    const installmentPlan =
        land?.installmentPlan || null

    const installmentOptions = Array.isArray(
        installmentPlan?.options
    )
        ? installmentPlan.options
        : []

    const landDeposit = Number(
        installmentPlan?.initialDeposit || 0
    )

    const isInstallmentActive =
        installmentPlan?.isActive === true &&
        installmentOptions.length > 0

    const selectedOption =
        installmentOptions.find(
            option =>
                Number(option.months) ===
                Number(formData.selectedMonths)
        ) || null

    const formattedDate =
        new Date().toLocaleDateString(
            'en-NG',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        )

    const phoneError = getPhoneError(
        formData.phone,
        country.code
    )

    // ─── Sync authenticated user data ──────────────────────────────────────

    useEffect(() => {
        if (!user) {
            return
        }

        const detected = user.phone
            ? detectCountry(user.phone)
            : COUNTRIES.NG

        const nationalPhone = user.phone
            ? getNationalDigits(
                  user.phone,
                  detected.code
              )
            : ''

        setFormData(previous => ({
            ...previous,

            fullName:
                user.fullName ||
                previous.fullName ||
                '',

            email:
                user.email ||
                previous.email ||
                '',

            ...(user.phone
                ? {
                      phone: nationalPhone
                  }
                : {})
        }))

        if (user.phone) {
            setSelectedCountryId(
                detected.id
            )

            setManualCountryCode(
                detected.code
            )
        }
    }, [user])

    // ─── Load property ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!id) {
            return
        }

        let mounted = true

        const loadProperty = async () => {
            try {
                const response =
                    await propertiesAPI.getById(id)

                if (!mounted) {
                    return
                }

                const property =
                    response?.property ||
                    response?.data?.property ||
                    response?.data ||
                    response

                if (!property) {
                    throw new Error(
                        'Property not found'
                    )
                }

                setLand(property)

                const options =
                    Array.isArray(
                        property?.installmentPlan
                            ?.options
                    )
                        ? property
                              .installmentPlan
                              .options
                        : []

                if (options.length > 0) {
                    setFormData(previous => ({
                        ...previous,
                        selectedMonths:
                            Number(
                                options[0].months
                            )
                    }))
                }
            } catch (err) {
                if (mounted) {
                    setError(
                        err?.message ||
                            'Could not load property details. Please go back and try again.'
                    )
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadProperty()

        return () => {
            mounted = false
        }
    }, [id])

    // ─── Authentication guard ───────────────────────────────────────────────

    useEffect(() => {
        if (
            !authLoading &&
            !isAuthenticated
        ) {
            router.push(
                `/login?redirect=/properties/${id}/apply`
            )
        }
    }, [
        authLoading,
        isAuthenticated,
        router,
        id
    ])

    // ─── Close country dropdown when clicking outside ───────────────────────

    useEffect(() => {
        const handler = event => {
            if (
                showCountryDropdown &&
                !event.target.closest(
                    '[data-country-selector]'
                )
            ) {
                setShowCountryDropdown(false)
            }
        }

        document.addEventListener(
            'mousedown',
            handler
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handler
            )
        }
    }, [showCountryDropdown])

    // ─── File upload ────────────────────────────────────────────────────────

    const handleFileChange = event => {
        const selectedFile =
            event.target.files?.[0]

        if (!selectedFile) {
            return
        }

        if (
            selectedFile.size >
            5 * 1024 * 1024
        ) {
            setSubmitError(
                'File size must be less than 5MB'
            )

            event.target.value = ''

            return
        }

        if (
            ![
                'image/jpeg',
                'image/png',
                'image/jpg'
            ].includes(selectedFile.type)
        ) {
            setSubmitError(
                'Please upload a JPEG or PNG image'
            )

            event.target.value = ''

            return
        }

        setFile(selectedFile)

        const reader =
            new FileReader()

        reader.onloadend = () => {
            setImagePreview(
                reader.result
            )
        }

        reader.readAsDataURL(
            selectedFile
        )

        setSubmitError('')
    }

    // ─── Country selection ──────────────────────────────────────────────────

    const handleCountrySelect = countryId => {
        const selected =
            getCountryById(countryId)

        setSelectedCountryId(
            selected.id
        )

        setManualCountryCode(
            selected.code
        )

        setShowCountryDropdown(false)
        setSubmitError('')

        if (formData.phone) {
            setFormData(previous => ({
                ...previous,
                phone: getNationalDigits(
                    previous.phone,
                    selected.code
                )
            }))
        }
    }

    const handleManualCountryCodeChange =
        event => {
            let value =
                event.target.value

            value = value
                .replace(/[^0-9+]/g, '')

            if (!value.startsWith('+')) {
                value = `+${value.replace(
                    /\+/g,
                    ''
                )}`
            }

            const plusCount =
                (
                    value.match(
                        /\+/g
                    ) || []
                ).length

            if (plusCount > 1) {
                value =
                    '+' +
                    value
                        .replace(
                            /\+/g,
                            ''
                        )
            }

            setManualCountryCode(value)
            setSubmitError('')

            const matchingCountries =
                ALL_COUNTRIES.filter(
                    item =>
                        item.code === value
                )

            if (
                matchingCountries.length === 1
            ) {
                setSelectedCountryId(
                    matchingCountries[0].id
                )

                if (formData.phone) {
                    setFormData(previous => ({
                        ...previous,
                        phone: getNationalDigits(
                            previous.phone,
                            value
                        )
                    }))
                }

                return
            }

            /*
             * +1 belongs to both US and Canada.
             * The calling code alone cannot determine which country.
             */
            if (value !== '+1') {
                setSelectedCountryId('NG')
            }
        }

    // ─── Applicant phone ────────────────────────────────────────────────────

    const handlePhoneChange = event => {
        const value =
            event.target.value.replace(
                /[^0-9\s\-()+]/g,
                ''
            )

        updateField(
            'phone',
            value
        )

        if (submitError) {
            setSubmitError('')
        }
    }

    const handlePhoneBlur = () => {
        if (formData.phone) {
            updateField(
                'phone',
                formatPhone(
                    formData.phone,
                    country.code
                )
            )
        }
    }

    // ─── Submit application ─────────────────────────────────────────────────

    const handleSubmit = async event => {
        event.preventDefault()

        setSubmitError('')

        if (isProcessing) {
            return
        }

        if (!isAuthenticated) {
            setSubmitError(
                'Please login to submit an application.'
            )

            return
        }

        const propertyId =
            land?._id || land?.id

        if (!propertyId) {
            setSubmitError(
                'Property information is unavailable. Please reload the page and try again.'
            )

            return
        }

        const missing = [
            'fullName',
            'email',
            'phone'
        ].filter(
            field =>
                !formData[field]?.trim()
        )

        if (missing.length > 0) {
            setSubmitError(
                `Please fill in: ${missing.join(', ')}`
            )

            return
        }

        const supportedCountry =
            ALL_COUNTRIES.find(
                item =>
                    item.code ===
                    manualCountryCode
            )

        if (!supportedCountry) {
            setSubmitError(
                'Please select a valid country calling code.'
            )

            return
        }

        if (
            manualCountryCode !==
                '+1' &&
            manualCountryCode !==
                country.code
        ) {
            setSubmitError(
                'Please select a valid country calling code.'
            )

            return
        }

        const fullPhone =
            buildInternationalPhone(
                formData.phone,
                country.code
            )

        if (
            !validatePhone(
                formData.phone,
                country.code
            )
        ) {
            setSubmitError(
                `Please enter a valid ${country.name} phone number (${country.minDigits}-${country.maxDigits} digits)`
            )

            return
        }

        if (phoneError) {
            setSubmitError(
                phoneError
            )

            return
        }

        if (!fullPhone) {
            setSubmitError(
                'Please enter a valid phone number.'
            )

            return
        }

        if (
            !formData.declarationAgreed
        ) {
            setSubmitError(
                'You must agree to the declaration.'
            )

            return
        }

        if (!paymentType) {
            setSubmitError(
                'Please select a payment method.'
            )

            return
        }

        if (
            paymentType ===
                'installment' &&
            !isInstallmentActive
        ) {
            setSubmitError(
                'Installment payment is not available for this property.'
            )

            return
        }

        if (
            paymentType ===
                'installment' &&
            !selectedOption
        ) {
            setSubmitError(
                'Please select a valid installment duration.'
            )

            return
        }

        setIsProcessing(true)

        try {
            const payload = {
                propertyId,

                fullName:
                    formData.fullName.trim(),

                dateOfBirth:
                    formData.dateOfBirth ||
                    undefined,

                gender:
                    formData.gender ||
                    undefined,

                maritalStatus:
                    formData.maritalStatus?.trim() ||
                    undefined,

                email:
                    formData.email
                        .trim()
                        .toLowerCase(),

                phone: fullPhone,

                phoneCountryCode:
                    country.code,

                phoneNormalized:
                    fullPhone,

                address:
                    formData.residentialAddress?.trim() ||
                    '',

                idNumber:
                    formData.idNumber?.trim() ||
                    '',

                idType:
                    'national_id',

                occupation:
                    formData.occupation?.trim() ||
                    '',

                paymentMode:
                    paymentType === 'full'
                        ? 'full'
                        : 'installment',

                installmentMonths:
                    paymentType ===
                    'installment'
                        ? Number(
                              formData.selectedMonths
                          )
                        : null,

                nextOfKin: {
                    fullName:
                        formData.kinName?.trim() ||
                        '',

                    relationship:
                        formData.kinRelationship?.trim() ||
                        '',

                    phone:
                        formData.kinPhone?.trim() ||
                        '',

                    phoneCountryCode:
                        '',

                    email:
                        formData.kinEmail
                            ?.trim()
                            .toLowerCase() ||
                        '',

                    address:
                        formData.kinAddress?.trim() ||
                        ''
                },

                realtor: {
                    name:
                        formData.realtorName?.trim() ||
                        '',

                    phone:
                        formData.realtorPhone?.trim() ||
                        '',

                    email:
                        formData.realtorEmail
                            ?.trim()
                            .toLowerCase() ||
                        ''
                },

                referralSource:
                    formData.realtorGroup?.trim() ||
                    '',

                documents:
                    file
                        ? [file.name]
                        : []
            }

            const response =
                await applicationsAPI.create(
                    payload
                )

            const application =
                response?.data?.application ||
                response?.application ||
                null

            const applicationId =
                application?.id ||
                application?._id ||
                response?.data
                    ?.applicationId ||
                response?.applicationId ||
                null

            if (applicationId) {
                setIsSuccess(true)

                window.setTimeout(() => {
                    router.push(
                        '/dashboard'
                    )
                }, 2500)

                return
            }

            setSubmitError(
                response?.message ||
                    response?.data?.message ||
                    'Application submission failed. Please try again.'
            )
        } catch (err) {
            setSubmitError(
                err?.message ||
                    'Failed to submit application. Please try again.'
            )
        } finally {
            setIsProcessing(false)
        }
    }

    // ─── Loading ────────────────────────────────────────────────────────────

    if (loading || authLoading) {
        return (
            <Shell>
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-4" />

                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                            Loading...
                        </p>
                    </div>
                </div>
            </Shell>
        )
    }

    // ─── Error ──────────────────────────────────────────────────────────────

    if (error || !land) {
        return (
            <Shell>
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <p className="text-4xl mb-4">
                            ⚠️
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-3">
                            Something Went Wrong
                        </h2>

                        <p className="text-slate-500 mb-6">
                            {error ||
                                'Property not found'}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/properties/${id}`
                                )
                            }
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />

                            Go Back to Property
                        </button>
                    </div>
                </div>
            </Shell>
        )
    }

    // ─── Payment selection ──────────────────────────────────────────────────

    if (!paymentType) {
        return (
            <Shell>
                <main className="flex-1 flex items-center justify-center px-6 py-24">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-16 max-w-lg w-full shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] text-center"
                    >
                        <img
                            src="/logo.png"
                            alt="Heaven Ark Properties"
                            className="h-14 w-auto object-contain mx-auto mb-7"
                        />

                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-8 h-8 text-emerald-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Select Payment Method
                        </h2>

                        <p className="text-slate-500 text-sm mb-4">
                            {land?.title}
                        </p>

                        <p className="text-3xl font-bold text-emerald-600 mb-8">
                            {formatCurrency(
                                totalPrice
                            )}
                        </p>

                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setPaymentType(
                                        'full'
                                    )
                                }
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl p-6 transition-all group"
                            >
                                <Wallet className="w-8 h-8 mx-auto text-emerald-400 group-hover:text-white mb-3" />

                                <h3 className="text-lg font-bold uppercase">
                                    Full Payment
                                </h3>

                                <p className="text-xs text-slate-400 group-hover:text-white/80">
                                    Pay complete amount
                                </p>

                                <p className="text-xl font-bold text-emerald-400 group-hover:text-white mt-2">
                                    {formatCurrency(
                                        totalPrice
                                    )}
                                </p>
                            </button>

                            {isInstallmentActive ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            !formData.selectedMonths &&
                                            installmentOptions.length
                                        ) {
                                            setFormData(
                                                previous => ({
                                                    ...previous,
                                                    selectedMonths:
                                                        Number(
                                                            installmentOptions[0]
                                                                .months
                                                        )
                                                })
                                            )
                                        }

                                        setPaymentType(
                                            'installment'
                                        )
                                    }}
                                    className="w-full bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-6 transition-all group"
                                >
                                    <CreditCard className="w-8 h-8 mx-auto text-slate-400 group-hover:text-emerald-500 mb-3" />

                                    <h3 className="text-lg font-bold uppercase text-slate-900">
                                        Installment
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Pay deposit + monthly
                                    </p>

                                    <p className="text-sm text-emerald-600 mt-2">
                                        {
                                            installmentOptions.length
                                        }{' '}
                                        plan
                                        {installmentOptions.length !==
                                        1
                                            ? 's'
                                            : ''}{' '}
                                        available
                                    </p>
                                </button>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-500 text-sm">
                                    Installment payment is
                                    not available for this
                                    property
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/properties/${id}`
                                )
                            }
                            className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors mt-6"
                        >
                            ← Cancel and go back
                        </button>
                    </motion.div>
                </main>
            </Shell>
        )
    }

    // ─── Success ────────────────────────────────────────────────────────────

    if (isSuccess) {
        return (
            <Shell>
                <main className="flex-1 flex items-center justify-center px-6 py-24">
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        className="text-center"
                    >
                        <img
                            src="/logo.png"
                            alt="Heaven Ark Properties"
                            className="h-14 w-auto object-contain mx-auto mb-8"
                        />

                        <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>

                        <h3 className="text-3xl font-bold text-slate-900 mb-2">
                            Application Submitted!
                        </h3>

                        <p className="text-slate-500">
                            Your application has been
                            received. Redirecting to
                            dashboard...
                        </p>
                    </motion.div>
                </main>
            </Shell>
        )
    }

    // ─── Main application form ─────────────────────────────────────────────

    return (
        <Shell>
            <main className="flex-1 py-12 md:py-20 px-4 md:px-6 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-[3.5rem] border border-slate-100 p-6 md:p-12 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.08)]">

                    {/* HEAVEN ARK BRANDING */}

                    <div className="flex flex-col items-center text-center mb-10 pb-8 border-b border-slate-100">
                        <img
                            src="/logo.png"
                            alt="Heaven Ark Properties"
                            className="h-16 md:h-20 w-auto object-contain mb-5"
                        />

                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">
                            Heaven Ark Properties
                        </p>

                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Property Application Form
                        </h1>

                        <p className="text-slate-500 text-sm mt-2 max-w-xl">
                            Complete the form below to
                            submit your application for
                            this property.
                        </p>

                        <p className="text-slate-900 font-semibold text-sm mt-3">
                            {land?.title}
                        </p>
                    </div>

                    {/* APPLICATION SUMMARY */}

                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                        <div>
                            <button
                                type="button"
                                onClick={() =>
                                    setPaymentType(
                                        null
                                    )
                                }
                                className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3 h-3" />

                                Change Payment
                            </button>

                            <p className="text-slate-500 text-sm">
                                Review your selected
                                payment arrangement
                                below.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    paymentType ===
                                    'full'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                }`}
                            >
                                {paymentType ===
                                'full'
                                    ? 'Full Payment'
                                    : `Installment (${formData.selectedMonths} months)`}
                            </span>

                            <div className="text-right hidden sm:block">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                    Application Date
                                </p>

                                <p className="text-xs font-bold text-slate-700">
                                    {formattedDate}
                                </p>
                            </div>

                            <div
                                role="button"
                                tabIndex={0}
                                aria-label="Upload passport photo"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                onKeyDown={event => {
                                    if (
                                        event.key ===
                                            'Enter' ||
                                        event.key ===
                                            ' '
                                    ) {
                                        event.preventDefault()

                                        fileInputRef.current?.click()
                                    }
                                }}
                                className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer group transition-all overflow-hidden"
                            >
                                {imagePreview ? (
                                    <img
                                        src={
                                            imagePreview
                                        }
                                        className="w-full h-full object-cover"
                                        alt="Passport preview"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <UserCircle className="w-6 h-6 text-slate-400 mx-auto group-hover:text-emerald-600" />

                                        <span className="text-[8px] font-bold text-slate-400 group-hover:text-emerald-600 block mt-0.5">
                                            Photo
                                        </span>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={
                                    handleFileChange
                                }
                                accept="image/jpeg,image/png"
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* ERROR */}

                    {submitError && (
                        <div
                            role="alert"
                            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                            <span>
                                ⚠️
                            </span>

                            {submitError}
                        </div>
                    )}

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >

                        {/* PERSONAL INFORMATION */}

                        <Section
                            title="Personal Information"
                            icon={User}
                            iconColor="text-emerald-600"
                        >
                            <TextField
                                label="Full Name"
                                className="md:col-span-2"
                                value={
                                    formData.fullName
                                }
                                onChange={event =>
                                    updateField(
                                        'fullName',
                                        event.target.value
                                    )
                                }
                                required
                                placeholder="Your full name"
                            />

                            <TextField
                                label="Date of Birth"
                                type="date"
                                value={
                                    formData.dateOfBirth
                                }
                                onChange={event =>
                                    updateField(
                                        'dateOfBirth',
                                        event.target.value
                                    )
                                }
                            />

                            <Field label="Gender">
                                <div className="flex gap-6 items-center h-[50px]">
                                    {[
                                        'Male',
                                        'Female'
                                    ].map(
                                        gender => (
                                            <label
                                                key={
                                                    gender
                                                }
                                                className="flex items-center gap-2 cursor-pointer text-sm text-slate-700"
                                            >
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={
                                                        gender
                                                    }
                                                    checked={
                                                        formData.gender ===
                                                        gender
                                                    }
                                                    onChange={event =>
                                                        updateField(
                                                            'gender',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className="accent-emerald-600 w-4 h-4"
                                                />

                                                <span>
                                                    {
                                                        gender
                                                    }
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </Field>

                            {/* PHONE */}

                            <div className="md:col-span-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                    Phone Number
                                </label>

                                <div className="flex flex-wrap gap-2">
                                    <div
                                        className="relative flex-shrink-0"
                                        data-country-selector
                                    >
                                        <div className="flex">
                                            <button
                                                type="button"
                                                aria-label="Select country"
                                                aria-expanded={
                                                    showCountryDropdown
                                                }
                                                onClick={() =>
                                                    setShowCountryDropdown(
                                                        previous =>
                                                            !previous
                                                    )
                                                }
                                                className="bg-slate-50 border border-slate-200 rounded-l-xl px-3 py-3 text-slate-700 font-medium hover:bg-slate-100 transition-all flex items-center gap-1"
                                            >
                                                <span>
                                                    {
                                                        country.flag
                                                    }
                                                </span>

                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </button>

                                            <input
                                                type="text"
                                                aria-label="Country calling code"
                                                value={
                                                    manualCountryCode
                                                }
                                                onChange={
                                                    handleManualCountryCodeChange
                                                }
                                                className="bg-slate-50 border border-slate-200 border-l-0 rounded-r-xl px-2 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all w-20 text-sm font-mono"
                                                placeholder="+234"
                                            />
                                        </div>

                                        {showCountryDropdown && (
                                            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto w-64">
                                                {ALL_COUNTRIES.map(
                                                    item => (
                                                        <button
                                                            key={
                                                                item.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleCountrySelect(
                                                                    item.id
                                                                )
                                                            }
                                                            className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm flex items-center gap-3 ${
                                                                selectedCountryId ===
                                                                item.id
                                                                    ? 'bg-emerald-50 text-emerald-700'
                                                                    : 'text-slate-700'
                                                            }`}
                                                        >
                                                            <span>
                                                                {
                                                                    item.flag
                                                                }
                                                            </span>

                                                            <span>
                                                                {
                                                                    item.name
                                                                }
                                                            </span>

                                                            <span className="text-slate-400 text-xs font-mono ml-auto">
                                                                {
                                                                    item.code
                                                                }
                                                            </span>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex-1 min-w-[200px]">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                        <input
                                            type="tel"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handlePhoneChange
                                            }
                                            onBlur={
                                                handlePhoneBlur
                                            }
                                            required
                                            className={phoneInputCls(
                                                phoneError
                                            )}
                                            placeholder={
                                                country.example
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                    <p className="text-[10px] text-slate-400">
                                        Example:{' '}
                                        {
                                            country.example
                                        }
                                    </p>

                                    <p className="text-[10px] text-slate-400">
                                        {
                                            country.minDigits
                                        }
                                        -
                                        {
                                            country.maxDigits
                                        }{' '}
                                        digits
                                    </p>

                                    {phoneError && (
                                        <p className="text-[10px] text-red-500 font-medium">
                                            {
                                                phoneError
                                            }
                                        </p>
                                    )}

                                    <p className="text-[10px] text-slate-400">
                                        {
                                            country.name
                                        }
                                    </p>
                                </div>
                            </div>

                            <TextField
                                label="Marital Status"
                                value={
                                    formData.maritalStatus
                                }
                                onChange={event =>
                                    updateField(
                                        'maritalStatus',
                                        event.target.value
                                    )
                                }
                                placeholder="Single / Married / Separated"
                            />

                            <Field
                                label="Residential Address"
                                className="md:col-span-2"
                            >
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                                    <textarea
                                        rows={2}
                                        value={
                                            formData.residentialAddress
                                        }
                                        onChange={event =>
                                            updateField(
                                                'residentialAddress',
                                                event.target.value
                                            )
                                        }
                                        className={`${inputCls} pl-10 resize-none`}
                                        placeholder="Your street address"
                                    />
                                </div>
                            </Field>

                            <TextField
                                label="ID Number"
                                value={
                                    formData.idNumber
                                }
                                onChange={event =>
                                    updateField(
                                        'idNumber',
                                        event.target.value
                                    )
                                }
                                placeholder="NIN / Passport / Driver's License"
                            />

                            <TextField
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                value={
                                    formData.email
                                }
                                required
                                onChange={event =>
                                    updateField(
                                        'email',
                                        event.target.value
                                    )
                                }
                                placeholder="your@email.com"
                            />

                            <TextField
                                label="Occupation"
                                icon={Briefcase}
                                value={
                                    formData.occupation
                                }
                                onChange={event =>
                                    updateField(
                                        'occupation',
                                        event.target.value
                                    )
                                }
                                placeholder="Your profession"
                            />
                        </Section>

                        {/* INSTALLMENT */}

                        {paymentType ===
                            'installment' && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-emerald-600" />

                                    Financing Plan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Field label="Initial Deposit">
                                        <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 font-bold text-lg">
                                            {formatCurrency(
                                                landDeposit
                                            )}
                                        </div>
                                    </Field>

                                    <Field label="Monthly Payment">
                                        <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 font-bold text-lg">
                                            {selectedOption
                                                ? formatCurrency(
                                                      selectedOption.monthlyAmount
                                                  )
                                                : '—'}
                                        </div>
                                    </Field>

                                    <Field label="Duration">
                                        <select
                                            value={
                                                formData.selectedMonths ||
                                                ''
                                            }
                                            onChange={event =>
                                                updateField(
                                                    'selectedMonths',
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                        >
                                            {installmentOptions.map(
                                                option => (
                                                    <option
                                                        key={
                                                            option.months
                                                        }
                                                        value={
                                                            option.months
                                                        }
                                                    >
                                                        {
                                                            option.months
                                                        }{' '}
                                                        month
                                                        {Number(
                                                            option.months
                                                        ) !==
                                                        1
                                                            ? 's'
                                                            : ''}{' '}
                                                        —{' '}
                                                        {formatCurrency(
                                                            option.monthlyAmount
                                                        )}
                                                        /month
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Choose from
                                            the
                                            available
                                            plans
                                            configured
                                            for this
                                            property.
                                        </p>
                                    </Field>
                                </div>

                                <div className="mt-4 bg-white/70 border border-emerald-100 rounded-xl p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                Selected
                                                Plan
                                            </p>

                                            <p className="text-sm font-bold text-slate-900 mt-1">
                                                {selectedOption
                                                    ? `${selectedOption.months} months`
                                                    : 'No plan selected'}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                Monthly
                                                Payment
                                            </p>

                                            <p className="text-lg font-black text-emerald-600 mt-1">
                                                {selectedOption
                                                    ? formatCurrency(
                                                          selectedOption.monthlyAmount
                                                      )
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FULL PAYMENT */}

                        {paymentType ===
                            'full' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-blue-600" />

                                    Full Payment
                                </h3>

                                <p className="text-slate-500 text-sm">
                                    Complete amount
                                    to be paid at
                                    once.
                                </p>

                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    {formatCurrency(
                                        totalPrice
                                    )}
                                </p>
                            </div>
                        )}

                        {/* NEXT OF KIN */}

                        <Section
                            title="Next of Kin"
                            icon={Users}
                            iconColor="text-amber-600"
                        >
                            <TextField
                                label="Full Name"
                                value={
                                    formData.kinName
                                }
                                onChange={event =>
                                    updateField(
                                        'kinName',
                                        event.target.value
                                    )
                                }
                                placeholder="Next of kin name"
                            />

                            <TextField
                                label="Phone Number"
                                type="tel"
                                value={
                                    formData.kinPhone
                                }
                                onChange={event =>
                                    updateField(
                                        'kinPhone',
                                        event.target.value.replace(
                                            /[^0-9\s\-()+]/g,
                                            ''
                                        )
                                    )
                                }
                                placeholder="Kin phone number"
                            />

                            <TextField
                                label="Relationship"
                                value={
                                    formData.kinRelationship
                                }
                                onChange={event =>
                                    updateField(
                                        'kinRelationship',
                                        event.target.value
                                    )
                                }
                                placeholder="Spouse, Sibling, etc."
                            />

                            <TextField
                                label="Email"
                                type="email"
                                value={
                                    formData.kinEmail
                                }
                                onChange={event =>
                                    updateField(
                                        'kinEmail',
                                        event.target.value
                                    )
                                }
                                placeholder="Kin email address"
                            />

                            <TextField
                                label="Address"
                                className="md:col-span-2"
                                value={
                                    formData.kinAddress
                                }
                                onChange={event =>
                                    updateField(
                                        'kinAddress',
                                        event.target.value
                                    )
                                }
                                placeholder="Kin residential address"
                            />
                        </Section>

                        {/* REALTOR */}

                        <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-purple-600" />

                                Realtor / Consultant

                                <span className="text-sm font-normal text-slate-400">
                                    (Optional)
                                </span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Full Name">
                                    <input
                                        type="text"
                                        value={
                                            formData.realtorName
                                        }
                                        onChange={event =>
                                            updateField(
                                                'realtorName',
                                                event.target.value
                                            )
                                        }
                                        className={`${inputCls} bg-white`}
                                        placeholder="Consultant name"
                                    />
                                </Field>

                                <Field label="Phone Number">
                                    <input
                                        type="tel"
                                        value={
                                            formData.realtorPhone
                                        }
                                        onChange={event =>
                                            updateField(
                                                'realtorPhone',
                                                event.target.value.replace(
                                                    /[^0-9\s\-()+]/g,
                                                    ''
                                                )
                                            )
                                        }
                                        className={`${inputCls} bg-white`}
                                        placeholder="Consultant phone"
                                    />
                                </Field>

                                <Field label="Email">
                                    <input
                                        type="email"
                                        value={
                                            formData.realtorEmail
                                        }
                                        onChange={event =>
                                            updateField(
                                                'realtorEmail',
                                                event.target.value
                                            )
                                        }
                                        className={`${inputCls} bg-white`}
                                        placeholder="Consultant email"
                                    />
                                </Field>

                                <Field label="Agency">
                                    <input
                                        type="text"
                                        value={
                                            formData.realtorGroup
                                        }
                                        onChange={event =>
                                            updateField(
                                                'realtorGroup',
                                                event.target.value
                                            )
                                        }
                                        className={`${inputCls} bg-white`}
                                        placeholder="Affiliated agency"
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* DECLARATION */}

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-red-600" />

                                Declaration
                            </h3>

                            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input
                                    type="checkbox"
                                    required
                                    className="accent-emerald-600 w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer"
                                    checked={
                                        formData.declarationAgreed
                                    }
                                    onChange={event =>
                                        updateField(
                                            'declarationAgreed',
                                            event.target.checked
                                        )
                                    }
                                />

                                <span className="text-sm text-slate-600 leading-relaxed select-none">
                                    I confirm that
                                    the
                                    information
                                    supplied is
                                    authentic,
                                    accurate,
                                    and true.
                                </span>
                            </label>
                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />

                                    Processing...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>

                        <p className="text-center text-[10px] text-slate-400 mt-3">
                            By submitting, you agree
                            to our terms and
                            conditions
                        </p>
                    </form>
                </div>
            </main>
        </Shell>
    )
}