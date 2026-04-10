import React, { useState } from 'react';

interface FundSearchProps {
  onSearch: (code: string) => void;
  loading?: boolean;
}

const FundSearch: React.FC<FundSearchProps> = ({ onSearch, loading = false }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   if (code.trim()) {
      // 移除空格和连字符，确保是纯数字
     const cleanCode = code.replace(/[\s-]/g, '');
     onSearch(cleanCode);
    }
  };

 return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={code}
           onChange={(e) => setCode(e.target.value)}
           placeholder="输入基金代码（如：161725）"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
           maxLength={6}
            disabled={loading}
          />
          {code && (
            <button
              type="button"
             onClick={() => setCode('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              查询中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              查询
            </>
          )}
        </button>
      </div>
      
      {/* 提示信息 */}
      <div className="mt-2 text-sm text-gray-500">
        💡 提示：支持查询所有场外基金代码，LOF/ETF 联接基金等
      </div>
    </form>
  );
};

export default FundSearch;
