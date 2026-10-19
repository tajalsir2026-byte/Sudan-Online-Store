import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary — catches React rendering errors and shows
 * a user-friendly fallback UI instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '';
    window.location.search = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          dir="rtl"
          className="min-h-screen bg-slate-50 flex items-center justify-center p-6"
        >
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-8 py-6 text-center">
              <AlertTriangle className="w-14 h-14 text-white mx-auto mb-3" />
              <h1 className="text-xl font-bold text-white">عذراً، حدث خطأ غير متوقع</h1>
              <p className="text-rose-100 text-sm mt-1">
                نعتذر عن هذا الخلل. يمكنك إعادة تحميل الصفحة أو العودة للرئيسية.
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة تحميل الصفحة
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-sm transition-colors border border-slate-200"
                >
                  <Home className="w-4 h-4" />
                  الصفحة الرئيسية
                </button>
              </div>

              {/* Error details (collapsible, for debugging) */}
              {this.state.error && (
                <details className="border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                    تفاصيل الخطأ للمطورين
                  </summary>
                  <div className="p-4 text-xs font-mono bg-slate-900 text-slate-100 overflow-auto max-h-48">
                    <p className="text-rose-400 font-bold mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="whitespace-pre-wrap text-[10px] text-slate-400 leading-relaxed">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
