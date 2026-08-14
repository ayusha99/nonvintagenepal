import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import PasswordInput from '../components/PasswordInput';



const inputClass =

  'w-full bg-[#f9f9f7] border border-gray-200 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-400';



const labelClass =

  'block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2';



function Signup() {

  const [formData, setFormData] = useState({

    name: '',

    email: '',

    password: '',

    confirmPassword: '',

  });

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);



  const { signup } = useAuth();

  const navigate = useNavigate();



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');



    if (formData.password !== formData.confirmPassword) {

      setError('Passwords do not match!');

      return;

    }



    if (formData.password.length < 6) {

      setError('Password must be at least 6 characters long');

      return;

    }



    setLoading(true);



    try {

      await signup(formData.name, formData.email, formData.password);

      navigate('/');

    } catch (err) {

      setError(err.response?.data?.message || 'Signup failed. Please try again.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-white flex flex-col">

      <div className="flex-grow flex items-start justify-center px-6 pt-8 pb-16 lg:pt-12">

        <div className="w-full max-w-md">

          <div className="text-center mb-10">

            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Join Us</p>

            <h1

              className="text-2xl md:text-3xl font-black uppercase text-black"

              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}

            >

              Sign Up

            </h1>

            <p className="text-sm text-gray-500 mt-2">Create your account</p>

          </div>



          <div className="border border-gray-100 bg-white p-8 lg:p-10">

            {error && (

              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 mb-6 text-sm">

                {error}

              </div>

            )}



            <form onSubmit={handleSubmit} className="space-y-5">

              <div>

                <label className={labelClass} htmlFor="name">Name</label>

                <input

                  id="name"

                  type="text"

                  value={formData.name}

                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                  className={inputClass}

                  placeholder="Your name"

                  required

                  disabled={loading}

                  autoComplete="name"

                />

              </div>



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

                <label className={labelClass} htmlFor="password">Password</label>

                <PasswordInput

                  id="password"

                  value={formData.password}

                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}

                  required

                  disabled={loading}

                  minLength={6}

                  autoComplete="new-password"

                />

              </div>



              <div>

                <label className={labelClass} htmlFor="confirmPassword">Confirm Password</label>

                <PasswordInput

                  id="confirmPassword"

                  value={formData.confirmPassword}

                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}

                  required

                  disabled={loading}

                  autoComplete="new-password"

                />

              </div>



              <button

                type="submit"

                className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 touch-manipulation"

                disabled={loading}

              >

                {loading ? 'Creating account...' : 'Sign Up'}

              </button>

            </form>



            <p className="text-center mt-6 text-xs text-gray-400 leading-relaxed">

              By signing up, you agree to our{' '}

              <Link to="/privacy-policy" className="text-black font-bold hover:opacity-70">

                Privacy Policy

              </Link>

              .

            </p>



            <p className="text-center mt-4 text-sm text-gray-500">

              Already have an account?{' '}

              <Link to="/login" className="text-black font-bold hover:opacity-70 transition-opacity">

                Login

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}



export default Signup;


