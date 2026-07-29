import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa'
import { userDataContext } from '../context/Usercontext'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const { serverUrl, setUserData, setAccessToken, handleCurrentUser } = useContext(userDataContext)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setErr('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setErr('Please enter your email and password.')
      setLoading(false)
      return
    }

    try {
        const res = await axios.post(`${serverUrl}/auth/login`, formData, { withCredentials: true })
        setAccessToken(res.data.accesstoken)
        setUserData(res.data.user)
        navigate('/')
    } catch (error) {
        const msg = error?.response?.data?.msg || 'Login failed. Please try again.'
        setErr(msg)
        if (msg === 'Email not verified') {
            navigate('/verify-email', { state: { email: formData.email } })
        }
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#050c1f_100%)] flex items-center justify-center px-4 py-10 text-slate-100">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 px-8 py-10 shadow-[0_28px_80px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(34,211,238,0.24)_0%,_transparent_35%)] opacity-60" />
        <div className="relative z-10">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/70">Login to</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Virtual Assistant</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {err && (
              <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {err}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaEnvelope />
                </span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-full border border-white/20 bg-white/5 px-14 py-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaLock />
                </span>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="password"
                  className="w-full rounded-full border border-white/20 bg-white/5 px-14 py-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:scale-[1.01] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <FaSpinner className="h-5 w-5 animate-spin text-slate-950" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-slate-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
            </div>

            <a href={`${serverUrl}/auth/google`}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
            <FcGoogle className="text-xl" />
            Continue with Google
            </a>
          <p className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <NavLink to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-100 cursor-pointer">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
)}

export default Login
