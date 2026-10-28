import React, { useState } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { ApplicationsView } from './components/ApplicationsView';
import { DocumentVerificationView } from './components/DocumentVerificationView';
import { ComplianceCheckerView } from './components/ComplianceCheckerView';
import { VerificationReportsView } from './components/VerificationReportsView';
import { ActivityLogsView } from './components/ActivityLogsView';
import { SettingsView } from './components/SettingsView';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { INITIAL_APPLICATIONS, AI_INSIGHTS, AICTE_SEAL_IMG } from './data/mockData';
import { Application, DocumentItem } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LoginView } from './components/auth/LoginView';
import { SignupView } from './components/auth/SignupView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { Shield } from 'lucide-react';

function MainDashboard() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeInspectDoc, setActiveInspectDoc] = useState<DocumentItem | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentItem[]>([
    INITIAL_APPLICATIONS[0].documents[1],
    INITIAL_APPLICATIONS[0].documents[0],
    INITIAL_APPLICATIONS[0].documents[2],
  ]);

  const handleSelectApplication = (app: Application) => {
    setSelectedApplication(app);
  };

  const handleQuickVerifyApplication = (app: Application) => {
    if (app.documents && app.documents.length > 0) {
      setActiveInspectDoc(app.documents[0]);
    }
    setCurrentTab('document-verification');
  };

  const handleVerifyDocumentFromModal = (doc: DocumentItem) => {
    setActiveInspectDoc(doc);
    setCurrentTab('document-verification');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Sidebar (Desktop persistent + Mobile drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onQuickVerify={() => {
          setActiveInspectDoc(INITIAL_APPLICATIONS[0].documents[1]);
          setCurrentTab('document-verification');
          setMobileOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobile={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onQuickVerify={() => {
            setActiveInspectDoc(INITIAL_APPLICATIONS[0].documents[1]);
            setCurrentTab('document-verification');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Viewport Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewView
              applications={applications}
              insights={AI_INSIGHTS}
              onSelectApplication={handleSelectApplication}
              onNavigateTab={setCurrentTab}
              onStartVerification={() => {
                setActiveInspectDoc(INITIAL_APPLICATIONS[0].documents[1]);
                setCurrentTab('document-verification');
              }}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              onSelectApplication={handleSelectApplication}
              onQuickVerifyApplication={handleQuickVerifyApplication}
            />
          )}

          {currentTab === 'document-verification' && (
            <DocumentVerificationView
              initialDocument={activeInspectDoc}
              institutionName={selectedApplication?.institutionName || 'Apex Institute of Technology & Sciences'}
              onDocumentsUpdate={setUploadedDocuments}
              onNavigateToReport={() => {
                setCurrentTab('verification-reports');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'compliance-checker' && (
            <ComplianceCheckerView />
          )}

          {currentTab === 'verification-reports' && (
            <VerificationReportsView 
              applications={applications}
              activeUploadedDocuments={uploadedDocuments}
              onNavigateTab={(tab) => {
                setCurrentTab(tab as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'activity-logs' && (
            <ActivityLogsView />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Application Dossier Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onVerifyDocument={handleVerifyDocumentFromModal}
        onOpenCompliance={() => {
          setCurrentTab('compliance-checker');
        }}
        onOpenReport={() => {
          setCurrentTab('verification-reports');
        }}
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [resetToken, setResetToken] = useState<string>('');

  // Initial session hydration loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-cyan-500/40 p-1.5 bg-white dark:bg-slate-900 shadow-xl mb-4">
          <img 
            src={AICTE_SEAL_IMG} 
            alt="AICTE VerifyAI" 
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/20 dark:bg-cyan-950/40 pointer-events-none rounded-xl">
            <Shield className="w-7 h-7 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Verifying AICTE Statutory Session...
        </p>
      </div>
    );
  }

  // Protected route boundary: if not authenticated, show dedicated auth pages
  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <SignupView onNavigate={setAuthView} />;
    }
    if (authView === 'forgot-password') {
      return <ForgotPasswordView onNavigate={setAuthView} onSetResetToken={setResetToken} />;
    }
    if (authView === 'reset-password') {
      return <ResetPasswordView initialToken={resetToken} onNavigate={setAuthView} />;
    }
    return <LoginView onNavigate={setAuthView} />;
  }

  // Authenticated dashboard
  return <MainDashboard />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
