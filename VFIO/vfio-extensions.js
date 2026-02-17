// VFI/O Airtable Lookup Form Extension (Voiceflow Webchat)
// Trace requirement: trace.type and trace.payload.name MUST match
// Uses Airtable "filterByFormula" to search by Email, shows spinner while searching,
// then sends variables back to Voiceflow via window.voiceflow.chat.interact({ type:'complete', payload })

export const VFIOFormExtension = {
  name: 'VFI/O Form',
  type: 'response',

  match: ({ trace }) => {
    const match =
      trace?.type === 'ext_vfio_form' || trace?.payload?.name === 'ext_vfio_form'
    if (match) console.log('[VFI/O Form] matched trace:', trace)
    return match
  },

  render: ({ trace, element }) => {
    console.log('[VFI/O Form] render start', trace)

    // -----------------------------
    // CONFIG (pass these via trace.payload to keep the extension generic)
    // -----------------------------
    // Example payload to send from Voiceflow:
    // {
    //   "name": "ext_vfio_form",
    //   "airtable": {
    //     "baseId": "appXXXXXXXXXXXXXX",
    //     "tableName": "Customers",
    //     "emailField": "Email",
    //     "tokenSource": "window", // "window" | "payload"
    //     "tokenKey": "__VFIO_AIRTABLE_TOKEN" // if tokenSource="window" reads window[ tokenKey ]
    //     // OR if tokenSource="payload" provide airtable.token in payload (NOT truly secure in browser)
    //   }
    // }

    const airtableCfg = trace?.payload?.airtable || {}
    const baseId = airtableCfg.baseId
    const tableName = airtableCfg.tableName
    const emailField = airtableCfg.emailField || 'Email'
    const tokenSource = airtableCfg.tokenSource || 'window' // "window" recommended
    const tokenKey = airtableCfg.tokenKey || '__VFIO_AIRTABLE_TOKEN'

    // IMPORTANT SECURITY NOTE:
    // Putting an Airtable token in browser code (even as a "variable") is still visible to users.
    // The best practice is: call YOUR backend/serverless endpoint and keep the Airtable token there.
    // This extension supports reading the token from window[tokenKey] so it isn't hardcoded here,
    // but it is still accessible in the browser runtime.

    const getAirtableToken = () => {
      if (tokenSource === 'payload') return airtableCfg.token
      return window?.[tokenKey]
    }

    // -----------------------------
    // UI
    // -----------------------------
    const container = document.createElement('div')
    container.className = 'form-container'
    container.innerHTML = `
      <style>
        .form-container {
          width: 100%;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          box-sizing: border-box;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
          background: #fff;
        }
        .form-group textarea {
          min-height: 110px;
          resize: vertical;
        }
        .invalid {
          border-color: red !important;
        }
        .submit-btn {
          background: #398CC4;
          color: white;
          border: none;
          padding: 12px 15px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          width: 100%;
        }
        .submit-btn:hover {
          background: #2E719E;
        }

        /* Spinner overlay */
        .vfio-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.8);
          display: none;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          z-index: 10;
        }
        .vfio-overlay.show { display: flex; }

        .vfio-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        .vfio-spinner {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 4px solid rgba(0,0,0,0.12);
          border-top-color: #398CC4;
          animation: vfio-spin 0.9s linear infinite;
        }
        @keyframes vfio-spin {
          to { transform: rotate(360deg); }
        }
        .vfio-status {
          font-size: 14px;
          color: #333;
        }
        .vfio-error {
          margin-top: 10px;
          padding: 10px;
          border: 1px solid rgba(255, 0, 0, 0.25);
          background: rgba(255, 0, 0, 0.06);
          border-radius: 6px;
          color: #7a1b1b;
          font-size: 14px;
          display: none;
        }
        .vfio-error.show { display: block; }
      </style>

      <div class="vfio-overlay" data-overlay>
        <div class="vfio-spinner-wrap">
          <div class="vfio-spinner" aria-label="Loading"></div>
          <div class="vfio-status" data-status>Searching database…</div>
        </div>
      </div>

      <form data-form>
        <div class="form-group">
          <label for="vfio-name">Name</label>
          <input id="vfio-name" name="name" type="text" autocomplete="name" placeholder="Your name" required />
        </div>

        <div class="form-group">
          <label for="vfio-email">Email</label>
          <input id="vfio-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required />
        </div>

        <div class="form-group">
          <label for="vfio-plan">Plan</label>
          <select id="vfio-plan" name="plan" required>
            <option value="" selected disabled>Select</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Business">Business</option>
            <option value="Business+">Business+</option>
          </select>
        </div>

        <div class="form-group">
          <label for="vfio-message">Message</label>
          <textarea id="vfio-message" name="message" placeholder="Tell us what you're trying to build…"></textarea>
        </div>

        <button class="submit-btn" type="submit">Submit</button>
        <div class="vfio-error" data-error></div>
      </form>
    `

    const form = container.querySelector('[data-form]')
    const overlay = container.querySelector('[data-overlay]')
    const statusEl = container.querySelector('[data-status]')
    const errorEl = container.querySelector('[data-error]')
    const submitBtn = container.querySelector('button[type="submit"]')

    const nameInput = container.querySelector('#vfio-name')
    const emailInput = container.querySelector('#vfio-email')
    const planSelect = container.querySelector('#vfio-plan')
    const messageInput = container.querySelector('#vfio-message')

    const setLoading = (isLoading, msg = 'Searching database…') => {
      if (!overlay) return
      overlay.classList.toggle('show', !!isLoading)
      if (statusEl) statusEl.textContent = msg
      if (submitBtn) submitBtn.disabled = !!isLoading
    }

    const showError = (msg) => {
      console.warn('[VFI/O Form] error:', msg)
      if (!errorEl) return
      errorEl.textContent = msg
      errorEl.classList.add('show')
    }

    const clearError = () => {
      if (!errorEl) return
      errorEl.textContent = ''
      errorEl.classList.remove('show')
    }

    const markInvalid = (el, isInvalid) => {
      if (!el) return
      el.classList.toggle('invalid', !!isInvalid)
    }

    const validate = () => {
      let ok = true
      clearError()

      // native validity first
      const fields = [nameInput, emailInput, planSelect]
      fields.forEach((f) => markInvalid(f, false))

      for (const f of fields) {
        if (!f.checkValidity()) {
          markInvalid(f, true)
          ok = false
        }
      }

      if (!ok) showError('Please complete the required fields.')
      return ok
    }

    const airtableFindByEmail = async (email) => {
      const token = getAirtableToken()
      if (!baseId || !tableName) {
        throw new Error(
          'Missing Airtable config: baseId/tableName. Provide trace.payload.airtable.baseId and tableName.'
        )
      }
      if (!token) {
        throw new Error(
          `Missing Airtable token. Set window["${tokenKey}"] (recommended) or pass airtable.token in payload.`
        )
      }

      // Escape quotes for Airtable formula
      const safeEmail = String(email).replace(/"/g, '\\"')
      const formula = `{${emailField}}="${safeEmail}"`
      const url = `https://api.airtable.com/v0/${encodeURIComponent(
        baseId
      )}/${encodeURIComponent(tableName)}?filterByFormula=${encodeURIComponent(
        formula
      )}`

      console.log('[VFI/O Form] Airtable request:', {
        baseId,
        tableName,
        emailField,
        formula,
      })

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(
          `Airtable lookup failed (${res.status}). ${text ? `Response: ${text}` : ''
          }`
        )
      }

      const data = await res.json()
      const records = Array.isArray(data?.records) ? data.records : []
      console.log('[VFI/O Form] Airtable response records:', records.length)
      return records
    }

    const onSubmit = async (e) => {
      e.preventDefault()
      console.log('[VFI/O Form] submit clicked')

      if (!validate()) return

      const payload = {
        Name: nameInput.value.trim(),
        Email: emailInput.value.trim(),
        Plan: planSelect.value,
        Message: (messageInput.value || '').trim(),
      }

      setLoading(true, 'Searching database…')

      try {
        const records = await airtableFindByEmail(payload.Email)

        // If match found -> success path (as requested)
        if (records.length > 0) {
          console.log('[VFI/O Form] match found — sending to Voiceflow:', payload)

          setLoading(true, 'Match found. Saving…')

          // Push variables into Voiceflow.
          // IMPORTANT: your flow should listen for the "complete" interact
          window.voiceflow?.chat?.interact({
            type: 'complete',
            payload,
          })

          // Optional: lock UI after success
          setLoading(false)
          submitBtn.textContent = 'Submitted'
          submitBtn.disabled = true
          ;[nameInput, emailInput, planSelect, messageInput].forEach((el) => {
            if (el) el.disabled = true
          })
          return
        }

        // No match found -> show error & allow user to retry
        console.log('[VFI/O Form] no match found for email:', payload.Email)
        setLoading(false)
        showError(
          'We couldn’t find that email in our database. Please check the spelling or use a different email.'
        )
        markInvalid(emailInput, true)
      } catch (err) {
        setLoading(false)
        showError(
          err?.message ||
            'Something went wrong while searching the database. Please try again.'
        )
      }
    }

    form.addEventListener('submit', onSubmit)
    element.appendChild(container)

    // teardown
    return () => {
      console.log('[VFI/O Form] teardown')
      form.removeEventListener('submit', onSubmit)
      container.remove()
    }
  },
}

export default VFIOFormExtension
