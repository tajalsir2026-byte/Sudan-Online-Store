import React, { useState, useEffect } from 'react';
import {
  Coins,
  Plus,
  Receipt,
  Building,
  CreditCard,
  DollarSign,
  TrendingDown,
  X,
  CheckCircle,
} from 'lucide-react';
import type { Purchase, Expense, Branch, CurrencyConfig } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface PurchasesExpensesViewProps {
  branches: Branch[];
  currentBranch: Branch | null;
  currencies: CurrencyConfig[];
  onRefresh: () => void;
}

export const PurchasesExpensesView: React.FC<PurchasesExpensesViewProps> = ({
  branches,
  currentBranch,
  currencies,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'purchases'>('expenses');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  // Add Expense Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('كهرباء ومياه');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseReceiptNo, setExpenseReceiptNo] = useState('');
  const [expenseBranchId, setExpenseBranchId] = useState(currentBranch?.id || branches[0]?.id || '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const expRes = await api.getExpenses();
      setExpenses(expRes.expenses);

      const purchRes = await api.getPurchases();
      setPurchases(purchRes.purchases);
    } catch (err) {
      console.warn('Failed to load financial records:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered lists
  const filteredExpenses = expenses.filter((e) => !selectedBranchId || e.branchId === selectedBranchId);
  const filteredPurchases = purchases.filter((p) => !selectedBranchId || p.branchId === selectedBranchId);

  // Total Expenses
  const totalExpensesSdg = filteredExpenses.reduce((acc, e) => acc + e.amountSdg, 0);
  const totalPurchasesSdg = filteredPurchases.reduce((acc, p) => acc + p.totalCostSdg, 0);

  // Submit Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.createExpense({
        branchId: expenseBranchId,
        category: expenseCategory,
        amountSdg: Number(expenseAmount),
        description: expenseDescription,
        receiptNumber: expenseReceiptNo,
      });

      if (res.success) {
        setIsExpenseModalOpen(false);
        setExpenseAmount('');
        setExpenseDescription('');
        setExpenseReceiptNo('');
        loadData();
        onRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'فشل تسجيل المصروف');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">المشتريات والمصروفات التشغيلية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            توثيق فواتير المشتريات متعددة العملات والمصروفات التشغيلية لحساب صافي الأرباح بدقة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'expenses' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              المصروفات التشغيلية
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'purchases' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              فواتير المشتريات والتوريد
            </button>
          </div>

          {activeTab === 'expenses' && (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل سند صرف</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">إجمالي المصروفات التشغيلية:</span>
            <span className="text-xl font-bold text-rose-700 font-mono tabular-nums">
              {totalExpensesSdg.toLocaleString()} ج.س
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">إجمالي المشتريات والتوريدات:</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {totalPurchasesSdg.toLocaleString()} ج.س
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Branch */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-600">تصفية حسب الفرع:</span>
        <select
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
          className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">كافة الفروع</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content Table */}
      {activeTab === 'expenses' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">الفرع</th>
                  <th className="py-3 px-4">تصنيف المصروف</th>
                  <th className="py-3 px-4">البيان / الوصف</th>
                  <th className="py-3 px-4">رقم السند / الإيصال</th>
                  <th className="py-3 px-4">المسؤول عن الصرف</th>
                  <th className="py-3 px-4">المبلغ بالجنيه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {new Date(exp.createdAt).toLocaleDateString('ar-SD')}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{exp.branchName}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-slate-700">{exp.category}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{exp.description}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{exp.receiptNumber || '-'}</td>
                    <td className="py-3 px-4 text-slate-700">{exp.paidBy}</td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">
                      {exp.amountSdg.toLocaleString()} ج.س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Purchases Table */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">رقم الفاتورة</th>
                  <th className="py-3 px-4">المورد</th>
                  <th className="py-3 px-4">الفرع</th>
                  <th className="py-3 px-4">عملة الفاتورة</th>
                  <th className="py-3 px-4">سعر الصرف المعتمد</th>
                  <th className="py-3 px-4">التكلفة الإجمالية (ج.س)</th>
                  <th className="py-3 px-4">حالة السداد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPurchases.map((purch) => (
                  <tr key={purch.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {new Date(purch.createdAt).toLocaleDateString('ar-SD')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{purch.invoiceNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{purch.supplierName}</td>
                    <td className="py-3 px-4 text-slate-700">{purch.branchName}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">{purch.currency}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {purch.exchangeRate === 1 ? 'أساسي (1)' : `1 ${purch.currency} = ${purch.exchangeRate} ج.س`}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {purch.totalCostSdg.toLocaleString()} ج.س
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-semibold">مدفوع ومستلم</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD EXPENSE MODAL
          ========================================================================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddExpense}
            className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">تسجيل سند صرف ومصروف تشغيلي</h3>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الفرع المحمّل عليه المصروف:</label>
                <select
                  value={expenseBranchId}
                  onChange={(e) => setExpenseBranchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تصنيف المصروف:</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="كهرباء ومياه">كهرباء ومياه وخدمات</option>
                  <option value="نقل وتفريغ">نقل وتفريغ وعتالة</option>
                  <option value="رواتب">رواتب ومكافآت عمال</option>
                  <option value="إيجار">إيجار المحل أو المستودع</option>
                  <option value="صيانة">صيانة وإصلاحات</option>
                  <option value="إعاشة وضيافة">إعاشة وضيافة ونثريات</option>
                  <option value="أخرى">مصروفات أخرى</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">المبلغ (بالجنيه السوداني):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="أدخل المبلغ"
                    className="w-full pr-3 pl-12 py-2 text-base font-bold font-mono border border-slate-300 rounded-lg"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                    ج.س
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">بيان الصرف والشرح:</label>
                <textarea
                  required
                  rows={2}
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="مثال: شراء كروت كهرباء 3 فاز للمبردات والإنارة..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم الفاتورة أو الإيصال الخارجي (اختياري):</label>
                <input
                  type="text"
                  value={expenseReceiptNo}
                  onChange={(e) => setExpenseReceiptNo(e.target.value)}
                  placeholder="مثال: ELEC-99120"
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                حفظ السند
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
