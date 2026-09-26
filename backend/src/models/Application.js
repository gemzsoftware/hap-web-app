import mongoose from 'mongoose';

const APPLICATION_STATUSES = [
    'pending_review',
    'under_review',
    'approved',
    'rejected',
    'withdrawn'
];

const PAYMENT_MODES = [
    'full',
    'installment'
];

const ID_TYPES = [
    'national_id',
    'passport',
    'drivers_license',
    'other'
];

const ApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true
        },

        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property ID is required'],
            index: true
        },

        /*
         * Explicit relationship to the purchase created for this
         * application.
         *
         * This replaces the need to repeatedly find a purchase only by
         * userId + propertyId.
         *
         * It is optional for backwards compatibility with applications
         * created before this field was introduced.
         */
        purchaseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Purchase',
            default: null,
        },

        propertyTitle: {
            type: String,
            required: [true, 'Property title is required'],
            trim: true
        },

        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },

        phoneCountryCode: {
            type: String,
            default: '+234',
            trim: true
        },

        phoneNormalized: {
            type: String,
            trim: true,
            default: ''
        },

        address: {
            type: String,
            trim: true,
            default: ''
        },

        idNumber: {
            type: String,
            trim: true,
            default: ''
        },

        idType: {
            type: String,
            enum: ID_TYPES,
            default: 'national_id'
        },

        occupation: {
            type: String,
            trim: true,
            default: ''
        },

        /*
         * Optional personal-information fields.
         *
         * These are kept optional so existing applications and existing
         * frontend submissions do not break.
         */
        dateOfBirth: {
            type: Date,
            default: null
        },

        gender: {
            type: String,
            trim: true,
            default: ''
        },

        maritalStatus: {
            type: String,
            trim: true,
            default: ''
        },

        paymentMode: {
            type: String,
            enum: PAYMENT_MODES,
            required: [true, 'Payment mode is required']
        },

        /*
         * Required logically when paymentMode is installment, but kept
         * optional at schema level so route-level validation can provide
         * the appropriate business-specific error message.
         */
        installmentMonths: {
            type: Number,
            min: [1, 'Installment months must be at least 1'],
            default: null
        },

        nextOfKin: {
            fullName: {
                type: String,
                trim: true,
                default: ''
            },

            relationship: {
                type: String,
                trim: true,
                default: ''
            },

            phone: {
                type: String,
                trim: true,
                default: ''
            },

            phoneCountryCode: {
                type: String,
                trim: true,
                default: ''
            },

            email: {
                type: String,
                trim: true,
                lowercase: true,
                default: ''
            },

            address: {
                type: String,
                trim: true,
                default: ''
            }
        },

        realtor: {
            name: {
                type: String,
                trim: true,
                default: ''
            },

            phone: {
                type: String,
                trim: true,
                default: ''
            },

            email: {
                type: String,
                trim: true,
                lowercase: true,
                default: ''
            }
        },

        referralSource: {
            type: String,
            trim: true,
            default: ''
        },

        additionalInfo: {
            type: String,
            trim: true,
            default: ''
        },

        documents: [
            {
                type: String,
                trim: true
            }
        ],

        status: {
            type: String,
            enum: APPLICATION_STATUSES,
            default: 'pending_review',
            index: true
        },

        adminNotes: {
            type: String,
            trim: true,
            default: ''
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        reviewedAt: {
            type: Date
        },

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

/*
 * Application lookup indexes.
 */
ApplicationSchema.index({
    userId: 1,
    submittedAt: -1
});

ApplicationSchema.index({
    propertyId: 1,
    status: 1
});

ApplicationSchema.index({
    status: 1,
    submittedAt: -1
});

ApplicationSchema.index({
    email: 1
});

ApplicationSchema.index({
    phoneNormalized: 1
});

ApplicationSchema.index({
    purchaseId: 1
});

/*
 * Age of the application in days.
 */
ApplicationSchema.virtual('age').get(function () {
    return Math.max(
        Math.floor(
            (Date.now() - this.submittedAt) /
            (1000 * 60 * 60 * 24)
        ),
        0
    );
});

ApplicationSchema.virtual('isPending').get(function () {
    return this.status === 'pending_review';
});

ApplicationSchema.virtual('isUnderReview').get(function () {
    return this.status === 'under_review';
});

ApplicationSchema.virtual('isApproved').get(function () {
    return this.status === 'approved';
});

ApplicationSchema.virtual('isRejected').get(function () {
    return this.status === 'rejected';
});

ApplicationSchema.virtual('isWithdrawn').get(function () {
    return this.status === 'withdrawn';
});

/*
 * Normalize phone numbers before saving.
 *
 * Nigerian local numbers such as:
 *
 *   08012345678
 *
 * become:
 *
 *   +2348012345678
 *
 * Numbers already written internationally are preserved.
 */
ApplicationSchema.pre('save', function (next) {
    if (this.propertyId && !this.propertyTitle) {
        this.propertyTitle = 'Property';
    }

    if (this.phone) {
        const cleaned = this.phone.replace(
            /[\s\-\(\)]/g,
            ''
        );

        if (cleaned.startsWith('+')) {
            const match = cleaned.match(/^(\+\d{1,4})/);

            if (match) {
                this.phoneCountryCode = match[1];
            }

            this.phoneNormalized = cleaned;
        } else if (
            /^0\d{10}$/.test(cleaned)
        ) {
            /*
             * Nigeria's standard local mobile format:
             * 080XXXXXXXX
             */
            this.phoneCountryCode = '+234';

            this.phoneNormalized =
                `+234${cleaned.slice(1)}`;
        } else if (
            /^234\d{10}$/.test(cleaned)
        ) {
            this.phoneCountryCode = '+234';

            this.phoneNormalized =
                `+${cleaned}`;
        } else {
            /*
             * Preserve an unknown format rather than silently changing
             * the user's number. Route-level validation can reject it
             * when strict validation is required.
             */
            this.phoneNormalized = cleaned;
        }
    }

    /*
     * Keep installment applications internally consistent.
     */
    if (
        this.paymentMode === 'full' &&
        this.installmentMonths !== null &&
        this.installmentMonths !== undefined
    ) {
        this.installmentMonths = null;
    }

    next();
});

/*
 * Central application lifecycle rules.
 *
 * Application status changes should use this method rather than assigning
 * arbitrary status values directly.
 */
ApplicationSchema.methods.transitionStatus = function (
    newStatus,
    reviewerId = null
) {
    if (!APPLICATION_STATUSES.includes(newStatus)) {
        throw new Error(
            `Invalid application status: ${newStatus}`
        );
    }

    /*
     * Re-applying the same status is harmless.
     */
    if (this.status === newStatus) {
        if (reviewerId) {
            this.reviewedBy = reviewerId;
            this.reviewedAt =
                this.reviewedAt || new Date();
        }

        return this;
    }

    const validTransitions = {
        pending_review: [
            'under_review',
            'approved',
            'rejected',
            'withdrawn'
        ],

        under_review: [
            'approved',
            'rejected',
            'withdrawn'
        ],

        approved: [],

        rejected: [],

        withdrawn: []
    };

    const allowedTransitions =
        validTransitions[this.status] || [];

    if (!allowedTransitions.includes(newStatus)) {
        throw new Error(
            `Invalid status transition from ${this.status} to ${newStatus}`
        );
    }

    /*
     * A customer can only withdraw an application while it is still
     * being processed.
     */
    if (
        newStatus === 'withdrawn' &&
        ![
            'pending_review',
            'under_review'
        ].includes(this.status)
    ) {
        throw new Error(
            'Only pending or under-review applications can be withdrawn'
        );
    }

    this.status = newStatus;

    /*
     * Every administrative review decision records who made it and when.
     */
    if (
        reviewerId &&
        [
            'under_review',
            'approved',
            'rejected'
        ].includes(newStatus)
    ) {
        this.reviewedBy = reviewerId;
        this.reviewedAt = new Date();
    }

    return this;
};

/*
 * Determines whether the applicant is still allowed to modify or withdraw
 * the application.
 */
ApplicationSchema.methods.canModify = function () {
    return [
        'pending_review',
        'under_review'
    ].includes(this.status);
};

/*
 * Determines whether the application represents a completed approval.
 */
ApplicationSchema.methods.isApprovedApplication =
    function () {
        return this.status === 'approved';
    };

/*
 * Returns application statistics grouped by status.
 */
ApplicationSchema.statics.getStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const result = {
        total: 0,
        pending_review: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        withdrawn: 0
    };

    stats.forEach(stat => {
        if (
            Object.prototype.hasOwnProperty.call(
                result,
                stat._id
            )
        ) {
            result[stat._id] = stat.count;
        }

        result.total += stat.count;
    });

    return result;
};

export { APPLICATION_STATUSES };

export const Application =
    mongoose.model(
        'Application',
        ApplicationSchema
    );