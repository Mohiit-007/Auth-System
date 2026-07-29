import React, { useState, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import { userDataContext } from '../context/Usercontext'
import axios from 'axios'

const OTP_LENGTH = 6

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { serverUrl } = useContext(userDataContext)
  const email = location.state?.email || ''

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [err, setErr] = useState('')
  const [status, setStatus] = useState(location.state?.status || '')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])

  const focusInput = (index) => {
    inputRefs.current[index]?.focus()
  }

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setErr('')

    if (!value) {
      setDigits((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      return
    }

    // handle paste or multi-char input landing in one box
    const chars = value.split('')
    setDigits((prev) => {
      const next = [...prev]
      let cursor = index
      for (const ch of chars) {
        if (cursor >= OTP_LENGTH) break
        next[cursor] = ch
        cursor++
      }
      const nextEmpty = next.findIndex((d) => d === '')
      focusInput(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty)
      return next
    })
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      setErr('')
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev]
          next[index] = ''
          return next
        })
      } else if (index > 0) {
        focusInput(index - 1)
        setDigits((prev) => {
          const next = [...prev]
          next[index - 1] = ''
          return next
        })
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1))
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length !== OTP_LENGTH) {
      setErr('Please enter the full 6-digit code.')
      return
    }
    setErr('')
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/auth/verify-otp`, { email, otp }, { withCredentials: true })
      navigate('/')
    } catch (error) {
      setErr(error?.response?.data?.msg || 'Verification failed. Please try again.')
      setDigits(Array(OTP_LENGTH).fill(''))
      focusInput(0)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resending) return;
    setErr('')
    setStatus('')
    setResending(true)
    try {
      await axios.post(`${serverUrl}/auth/resend-otp`, { email })
      setStatus(`OTP has been resent to ${email}`)
      setDigits(Array(OTP_LENGTH).fill(''))
      focusInput(0)
    } catch (error) {
      setErr(error?.response?.data?.msg || 'Could not resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100 px-4">
      <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-white">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-400">
          {status ? (
            <span className="text-cyan-300">{status}</span>
          ) : (
            <>Enter the code sent to <span className="text-cyan-300">{email}</span></>
          )}
        </p>

        {err && (
          <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {err}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-14 w-12 rounded-2xl border border-white/10 bg-slate-900/80 text-center text-xl font-semibold text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <FaSpinner className="h-5 w-5 animate-spin text-slate-950" />
                Verifying...
              </span>
            ) : (
              'Verify'
            )}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-4 text-sm text-cyan-300 transition hover:text-cyan-200 disabled:opacity-50 cursor-pointer"
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail