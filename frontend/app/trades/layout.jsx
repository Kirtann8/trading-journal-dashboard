'use client'

import DashboardLayout from '@/components/DashboardLayout'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Layout({ children }) {
    return (
        <ErrorBoundary>
            <DashboardLayout>{children}</DashboardLayout>
        </ErrorBoundary>
    )
}
