import { useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import PasswordInput from '../components/PasswordInput';



const inputClass =

  'w-full bg-[#f9f9f7] border border-gray-200 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-400';



const labelClass =

  'block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2';



function Login() {

  const [formData, setFormData] = useState({ email: '', password: '' });

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);



  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const from = location.state?.from?.pathname || '/';



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    setLoading(true);



    try {

      const response = await login(formData.email, formData.password);

      if (response.data.user.role === 'admin') {

        navigate('/admin', { replace: true });

      } else {

        navigate(from, { replace: true });

      }

    } catch (err) {

      setError(err.response?.data?.message || 'Login failed. Please try again.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-white flex flex-col">

      <div className="flex-grow flex items-start justify-center px-6 pt-8 pb-16 lg:pt-12">

        <div className="w-full max-w-md">

          <div className="text-center mb-10">

            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Account</p>

            <h1

              className="text-2xl md:text-3xl font-black uppercase text-black"

              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}

            >

              Login

            </h1>

            <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>

          </div>



          <div className="border border-gray-100 bg-white p-8 lg:p-10">

            {error && (

              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 mb-6 text-sm">

                {error}

              </div>

            )}



            <form onSubmit={handleSubmit} className="space-y-5">

              <div>

                <label className={labelClass} htmlFor="email">Email</label>

                <input

                  id="email"

                  type="email"

                  value={formData.email}

                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}

                  className={inputClass}

                  placeholder="your@email.com"

                  required

                  disabled={loading}

                  autoComplete="email"

                />

              </div>



              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className={`${labelClass} mb-0`} htmlFor="password">Password</label>

                  <Link

                    to="/forgot-password"

                    className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-black font-bold transition-colors"

                  >

                    Forgot password?

                  </Link>

                </div>

                <PasswordInput

                  id="password"

                  value={formData.password}

                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}

                  required

                  disabled={loading}

                  autoComplete="current-password"

                />

              </div>



              <button

                type="submit"

                className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 touch-manipulation"

                disabled={loading}

              >

                {loading ? 'Logging in...' : 'Login'}

              </button>

            </form>



            <p className="text-center mt-8 text-sm text-gray-500">

              Don&apos;t have an account?{' '}

              <Link to="/signup" className="text-black font-bold hover:opacity-70 transition-opacity">

                Sign up

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}



export default Login;


