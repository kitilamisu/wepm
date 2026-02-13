import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // 'wepm2009'를 직접 노출하지 않기 위해 인코딩된 값을 비교합니다.
  // 단순 Base64 디코딩을 방지하기 위해 'kocca_' 라는 솔트(Salt)를 붙여서 검증합니다.
  // 'kocca_wepm2009' -> Base64 Encoded -> 'a29jY2Ffd2VwbTIwMDk='
  const TARGET_KEY = "a29jY2Ffd2VwbTIwMDk=";

  const checkPassword = (input: string) => {
    try {
      // 입력값의 공백을 제거하고 솔트를 붙여 인코딩하여 비교
      const salt = 'kocca_';
      const encoded = btoa(salt + input.trim());
      return encoded === TARGET_KEY;
    } catch (e) {
      console.error("Encoding error:", e);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    // 약간의 지연 효과를 주어 UX 향상 (비동기 흉내)
    setTimeout(() => {
      if (checkPassword(password)) {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-[#161b22] p-8 rounded-lg border border-gray-800 shadow-xl max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-emerald-500">
            <Lock size={24} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white text-center mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter Password"
              className="w-full bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white focus:border-emerald-500 focus:outline-none placeholder-gray-600"
            />
            {error && <p className="text-red-500 text-xs mt-2">Incorrect password.</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;