// VFI/O Airtable Support Gate Form (2-step + status gating)
// Option A: always uses Voiceflow "complete" to exit the function
// - Eligible: completes on STEP 2 (message submit)
// - Ineligible / No-match-twice: completes immediately with outcome flags

export const VFIOFormExtension = {
  name: 'VFI/O Support Form',
  type: 'response',

  match: ({ trace }) => {
    const match =
      trace?.type === 'ext_vfio_form' || trace?.payload?.name === 'ext_vfio_form'
    if (match) console.log('[VFI/O Support Form] matched trace:', trace)
    return match
  },

  render: ({ trace, element }) => {
    console.log('[VFI/O Support Form] render start', trace)

    // Full width inside chat bubble/container
    try {
      element.style.width = '100%'
      element.style.maxWidth = '100%'
      element.style.boxSizing = 'border-box'
    } catch (e) {
      console.warn('[VFI/O Support Form] could not set element width', e)
    }

    // -----------------------------
    // CONFIG (pass via trace.payload)
    // -----------------------------
    const airtableCfg = trace?.payload?.airtable || {}
    const baseId = airtableCfg.baseId
    const tableName = airtableCfg.tableName
    const tokenSource = airtableCfg.tokenSource || 'window' // "window" | "payload"
    const tokenKey = airtableCfg.tokenKey || '__VFIO_AIRTABLE_TOKEN'
    const fields = airtableCfg.fields || {}

    const EMAIL_FIELD = fields.email || 'Email'
    const NAME_FIELD = fields.name || 'Name'
    const USERNAME_FIELD = fields.username || 'Username'
    const PLAN_FIELD = fields.plan || 'Plan'
    const STATUS_FIELD = fields.status || 'Status'

    const getAirtableToken = () => {
      if (tokenSource === 'payload') return airtableCfg.token
      return window?.[tokenKey]
    }

    // -----------------------------
    // STATE
    // -----------------------------
    let tries = 0
    let matchedRecord = null // Airtable record
    let supportAllowed = false

    // cache identity vars after match so we can send them only on step 2
    let vfIdentity = null // { Name, Username, Email, Plan, Status }

    // -----------------------------
    // UI
    // -----------------------------
    const container = document.createElement('div')
    container.className = 'vfio-form-root'

    container.innerHTML = `
      <!-- Poppins -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

      <style>
        /* Requested wrapper padding override */
        ._16eqxif8 {
          display: block;
          padding: 0px;
        }

        .vfio-form-root { width: 100%; max-width: 100%; box-sizing: border-box; }

        .vfio-form-root .form-container {
          font-family: 'Poppins', sans-serif;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          box-sizing: border-box;
        }

        .vfio-form-root .form-group { margin-bottom: 15px; }

        .vfio-form-root input,
        .vfio-form-root textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .vfio-form-root input:focus,
        .vfio-form-root textarea:focus {
          outline: none;
          border-color: #398CC4;
          box-shadow: 0 0 0 2px rgba(57, 140, 196, 0.15);
        }

        .vfio-form-root textarea { min-height: 120px; resize: vertical; }

        /* Nice placeholder tone (optional) */
        .vfio-form-root input::placeholder,
        .vfio-form-root textarea::placeholder {
          color: rgba(0,0,0,0.45);
        }

        .vfio-form-root .invalid { border-color: red !important; }

        .vfio-form-root .submit-btn {
          background: #26BFD9;
          color: white;
          border: none;
          padding: 14px 15px;
          cursor: pointer;
          border-radius: 6px;
          font-size: 15px;
          width: 100%;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          transition: background 0.15s ease, transform 0.12s ease;
        }
        
        .vfio-form-root .submit-btn:hover { 
          background: #1FA9C0;
          transform: translateY(-1px); 
        }

        /* Spinner overlay */
        .vfio-form-root .vfio-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.85);
          z-index: 10;
          display: none;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 16px;
          box-sizing: border-box;
        }
        .vfio-form-root .vfio-overlay.show { display: flex; }

        .vfio-form-root .vfio-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 270px;
        }
        .vfio-form-root .vfio-spinner {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid rgba(0,0,0,0.12);
          border-top-color: #398CC4;
          animation: vfio-spin 0.85s linear infinite;
        }
        @keyframes vfio-spin { to { transform: rotate(360deg); } }
        .vfio-form-root .vfio-status { font-size: 14px; color: #333; font-weight: 500; text-align: center; }

        .vfio-form-root .vfio-error {
          margin-top: 10px;
          padding: 10px;
          border: 1px solid rgba(255, 0, 0, 0.25);
          background: rgba(255, 0, 0, 0.06);
          border-radius: 6px;
          color: #7a1b1b;
          font-size: 14px;
          display: none;
        }
        .vfio-form-root .vfio-error.show { display: block; }

        .vfio-form-root .vfio-info {
          margin-bottom: 12px;
          padding: 12px;
          border: 1px solid rgba(57, 140, 196, 0.25);
          background: rgba(57, 140, 196, 0.06);
          border-radius: 8px;
          color: #123;
          display: none;
        }
        .vfio-form-root .vfio-info.show { display: block; }
        .vfio-form-root .vfio-who {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 2px;
        }
        .vfio-form-root .vfio-who-sub {
          font-weight: 500;
          font-size: 13px;
          opacity: 0.85;
        }

        /* Smooth reveal for message step */
        .vfio-form-root .reveal {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-4px);
          transition: max-height 420ms ease, opacity 320ms ease, transform 320ms ease;
        }
        .vfio-form-root .reveal.show {
          max-height: 420px;
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 360px) {
          .vfio-form-root .form-container { padding: 16px; }
        }
      </style>

      <div class="form-container">
        <div class="vfio-overlay" data-overlay>
          <div class="vfio-spinner-wrap">
            <div class="vfio-spinner" aria-label="Loading"></div>
            <div class="vfio-status" data-status>Searching database…</div>
          </div>
        </div>

        <form data-form>
          <!-- STEP 1: EMAIL ONLY (label removed) -->
          <div class="form-group" data-email-group>
            <input id="vfio-email" name="email" type="email" autocomplete="email" placeholder="Enter your email" required />
          </div>

          <!-- MATCHED USER DISPLAY -->
          <div class="vfio-info" data-who>
            <div class="vfio-who" data-name>Welcome back</div>
            <div class="vfio-who-sub" data-username></div>
          </div>

          <!-- STEP 2: MESSAGE (label removed) -->
          <div class="reveal" data-reveal>
            <div class="form-group">
              <textarea id="vfio-message" name="message" placeholder="How can we help?"></textarea>
            </div>
          </div>

          <button class="submit-btn" type="submit" data-submit>Continue</button>
          <div class="vfio-error" data-error></div>
        </form>
      </div>
    `

    const form = container.querySelector('[data-form]')
    const overlay = container.querySelector('[data-overlay]')
    const statusEl = container.querySelector('[data-status]')
    const errorEl = container.querySelector('[data-error]')
    const submitBtn = container.querySelector('[data-submit]')

    const emailInput = container.querySelector('#vfio-email')
    const messageInput = container.querySelector('#vfio-message')

    const whoBox = container.querySelector('[data-who]')
    const nameEl = container.querySelector('[data-name]')
    const usernameEl = container.querySelector('[data-username]')
    const revealWrap = container.querySelector('[data-reveal]')

    const completeFlow = (payload) => {
      window.voiceflow?.chat?.interact({
        type: 'complete',
        payload,
      })
    }

    const setLoading = (isLoading, msg = 'Searching database…') => {
      if (overlay) overlay.classList.toggle('show', !!isLoading)
      if (statusEl) statusEl.textContent = msg
      if (submitBtn) submitBtn.disabled = !!isLoading
    }

    const showError = (msg) => {
      console.warn('[VFI/O Support Form] error:', msg)
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

    const lockForm = () => {
      console.log('[VFI/O Support Form] locking form')
      submitBtn.disabled = true
      emailInput.disabled = true
      if (messageInput) messageInput.disabled = true
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
          `Missing Airtable token. Set window["${tokenKey}"] or pass airtable.token in payload.`
        )
      }

      const safeEmail = String(email).replace(/"/g, '\\"')
      const formula = `{${EMAIL_FIELD}}="${safeEmail}"`
      const url = `https://api.airtable.com/v0/${encodeURIComponent(
        baseId
      )}/${encodeURIComponent(tableName)}?filterByFormula=${encodeURIComponent(
        formula
      )}`

      console.log('[VFI/O Support Form] Airtable request:', {
        baseId,
        tableName,
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
          `Airtable lookup failed (${res.status}). ${
            text ? `Response: ${text}` : ''
          }`
        )
      }

      const data = await res.json()
      const records = Array.isArray(data?.records) ? data.records : []
      console.log('[VFI/O Support Form] Airtable records:', records.length)
      return records
    }

    const setIdentityFromRecord = (record, emailUsed) => {
      const f = record?.fields || {}

      const Name = f[NAME_FIELD] ?? ''
      const Username = f[USERNAME_FIELD] ?? ''
      const Email = f[EMAIL_FIELD] ?? emailUsed ?? ''
      const Plan = f[PLAN_FIELD] ?? ''
      const Status = f[STATUS_FIELD] ?? ''

      vfIdentity = { Name, Username, Email, Plan, Status }
      console.log('[VFI/O Support Form] cached identity:', vfIdentity)
      return vfIdentity
    }

    const normalizeStatus = (s) => String(s || '').trim().toLowerCase()
    const isEligibleStatus = (statusValue) => {
      const s = normalizeStatus(statusValue)
      return s === 'active' || s === 'trial'
    }

    const showMatchedHeader = (vfPayload) => {
      const displayName = vfPayload.Name ? vfPayload.Name : 'Welcome back'
      const displayUser = vfPayload.Username ? `@${vfPayload.Username}` : ''
      if (nameEl) nameEl.textContent = displayName
      if (usernameEl) usernameEl.textContent = displayUser
      whoBox?.classList.add('show')
    }

    const revealMessageUI = () => {
      revealWrap?.classList.add('show')
      submitBtn.textContent = 'Submit Message'
      setTimeout(() => messageInput?.focus?.(), 250)
    }

    const validateEmailStep = () => {
      clearError()
      markInvalid(emailInput, false)

      if (!emailInput.checkValidity()) {
        markInvalid(emailInput, true)
        showError('Please enter a valid email address.')
        return false
      }
      return true
    }

    const onSubmit = async (e) => {
      e.preventDefault()
      clearError()

      if (!matchedRecord) {
        console.log('[VFI/O Support Form] step 1 submit')
        if (!validateEmailStep()) return

        const email = emailInput.value.trim()
        tries += 1

        setLoading(true, 'Searching database…')

        try {
          const records = await airtableFindByEmail(email)
          setLoading(false)

          if (records.length > 0) {
            matchedRecord = records[0]
            console.log('[VFI/O Support Form] match found:', matchedRecord?.id)

            const vfPayload = setIdentityFromRecord(matchedRecord, email)
            showMatchedHeader(vfPayload)

            emailInput.disabled = true

            supportAllowed = isEligibleStatus(vfPayload.Status)
            console.log('[VFI/O Support Form] status eligibility:', {
              status: vfPayload.Status,
              supportAllowed,
            })

            if (!supportAllowed) {
              const payload = {
                ...(vfIdentity || {}),
                supportAllowed: false,
                outcome: 'ineligible',
                reason: 'status_not_eligible',
              }

              console.log('[VFI/O Support Form] ineligible — completing flow:', payload)
              completeFlow(payload)

              showError(
                'Unfortunately we cannot provide support as your subscription status is not eligible.'
              )
              lockForm()
              return
            }

            revealMessageUI()
            return
          }

          console.log('[VFI/O Support Form] no match for email:', email)

          if (tries < 2) {
            showError('We couldn't match that email to our records. Please try again.')
            markInvalid(emailInput, true)
            emailInput.focus()
            emailInput.select?.()
            return
          }

          const payload = {
            Email: email,
            supportAllowed: false,
            outcome: 'no_match',
            reason: 'email_not_found_twice',
          }

          console.log('[VFI/O Support Form] no match twice — completing flow:', payload)
          completeFlow(payload)

          showError(
            'Unfortunately we cannot provide support as we cannot match your email to any of our records.'
          )
          lockForm()
          return
        } catch (err) {
          setLoading(false)
          showError(
            err?.message ||
              'Something went wrong while searching our database. Please try again.'
          )
          return
        }
      }

      console.log('[VFI/O Support Form] step 2 submit (message)')

      if (!supportAllowed) {
        const payload = {
          ...(vfIdentity || {}),
          supportAllowed: false,
          outcome: 'ineligible',
          reason: 'status_not_eligible',
        }
        console.log('[VFI/O Support Form] ineligible (step2 guard) — completing flow:', payload)
        completeFlow(payload)

        showError(
          'Unfortunately we cannot provide support as your subscription status is not eligible.'
        )
        lockForm()
        return
      }

      const Message = (messageInput.value || '').trim()

      const payload = {
        ...(vfIdentity || {}),
        Message,
        supportAllowed: true,
        outcome: 'message_submitted',
        reason: 'ok',
      }

      console.log('[VFI/O Support Form] message submit — completing flow:', payload)
      completeFlow(payload)

      submitBtn.textContent = 'Submitted'
      lockForm()
    }

    form.addEventListener('submit', onSubmit)
    element.appendChild(container)

    return () => {
      console.log('[VFI/O Support Form] teardown')
      form.removeEventListener('submit', onSubmit)
      container.remove()
    }
  },
}

export default VFIOFormExtension

export const HideInputExtension = {
  name: "HideInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_hide_input" || trace.payload?.name === "ext_hide_input",
  effect: ({ trace }) => {
    console.log("🔹 HideInputExtension triggered", trace);

    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      const shadowRoot = chatDiv.shadowRoot;
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = "none";
        console.log("✅ vfrc-input-container hidden inside shadow root");
      } else {
        console.warn("⚠️ vfrc-input-container not found inside shadow root");
      }
    } else {
      console.warn("⚠️ voiceflow-chat or shadowRoot not found");
    }
  }
};

