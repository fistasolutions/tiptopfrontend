"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftFromLine, Plus, MoreHorizontal } from 'lucide-react';
import { Message, ChatSession, SIDEBAR_WIDTH } from './types';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useSelector } from 'react-redux';
import type { IRootState } from "@/store";
import InvoiceTable from './InvoiceTable';
import InvoiceCreateForm from './InvoiceCreateForm';
import InvoicePreview from './InvoicePreview';
import ExpenseEntryForm from './ExpenseEntryForm';
import SequenceFollowUpForm from './SequenceFollowUpForm';
import ProductKnowledgeOverview from './ProductKnowledgeOverview';
import SalesSummary from './SalesSummary';
import BalanceSheetReport from './BalanceSheetReport';
import ProfitLossSummary from './ProfitLossSummary';
import CashFlowForecast from './CashFlowForecast';
import WeeklySalesTrends from './WeeklySalesTrends';
import TopExpenseCategories from './TopExpenseCategories';
import UploadReceiptForm from './UploadReceiptForm';
import ManageDocumentForm from './ManageDocumentForm';
import BackupFilesForm from './BackupFilesForm';
import DocumentScannerForm from './DocumentScannerForm';
import AskFinancialQuestionForm from './AskFinancialQuestionForm';
import PredictTrendsForm from './PredictTrendsForm';
import RiskAnalysisForm from './RiskAnalysisForm';
import SmartRecommendationsForm from './SmartRecommendationsForm';

function generateTitle(messages: Message[]): string {
    const firstUserMsg = messages.find(m => m.role === 'user');
    return firstUserMsg
        ? firstUserMsg.content.slice(0, 20) + (firstUserMsg.content.length > 20 ? '...' : '')
        : 'New Chat';
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const [showInvoiceTable, setShowInvoiceTable] = useState(false);
    const [showInvoiceCreateForm, setShowInvoiceCreateForm] = useState(false);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [showExpenseEntryForm, setShowExpenseEntryForm] = useState(false);
    const [showSequenceFollowUpForm, setShowSequenceFollowUpForm] = useState(false);
    const [showProductKnowledgeOverview, setShowProductKnowledgeOverview] = useState(false);
    const [showSalesSummary, setShowSalesSummary] = useState(false);
    const [showBalanceSheetReport, setShowBalanceSheetReport] = useState(false);
    const [showProfitLossSummary, setShowProfitLossSummary] = useState(false);
    const [showCashFlowForecast, setShowCashFlowForecast] = useState(false);
    const [showWeeklySalesTrends, setShowWeeklySalesTrends] = useState(false);
    const [showTopExpenseCategories, setShowTopExpenseCategories] = useState(false);
    const [showUploadReceiptForm, setShowUploadReceiptForm] = useState(false);
    const [showManageDocumentForm, setShowManageDocumentForm] = useState(false);
    const [showBackupFilesForm, setShowBackupFilesForm] = useState(false);
    const [showDocumentScannerForm, setShowDocumentScannerForm] = useState(false);
    const [showAskFinancialQuestionForm, setShowAskFinancialQuestionForm] = useState(false);
    const [showPredictTrendsForm, setShowPredictTrendsForm] = useState(false);
    const [showRiskAnalysisForm, setShowRiskAnalysisForm] = useState(false);
    const [showSmartRecommendationsForm, setShowSmartRecommendationsForm] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const isSidebarOpen = themeConfig.sidebar;

    useEffect(() => {
        if (messages.length === 0) return;
        if (!activeSessionId) {
            const newId = Date.now().toString();
            const newSession: ChatSession = {
                id: newId,
                title: generateTitle(messages),
                messages: [...messages],
            };
            setChatHistory(prev => [{ ...newSession }, ...prev]);
            setActiveSessionId(newId);
        } else {
            setChatHistory(prev =>
                prev.map(s =>
                    s.id === activeSessionId
                        ? { ...s, messages: [...messages], title: generateTitle(messages) }
                        : s
                )
            );
        }
    }, [messages]);

    useEffect(() => {
        if (chatHistory.length === 0) {
            setChatHistory([
                {
                    id: '1',
                    title: 'React to TS Tailwind',
                    messages: [
                        { role: 'user', content: 'How do I convert a React project to use TypeScript and Tailwind?' },
                        { role: 'assistant', content: 'You can start by installing TypeScript and Tailwind via npm, then rename your files to .tsx and configure Tailwind in your project.' }
                    ]
                },
                {
                    id: '2',
                    title: 'Gradient Background Update',
                    messages: [
                        { role: 'user', content: 'How can I update the gradient background in my app?' },
                        { role: 'assistant', content: 'You can use Tailwind CSS gradient utilities or custom CSS for more control.' }
                    ]
                },
                {
                    id: '3',
                    title: 'NextAuth PostgreSQL JWT',
                    messages: [
                        { role: 'user', content: 'How do I set up NextAuth with PostgreSQL and JWT?' },
                        { role: 'assistant', content: 'You need to configure a PostgreSQL adapter and enable JWT in your NextAuth options.' }
                    ]
                },
                {
                    id: '4',
                    title: 'Authentication with FastAPI',
                    messages: [
                        { role: 'user', content: 'How do I implement authentication in FastAPI?' },
                        { role: 'assistant', content: 'You can use OAuth2PasswordBearer and JWT tokens for authentication in FastAPI.' }
                    ]
                },
                {
                    id: '5',
                    title: 'Responsive background image',
                    messages: [
                        { role: 'user', content: 'How do I make a responsive background image in Tailwind?' },
                        { role: 'assistant', content: 'Use bg-cover, bg-center, and responsive utility classes in Tailwind.' }
                    ]
                },
                {
                    id: '6',
                    title: 'Railway vs Azure Pricing',
                    messages: [
                        { role: 'user', content: 'Which is cheaper for hosting: Railway or Azure?' },
                        { role: 'assistant', content: 'Railway is generally cheaper for small projects, but Azure offers more enterprise features.' }
                    ]
                },
                {
                    id: '7',
                    title: 'Unicorn JWT Package Error',
                    messages: [
                        { role: 'user', content: 'Why am I getting a JWT package error with Unicorn?' },
                        { role: 'assistant', content: 'Check your package versions and ensure you are using compatible JWT libraries with Unicorn.' }
                    ]
                }
            ]);
        }
    }, []);

    useEffect(() => {
        if (!menuOpenId) return;
        const handleClick = (e: MouseEvent) => {
            if (!(e.target instanceof HTMLElement)) return;
            if (!e.target.closest('.Chat-menu-btn') && !e.target.closest('.Chat-menu-dropdown')) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpenId]);

    const handleSessionClick = (session: ChatSession) => {
        setMessages(session.messages);
        setActiveSessionId(session.id);
        setHistoryOpen(false);
    };

    const handleNewChat = () => {
        setMessages([]);
        setInput('');
        setActiveSessionId(null);
        setHistoryOpen(false);
        setShowInvoiceTable(false);
        setShowInvoiceCreateForm(false);
        setShowInvoicePreview(false);
        setShowExpenseEntryForm(false);
        setShowSequenceFollowUpForm(false);
        setShowProductKnowledgeOverview(false);
        setShowSalesSummary(false);
        setShowBalanceSheetReport(false);
        setShowProfitLossSummary(false);
        setShowCashFlowForecast(false);
        setShowWeeklySalesTrends(false);
        setShowTopExpenseCategories(false);
        setSelectedInvoice(null);
        setShowUploadReceiptForm(false);
        setShowManageDocumentForm(false);
        setShowBackupFilesForm(false);
        setShowDocumentScannerForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (input.trim() === 'View Invoices') {
            setShowInvoiceTable(true);
            setShowInvoiceCreateForm(false);
            setShowExpenseEntryForm(false);
            setShowSequenceFollowUpForm(false);
            setShowProductKnowledgeOverview(false);
            setShowSalesSummary(false);
            setShowBalanceSheetReport(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Generate Invoice for Customer') {
            setShowInvoiceCreateForm(true);
            setShowInvoiceTable(false);
            setShowExpenseEntryForm(false);
            setShowSequenceFollowUpForm(false);
            setShowProductKnowledgeOverview(false);
            setShowSalesSummary(false);
            setShowBalanceSheetReport(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Create New Expense Entry') {
            setShowExpenseEntryForm(true);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowSequenceFollowUpForm(false);
            setShowProductKnowledgeOverview(false);
            setShowSalesSummary(false);
            setShowBalanceSheetReport(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Create Sequence Follow Up') {
            setShowSequenceFollowUpForm(true);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowProductKnowledgeOverview(false);
            setShowSalesSummary(false);
            setShowBalanceSheetReport(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Categorize Transactions') {
            setShowProductKnowledgeOverview(true);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowSalesSummary(false);
            setShowBalanceSheetReport(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Summarize Monthly Profit & Loss') {
            setShowSalesSummary(true);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowBalanceSheetReport(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Get Balance Sheet Report') {
            setShowBalanceSheetReport(true);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowProfitLossSummary(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Summarize Last Month\'s P&L') {
            setShowProfitLossSummary(true);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowCashFlowForecast(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Forecast Next Month\'s Cash Flow') {
            setShowCashFlowForecast(true);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowWeeklySalesTrends(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Show Weekly Sales Trends') {
            setShowWeeklySalesTrends(true);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowTopExpenseCategories(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Find Top 5 Expense Categories') {
            setShowTopExpenseCategories(true);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowUploadReceiptForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Upload Receipt') {
            setShowUploadReceiptForm(true);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowManageDocumentForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Manage Documents') {
            setShowManageDocumentForm(true);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowBackupFilesForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Backup Files') {
            setShowBackupFilesForm(true);
            setShowManageDocumentForm(false);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowDocumentScannerForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Document Scanner') {
            setShowDocumentScannerForm(true);
            setShowBackupFilesForm(false);
            setShowManageDocumentForm(false);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Ask Financial Question') {
            setShowAskFinancialQuestionForm(true);
            setShowDocumentScannerForm(false);
            setShowBackupFilesForm(false);
            setShowManageDocumentForm(false);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Predict Trends') {
            setShowPredictTrendsForm(true);
            setShowAskFinancialQuestionForm(false);
            setShowDocumentScannerForm(false);
            setShowBackupFilesForm(false);
            setShowManageDocumentForm(false);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Risk Analysis') {
            setShowRiskAnalysisForm(true);
            setShowPredictTrendsForm(false);
            setShowAskFinancialQuestionForm(false);
            setShowDocumentScannerForm(false);
            setShowBackupFilesForm(false);
            setShowManageDocumentForm(false);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setShowSmartRecommendationsForm(false);
            setInput('');
            return;
        }
        if (input.trim() === 'Smart Recommendations') {
            setShowSmartRecommendationsForm(true);
            setShowRiskAnalysisForm(false);
            setShowPredictTrendsForm(false);
            setShowAskFinancialQuestionForm(false);
            setShowDocumentScannerForm(false);
            setShowBackupFilesForm(false);
            setShowManageDocumentForm(false);
            setShowUploadReceiptForm(false);
            setShowTopExpenseCategories(false);
            setShowWeeklySalesTrends(false);
            setShowCashFlowForecast(false);
            setShowProfitLossSummary(false);
            setShowBalanceSheetReport(false);
            setShowSalesSummary(false);
            setShowProductKnowledgeOverview(false);
            setShowSequenceFollowUpForm(false);
            setShowExpenseEntryForm(false);
            setShowInvoiceTable(false);
            setShowInvoiceCreateForm(false);
            setInput('');
            return;
        }

        setShowInvoiceTable(false);
        setShowInvoiceCreateForm(false);
        setShowExpenseEntryForm(false);
        setShowSequenceFollowUpForm(false);
        setShowProductKnowledgeOverview(false);
        setShowSalesSummary(false);
        setShowBalanceSheetReport(false);
        setShowProfitLossSummary(false);
        setShowCashFlowForecast(false);
        setShowWeeklySalesTrends(false);
        setShowTopExpenseCategories(false);
        setShowUploadReceiptForm(false);
        setShowManageDocumentForm(false);
        setShowBackupFilesForm(false);
        setShowDocumentScannerForm(false);
        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        const aiMessage: Message = {
            role: 'assistant',
            content: `Simulated AI reply to: "${input}"`,
        };
        setMessages(prev => [...prev, aiMessage]);
        setShowRiskAnalysisForm(false);
        setShowSmartRecommendationsForm(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('File selected:', file.name);
        }
    };

    const handleViewInvoice = (invoice: any) => {
        setSelectedInvoice(invoice);
        setShowInvoicePreview(true);
    };

    return (
        <div className="relative h-[600px] w-full">
            {!historyOpen && (
                <div className="fixed top-4 right-4 z-50 mt-14">
                    <button
                        onClick={() => setHistoryOpen(true)}
                        className="rounded-full p-2 shadow bg-gray-800 hover:bg-gray-700 text-white"
                        aria-label="Open history sidebar"
                    >
                        <ArrowLeftFromLine className="w-6 h-6" />
                    </button>
                </div>
            )}

            <div className="h-full w-full">
                <div className="flex flex-col h-full w-full relative">
                    {showTopExpenseCategories ? (
                        <TopExpenseCategories />
                    ) : showWeeklySalesTrends ? (
                        <WeeklySalesTrends />
                    ) : showCashFlowForecast ? (
                        <CashFlowForecast />
                    ) : showProfitLossSummary ? (
                        <ProfitLossSummary />
                    ) : showBalanceSheetReport ? (
                        <BalanceSheetReport />
                    ) : showInvoicePreview && selectedInvoice ? (
                        <InvoicePreview invoice={selectedInvoice} onClose={() => { setShowInvoicePreview(false); setSelectedInvoice(null); }} />
                    ) : showSalesSummary ? (
                        <SalesSummary />
                    ) : showProductKnowledgeOverview ? (
                        <ProductKnowledgeOverview />
                    ) : showSequenceFollowUpForm ? (
                        <SequenceFollowUpForm />
                    ) : showExpenseEntryForm ? (
                        <ExpenseEntryForm />
                    ) : showInvoiceCreateForm ? (
                        <InvoiceCreateForm />
                    ) : showInvoiceTable ? (
                        <InvoiceTable onViewInvoice={handleViewInvoice} />
                    ) : showRiskAnalysisForm ? (
                        <RiskAnalysisForm />
                    ) : showSmartRecommendationsForm ? (
                        <SmartRecommendationsForm />
                    ) : showPredictTrendsForm ? (
                        <PredictTrendsForm />
                    ) : showAskFinancialQuestionForm ? (
                        <AskFinancialQuestionForm />
                    ) : showDocumentScannerForm ? (
                        <DocumentScannerForm />
                    ) : showBackupFilesForm ? (
                        <BackupFilesForm />
                    ) : showManageDocumentForm ? (
                        <ManageDocumentForm />
                    ) : showUploadReceiptForm ? (
                        <UploadReceiptForm onClose={() => setShowUploadReceiptForm(false)} />
                    ) : (
                        <MessageList messages={messages} />
                    )}
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        handleSubmit={handleSubmit}
                        handleFileUpload={handleFileUpload}
                        isSidebarOpen={isSidebarOpen}
                    />
                </div>
            </div>

            {historyOpen && (
                <div
                    className="fixed top-[60px] right-0 h-[calc(100%-80px)] w-[260px] border-l border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 flex flex-col z-40 shadow transition-transform duration-300"
                >
                    <div className="flex flex-col gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setHistoryOpen(false)}
                                className="rounded-full p-2 shadow bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                                aria-label="Close history sidebar"
                            >
                                <ArrowLeftFromLine className="w-6 h-6 transform rotate-180" />
                            </button>
                            <span className="font-semibold text-lg text-gray-800 dark:text-white">History</span>
                            <button
                                onClick={handleNewChat}
                                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full p-2 ml-auto"
                                aria-label="New Chat"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search chats..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-2">
                        {chatHistory.length === 0 && (
                            <div className="p-4 text-gray-400 dark:text-gray-500 text-center">No history yet</div>
                        )}

                        {chatHistory
                            .filter(session =>
                                session.title.toLowerCase().includes(search.toLowerCase()) ||
                                session.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
                            )
                            .map(session => (
                                <div
                                    key={session.id}
                                    className={`group relative flex items-center justify-between gap-2 px-3 py-1.5 mb-1 cursor-pointer transition-all text-sm truncate
        ${activeSessionId === session.id
                                            ? 'bg-gray-100 dark:bg-gray-700 font-semibold'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'} 
        rounded-xl
      `}
                                    onClick={() => handleSessionClick(session)}
                                >
                                    <div className="flex-1 truncate text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">{session.title}</div>

                                    <div
                                        className="relative z-30"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <button
                                            ref={el => {
                                                if (menuOpenId === session.id && el) {
                                                    const rect = el.getBoundingClientRect();
                                                    if (!menuPosition || menuPosition.top !== rect.bottom || menuPosition.left !== rect.right - 150) {
                                                        setMenuPosition({ top: rect.bottom, left: rect.right - 150 });
                                                    }
                                                }
                                            }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                if (menuOpenId === session.id) {
                                                    setMenuOpenId(null);
                                                    setMenuPosition(null);
                                                } else {
                                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                    setMenuOpenId(session.id);
                                                    setMenuPosition({ top: rect.bottom, left: rect.right - 150 });
                                                }
                                            }}
                                            className="Chat-menu-btn p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="More options"
                                        >
                                            <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>

                                        {menuOpenId === session.id && menuPosition && (
                                            <div
                                                className="Chat-menu-dropdown fixed w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-xl z-50"
                                                style={{ top: menuPosition.top + 4, left: menuPosition.left }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setChatHistory(prev => prev.filter(s => s.id !== session.id));
                                                        setMenuOpenId(null);
                                                        setMenuPosition(null);
                                                        if (activeSessionId === session.id) {
                                                            setMessages([]);
                                                            setActiveSessionId(null);
                                                        }
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
