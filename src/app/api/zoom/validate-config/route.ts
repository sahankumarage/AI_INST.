import { NextResponse } from 'next/server';
import { getZoomAccessToken, generateZoomSignature, getZoomSdkKey } from '@/lib/zoom';
import axios from 'axios';

/**
 * Comprehensive validation of entire Zoom configuration
 *
 * Usage: GET http://localhost:3000/api/zoom/validate-config
 *
 * Tests:
 * 1. Environment variables present
 * 2. OAuth credentials work
 * 3. SDK credentials work
 * 4. Can access Zoom API
 * 5. Can generate signatures
 */
export async function GET() {
    const results: any = {
        timestamp: new Date().toISOString(),
        overallStatus: 'unknown',
        checks: [],
        summary: {},
        recommendations: []
    };

    let passedChecks = 0;
    let totalChecks = 0;

    // Helper to add check result
    const addCheck = (name: string, passed: boolean, message: string, details?: any) => {
        totalChecks++;
        if (passed) passedChecks++;

        results.checks.push({
            name,
            status: passed ? 'PASS' : 'FAIL',
            message,
            details
        });

        return passed;
    };

    console.log('=== ZOOM CONFIG VALIDATION ===');

    // CHECK 1: Environment Variables
    console.log('Checking environment variables...');
    const hasAccountId = !!process.env.ZOOM_ACCOUNT_ID;
    const hasClientId = !!process.env.ZOOM_CLIENT_ID;
    const hasClientSecret = !!process.env.ZOOM_CLIENT_SECRET;
    const hasSdkKey = !!process.env.ZOOM_SDK_KEY;
    const hasSdkSecret = !!process.env.ZOOM_SDK_SECRET;

    addCheck(
        'Environment Variables',
        hasAccountId && hasClientId && hasClientSecret && hasSdkKey && hasSdkSecret,
        hasAccountId && hasClientId && hasClientSecret && hasSdkKey && hasSdkSecret
            ? 'All 5 Zoom environment variables are set'
            : 'Missing Zoom environment variables',
        {
            ZOOM_ACCOUNT_ID: hasAccountId ? 'Set' : 'MISSING',
            ZOOM_CLIENT_ID: hasClientId ? 'Set' : 'MISSING',
            ZOOM_CLIENT_SECRET: hasClientSecret ? 'Set' : 'MISSING',
            ZOOM_SDK_KEY: hasSdkKey ? 'Set' : 'MISSING',
            ZOOM_SDK_SECRET: hasSdkSecret ? 'Set' : 'MISSING'
        }
    );

    if (!hasAccountId || !hasClientId || !hasClientSecret) {
        results.recommendations.push('Create .env.local file with Server-to-Server OAuth credentials');
    }

    if (!hasSdkKey || !hasSdkSecret) {
        results.recommendations.push('Add Meeting SDK credentials to .env.local');
    }

    // CHECK 2: OAuth Token Generation
    console.log('Testing OAuth token generation...');
    try {
        const token = await getZoomAccessToken();
        addCheck(
            'OAuth Token Generation',
            true,
            'Successfully obtained OAuth access token',
            {
                tokenPreview: token.substring(0, 20) + '...',
                tokenLength: token.length
            }
        );
    } catch (error: any) {
        addCheck(
            'OAuth Token Generation',
            false,
            `Failed to get OAuth token: ${error.message}`,
            { error: error.message }
        );
        results.recommendations.push('Verify Server-to-Server OAuth app is activated in Zoom Marketplace');
        results.recommendations.push('Check OAuth credentials match the app in Zoom Marketplace');
    }

    // CHECK 3: SDK Key Available
    console.log('Checking SDK key...');
    const sdkKey = getZoomSdkKey();
    addCheck(
        'SDK Key',
        !!sdkKey && sdkKey.length > 0,
        sdkKey ? 'SDK key is available' : 'SDK key is missing',
        sdkKey ? { sdkKeyPreview: sdkKey.substring(0, 10) + '...' } : undefined
    );

    // CHECK 4: Signature Generation
    console.log('Testing signature generation...');
    try {
        const testMeetingNumber = '87887878787';
        const signature = generateZoomSignature(testMeetingNumber, 0);
        addCheck(
            'Signature Generation',
            true,
            'Successfully generated JWT signature',
            {
                testMeetingNumber,
                signaturePreview: signature.substring(0, 50) + '...',
                signatureLength: signature.length
            }
        );
    } catch (error: any) {
        addCheck(
            'Signature Generation',
            false,
            `Failed to generate signature: ${error.message}`,
            { error: error.message }
        );
        results.recommendations.push('Verify ZOOM_SDK_SECRET is set correctly');
    }

    // CHECK 5: Zoom API Access
    console.log('Testing Zoom API access...');
    try {
        const token = await getZoomAccessToken();
        const response = await axios.get('https://api.zoom.us/v2/users/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        addCheck(
            'Zoom API Access',
            true,
            'Successfully accessed Zoom API',
            {
                accountEmail: response.data.email,
                accountType: response.data.type,
                accountId: response.data.id
            }
        );
    } catch (error: any) {
        const statusCode = error.response?.status;
        addCheck(
            'Zoom API Access',
            false,
            `Failed to access Zoom API: ${error.message}`,
            {
                statusCode,
                error: error.response?.data || error.message
            }
        );

        if (statusCode === 401) {
            results.recommendations.push('OAuth credentials are invalid - check they match your Zoom app');
        } else if (statusCode === 404) {
            results.recommendations.push('ZOOM_ACCOUNT_ID may be incorrect');
        }
    }

    // CHECK 6: Meeting Creation Permission
    console.log('Testing meeting creation permission...');
    try {
        const token = await getZoomAccessToken();
        // Just check if we can list meetings (lighter than creating one)
        await axios.get('https://api.zoom.us/v2/users/me/meetings?page_size=1', {
            headers: { Authorization: `Bearer ${token}` }
        });

        addCheck(
            'Meeting API Permissions',
            true,
            'Has permission to access meetings API',
            { scope: 'meeting:read confirmed' }
        );
    } catch (error: any) {
        const forbidden = error.response?.status === 403;
        addCheck(
            'Meeting API Permissions',
            false,
            forbidden
                ? 'Missing meeting API scopes'
                : `Error accessing meetings API: ${error.message}`,
            { error: error.response?.data || error.message }
        );

        if (forbidden) {
            results.recommendations.push('Add meeting:read:admin and meeting:write:admin scopes to OAuth app');
        }
    }

    // Calculate overall status
    const passRate = (passedChecks / totalChecks) * 100;
    results.overallStatus = passRate === 100 ? 'HEALTHY' : passRate >= 50 ? 'PARTIAL' : 'UNHEALTHY';
    results.summary = {
        totalChecks,
        passed: passedChecks,
        failed: totalChecks - passedChecks,
        passRate: `${passRate.toFixed(0)}%`
    };

    console.log('=== VALIDATION COMPLETE ===');
    console.log(`Status: ${results.overallStatus}`);
    console.log(`Passed: ${passedChecks}/${totalChecks}`);

    // Add general recommendations
    if (results.overallStatus !== 'HEALTHY') {
        results.recommendations.push('See ZOOM_DEBUG_REPORT.md for detailed troubleshooting steps');
        results.recommendations.push('Check both apps are activated in https://marketplace.zoom.us/develop/apps');
    }

    // Add next steps based on status
    if (results.overallStatus === 'HEALTHY') {
        results.nextSteps = [
            '✅ Configuration is valid!',
            '1. Create a test meeting: POST /api/zoom/create-meeting',
            '2. Seed database: POST /api/admin/seed-zoom-test',
            '3. Test end-to-end: Login as student and join class',
            '4. Check Zoom Marketplace apps for domain whitelist and browser join settings'
        ];
    } else {
        results.nextSteps = [
            '❌ Configuration needs fixing',
            '1. Review failed checks above',
            '2. Follow recommendations',
            '3. Run this validation again',
            '4. See QUICK_START_DEBUG.md for detailed steps'
        ];
    }

    return NextResponse.json(results, {
        status: results.overallStatus === 'HEALTHY' ? 200 : 500
    });
}