export const ShowInputExtension = {
  name: "ShowInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_show_input" || trace.payload?.name === "ext_show_input",
  effect: ({ trace }) => {
    console.log("🔹 ShowInputExtension triggered", trace);

    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      const shadowRoot = chatDiv.shadowRoot;
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = "";
        console.log("✅ vfrc-input-container is now visible again");
      } else {
        console.warn("⚠️ vfrc-input-container not found inside shadow root");
      }
    } else {
      console.warn("⚠️ voiceflow-chat or shadowRoot not found");
    }
  }
};

export const SendingEmailExtension = {
  name: 'SendingEmail',
  type: 'response',

  match: ({ trace }) => trace.type === 'ext_sending_email',

  render: ({ trace, element }) => {
    const style = document.createElement('style');
    style.textContent = `
      .email-loader {
        width: fit-content;
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        clip-path: inset(0 3ch 0 0);
        animation: emailL4 1s steps(4) infinite;
        padding: 8px 4px;
        color: #333;
      }
      .email-loader:before {
        content: "Sending email...";
      }
      @keyframes emailL4 {
        to { clip-path: inset(0 -1ch 0 0); }
      }
      .email-loader-done {
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        font-weight: bold;
        padding: 8px 4px;
        color: #2e7d32;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    const loader = document.createElement('div');
    loader.className = 'email-loader';
    container.appendChild(loader);
    element.appendChild(container);

    setTimeout(() => {
      loader.classList.remove('email-loader');
      loader.classList.add('email-loader-done');
      loader.textContent = '✅ Email sent!';

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {}
      });
    }, 3000);
  }
};
