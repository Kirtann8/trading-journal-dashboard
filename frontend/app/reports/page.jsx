'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTrades } from '../../lib/api/trades'
import { getProfileStats } from '../../lib/api/profile'
import { formatCurrency, formatDate } from '../../lib/dashboard-utils'
import { DocumentArrowDownIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ReportsPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [trades, setTrades] = useState([])
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [statsResult, tradesResult] = await Promise.all([
                getProfileStats(),
                getTrades({ limit: 1000 }) // Get all trades
            ])

            if (statsResult.success) {
                setStats(statsResult.data)
            }

            if (tradesResult.success && tradesResult.data) {
                const tradesData = tradesResult.data.trades || tradesResult.data || []
                setTrades(Array.isArray(tradesData) ? tradesData : [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateCSV = () => {
        if (!trades.length) {
            alert('No trades to export')
            return
        }

        const headers = ['Symbol', 'Side', 'Entry Price', 'Exit Price', 'Quantity', 'P&L', 'Status', 'Date', 'Strategy', 'Notes']
        const rows = trades.map(trade => [
            trade.symbol,
            trade.side,
            trade.entryPrice,
            trade.exitPrice || '',
            trade.quantity,
            trade.profitLoss || 0,
            trade.status,
            formatDate(trade.date),
            trade.strategyTag || '',
            (trade.notes || '').replace(/,/g, ';') // Replace commas to avoid CSV issues
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `trading-journal-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const generatePDF = () => {
        if (!trades.length) {
            alert('No trades to export')
            return
        }

        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.width
        const pageHeight = doc.internal.pageSize.height

        // Title
        doc.setFontSize(22)
        doc.setTextColor(37, 99, 235) // Primary blue color
        doc.text('Trading Journal Report', pageWidth / 2, 20, { align: 'center' })

        // Date
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on ${formatDate(new Date())}`, pageWidth / 2, 28, { align: 'center' })

        // Summary Statistics
        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text('Performance Summary', 14, 40)

        const closedTrades = trades.filter(t => t.status === 'closed')
        const winningTrades = closedTrades.filter(t => (t.profitLoss || 0) > 0)
        const losingTrades = closedTrades.filter(t => (t.profitLoss || 0) < 0)
        const totalPnL = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
        const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0
        const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / winningTrades.length : 0
        const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / losingTrades.length : 0

        // Statistics table
        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Value']],
            body: [
                ['Total Trades', trades.length.toString()],
                ['Closed Trades', closedTrades.length.toString()],
                ['Open Trades', trades.filter(t => t.status === 'open').length.toString()],
                ['Win Rate', `${winRate.toFixed(2)}%`],
                ['Total P&L', formatCurrency(totalPnL)],
                ['Winning Trades', winningTrades.length.toString()],
                ['Losing Trades', losingTrades.length.toString()],
                ['Average Win', formatCurrency(avgWin)],
                ['Average Loss', formatCurrency(avgLoss)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
            margin: { left: 14, right: 14 },
        })

        // Trades Table
        doc.setFontSize(16)
        doc.text('Trade History', 14, doc.lastAutoTable.finalY + 15)

        const tradesData = trades.map(trade => [
            trade.symbol,
            trade.side.toUpperCase(),
            formatCurrency(trade.entryPrice),
            trade.exitPrice ? formatCurrency(trade.exitPrice) : '-',
            trade.quantity.toString(),
            formatCurrency(trade.profitLoss || 0),
            trade.status.charAt(0).toUpperCase() + trade.status.slice(1),
            formatDate(trade.date)
        ])

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Symbol', 'Side', 'Entry', 'Exit', 'Qty', 'P&L', 'Status', 'Date']],
            body: tradesData,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 8 },
            columnStyles: {
                5: { 
                    textColor: (rowData) => {
                        const value = parseFloat(rowData.replace(/[^0-9.-]/g, ''))
                        return value >= 0 ? [34, 197, 94] : [239, 68, 68]
                    }
                }
            }
        })

        // Footer
        const totalPages = doc.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setTextColor(150)
            doc.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            )
        }

        // Save the PDF
        doc.save(`trading-journal-report-${new Date().toISOString().split('T')[0]}.pdf`)
    }

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-32 bg-secondary/50 rounded-xl"></div>
                <div className="h-64 bg-secondary/50 rounded-xl"></div>
            </div>
        )
    }

    const closedTrades = trades.filter(t => t.status === 'closed')
    const winningTrades = closedTrades.filter(t => (t.profitLoss || 0) > 0)
    const losingTrades = closedTrades.filter(t => (t.profitLoss || 0) < 0)
    const totalPnL = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Trading Reports</h1>
                <p className="mt-2 text-muted-foreground">
                    Generate and export your trading performance reports
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Trades</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{trades.length}</p>
                        </div>
                        <ChartBarIcon className="h-8 w-8 text-primary" />
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{winRate.toFixed(1)}%</p>
                        </div>
                        <ChartBarIcon className="h-8 w-8 text-success" />
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total P&L</p>
                            <p className={`text-2xl font-bold mt-1 ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {formatCurrency(totalPnL)}
                            </p>
                        </div>
                        <ChartBarIcon className="h-8 w-8 text-primary" />
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Closed Trades</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{closedTrades.length}</p>
                        </div>
                        <ChartBarIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <div className="glass-card rounded-xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Export Reports</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <DocumentArrowDownIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">CSV Export</h3>
                        <p className="text-muted-foreground mb-4">
                            Export all your trades to a CSV file for analysis in Excel or other tools.
                        </p>
                        <button
                            onClick={generateCSV}
                            className="btn-primary w-full"
                            disabled={!trades.length}
                        >
                            Download CSV
                        </button>
                    </div>

                    <div className="border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <DocumentArrowDownIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">PDF Report</h3>
                        <p className="text-muted-foreground mb-4">
                            Generate a comprehensive PDF report with charts and statistics.
                        </p>
                        <button
                            onClick={generatePDF}
                            className="btn-primary w-full"
                            disabled={!trades.length}
                        >
                            Generate PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance Breakdown */}
            <div className="glass-card rounded-xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Performance Breakdown</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Winning Trades</p>
                        <p className="text-3xl font-bold text-success">{winningTrades.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Avg: {formatCurrency(winningTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / (winningTrades.length || 1))}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Losing Trades</p>
                        <p className="text-3xl font-bold text-destructive">{losingTrades.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Avg: {formatCurrency(losingTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / (losingTrades.length || 1))}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Open Trades</p>
                        <p className="text-3xl font-bold text-primary">{trades.filter(t => t.status === 'open').length}</p>
                        <p className="text-sm text-muted-foreground mt-1">Currently active</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
