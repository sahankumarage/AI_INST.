/**
 * Payment Utilities
 * Functions for calculating prices, generating references, and validating discounts
 */

import Course from '@/models/Course';
import PaymentTransaction from '@/models/PaymentTransaction';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface PromoCode {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
    expiresAt?: Date;
    maxUses?: number;
    usedCount: number;
}

export interface DiscountResult {
    isValid: boolean;
    discountType?: 'percentage' | 'fixed';
    discountAmount?: number;
    discountValue?: number; // Actual amount saved
    finalPrice: number;
    originalPrice: number;
    message: string;
}

export interface PaymentData {
    transactionRef: string;
    userId: string;
    courseId: string;
    courseSlug: string;
    courseName: string;
    originalPrice: number;
    finalPrice: number;
    currency: string;
    discountCode?: string;
    discountType?: 'percentage' | 'fixed';
    discountAmount?: number;
    discountValue?: number;
    productId: string;
}

// ============================================
// TRANSACTION REFERENCE GENERATOR
// ============================================

/**
 * Generates a unique transaction reference
 * Format: AI-{TIMESTAMP}-{COURSE_PREFIX}-{RANDOM}
 * Example: AI-1706452890-AIWD-X7K9
 */
export function generateTransactionRef(courseSlug: string): string {
    const timestamp = Date.now();
    const coursePrefix = courseSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 4);
    const random = generateRandomString(4);

    return `AI-${timestamp}-${coursePrefix}-${random}`;
}

/**
 * Generates a random alphanumeric string
 */
function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ============================================
// DISCOUNT CALCULATION
// ============================================

/**
 * Validates a promo code and calculates the discount
 */
export async function validateAndCalculateDiscount(
    courseSlug: string,
    promoCode: string | undefined,
    originalPrice: number
): Promise<DiscountResult> {
    // If no promo code provided
    if (!promoCode || promoCode.trim() === '') {
        return {
            isValid: true,
            finalPrice: originalPrice,
            originalPrice,
            message: 'No discount applied'
        };
    }

    try {
        // Fetch course to get promo codes
        const course = await Course.findOne({ slug: courseSlug });

        if (!course) {
            return {
                isValid: false,
                finalPrice: originalPrice,
                originalPrice,
                message: 'Course not found'
            };
        }

        // Find matching promo code (case-insensitive)
        const promo = course.promoCodes?.find(
            (p: PromoCode) => p.code?.toUpperCase() === promoCode.toUpperCase()
        );

        if (!promo) {
            return {
                isValid: false,
                finalPrice: originalPrice,
                originalPrice,
                message: 'Invalid promo code'
            };
        }

        // Check expiration
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
            return {
                isValid: false,
                finalPrice: originalPrice,
                originalPrice,
                message: 'Promo code has expired'
            };
        }

        // Check usage limit
        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            return {
                isValid: false,
                finalPrice: originalPrice,
                originalPrice,
                message: 'Promo code usage limit reached'
            };
        }

        // Calculate discount
        let discountValue = 0;
        let finalPrice = originalPrice;

        if (promo.discountType === 'percentage') {
            discountValue = Math.round((originalPrice * promo.discountAmount) / 100);
            finalPrice = originalPrice - discountValue;
        } else if (promo.discountType === 'fixed') {
            discountValue = promo.discountAmount;
            finalPrice = originalPrice - discountValue;
        }

        // Ensure price doesn't go negative
        if (finalPrice < 0) finalPrice = 0;

        return {
            isValid: true,
            discountType: promo.discountType,
            discountAmount: promo.discountAmount,
            discountValue,
            finalPrice,
            originalPrice,
            message: `Discount of ${promo.discountType === 'percentage' ? promo.discountAmount + '%' : 'LKR ' + promo.discountAmount} applied!`
        };

    } catch (error) {
        console.error('Discount validation error:', error);
        return {
            isValid: false,
            finalPrice: originalPrice,
            originalPrice,
            message: 'Error validating promo code'
        };
    }
}

// ============================================
// PAYMENT DATA BUILDER
// ============================================

/**
 * Builds complete payment data for Dodo initialization
 */
export async function buildPaymentData(
    userId: string,
    courseSlug: string,
    promoCode?: string
): Promise<{ success: boolean; data?: PaymentData; error?: string }> {
    try {
        // Fetch course details
        const course = await Course.findOne({ slug: courseSlug });

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        if (!course.productId) {
            return { success: false, error: 'Payment not configured for this course' };
        }

        const originalPrice = course.price;
        const currency = course.currency || 'LKR';

        // Validate and calculate discount
        const discountResult = await validateAndCalculateDiscount(
            courseSlug,
            promoCode,
            originalPrice
        );

        // Generate unique transaction reference
        const transactionRef = generateTransactionRef(courseSlug);

        // Build payment data
        const paymentData: PaymentData = {
            transactionRef,
            userId,
            courseId: course._id.toString(),
            courseSlug: course.slug,
            courseName: course.title,
            originalPrice,
            finalPrice: discountResult.finalPrice,
            currency,
            productId: course.productId,
            ...(discountResult.isValid && promoCode && {
                discountCode: promoCode.toUpperCase(),
                discountType: discountResult.discountType,
                discountAmount: discountResult.discountAmount,
                discountValue: discountResult.discountValue
            })
        };

        return { success: true, data: paymentData };

    } catch (error) {
        console.error('Build payment data error:', error);
        return { success: false, error: 'Failed to build payment data' };
    }
}

// ============================================
// PRICE CONVERSION
// ============================================

/**
 * Converts price to smallest unit (paisa/cents)
 */
export function toSmallestUnit(price: number): number {
    return Math.round(price * 100);
}

/**
 * Converts from smallest unit to standard currency
 */
export function fromSmallestUnit(price: number): number {
    return price / 100;
}

// ============================================
// PROMO CODE USAGE TRACKING
// ============================================

/**
 * Increments the usage count of a promo code
 */
export async function incrementPromoCodeUsage(
    courseSlug: string,
    promoCode: string
): Promise<boolean> {
    try {
        await Course.updateOne(
            {
                slug: courseSlug,
                'promoCodes.code': promoCode.toUpperCase()
            },
            {
                $inc: { 'promoCodes.$.usedCount': 1 }
            }
        );
        return true;
    } catch (error) {
        console.error('Failed to increment promo usage:', error);
        return false;
    }
}

// ============================================
// FORMAT HELPERS
// ============================================

/**
 * Formats price for display
 */
export function formatPrice(price: number, currency: string = 'LKR'): string {
    if (currency === 'USD') {
        return `$${price.toLocaleString()}`;
    }
    return `LKR ${price.toLocaleString()}`;
}

/**
 * Gets display name for payment (includes discount indicator)
 */
export function getPaymentDisplayName(
    courseName: string,
    hasDiscount: boolean
): string {
    return hasDiscount ? `${courseName} (Discounted)` : courseName;
}
