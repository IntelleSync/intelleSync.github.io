// VFI/O Airtable Support Gate Form (2-step + status gating)
// Labels removed — placeholders only
// Step 1 caches identity vars locally
// Step 2 sends full payload to Voiceflow

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

    try {
      element.style.width = '100%'
      element.style.maxWidth = '100%'
      element.style.boxSizing = 'border-box'
    } catch (e) {
      console.warn('[VFI/O Support Form] width styling failed', e)
    }

    const airtableCfg = trace?.payload?.airtable || {}
    const baseId = airtableCfg.baseId
    const tableName = airtableCfg.tableName
    const tokenSource = airtableCfg.tokenSource || 'window'
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

    let tries = 0
    let matchedRecord = null
    let supportAllowed = false
    let vfIdentity = null

    const container = document.createElement('div')
    container.className = 'vfio-form-root'

    container.innerHTML = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

      <style>
        ._16eqxif8 {
          display: block;
          padding: 0px;
        }

        .vfio-form-root { width:100%; max-width:100%; box-sizing:border-box; }

        .vfio-form-root .form-container {
          font-family:'Poppins',sans-serif;
          width:100%;
          padding:20px;
          border:1px solid #ccc;
          border-radius:8px;
          background:#f9f9f9;
          box-shadow:0 4px 6px rgba(0,0,0,0.1);
          position:relative;
          box-sizing:border-box;
        }

        .vfio-form-root input,
        .vfio-form-root textarea {
          width:100%;
          padding:14px;
          border:1px solid #ccc;
          border-radius:6px;
          font-size:15px;
          font-family:'Poppins',sans-serif;
          box-sizing:border-box;
          background:#fff;
          transition:border-color .15s ease, box-shadow .15s ease;
          margin-bottom:15px;
        }

        .vfio-form-root input:focus,
        .vfio-form-root textarea:focus {
          outline:none;
          border-color:#398CC4;
          box-shadow:0 0 0 2px rgba(57,140,196,.15);
        }

        .vfio-form-root textarea {
          min-height:120px;
          resize:vertical;
        }

        .invalid { border-color:red !important; }

        .submit-btn {
          background:#398CC4;
          color:white;
          border:none;
          padding:14px;
          cursor:pointer;
          border-radius:6px;
          font-size:15px;
          width:100%;
          font-weight:600;
          transition:.15s ease;
        }

        .submit-btn:hover { background:#2E719E; transform:translateY(-1px); }
        .submit-btn:disabled { opacity:.7; cursor:not-allowed; transform:none; }

        .vfio-overlay {
          position:absolute;
          inset:0;
          background:rgba(255,255,255,.85);
          display:none;
          align-items:center;
          justify-content:center;
          border-radius:8px;
          z-index:10;
        }

        .vfio-overlay.show { display:flex; }

        .vfio-spinner {
          width:36px;
          height:36px;
          border-radius:50%;
          border:4px solid rgba(0,0,0,.12);
          border-top-color:#398CC4;
          animation:spin .85s linear infinite;
        }

        @keyframes spin { to { transform:rotate(360deg); } }

        .vfio-error {
          margin-top:10px;
          padding:10px;
          border:1px solid rgba(255,0,0,.25);
          background:rgba(255,0,0,.06);
          border-radius:6px;
          font-size:14px;
          display:none;
        }
        .vfio-error.show { display:block; }

        .vfio-info {
          margin-bottom:12px;
          padding:12px;
          border:1px solid rgba(57,140,196,.25);
          background:rgba(57,140,196,.06);
          border-radius:8px;
          display:none;
        }
        .vfio-info.show { display:block; }

        .reveal {
          max-height:0;
          opacity:0;
          overflow:hidden;
          transition:max-height .4s ease, opacity .3s ease;
        }
        .reveal.show {
          max-height:400px;
          opacity:1;
        }
      </style>

      <div class="form-container">
        <div class="vfio-overlay" data-overlay>
          <div class="vfio-spinner"></div>
        </div>

        <form data-form>
          <input id="vfio-email" type="email" placeholder="Enter your email" required />

          <div class="vfio-info" data-who>
            <div data-name></div>
            <div data-username></div>
          </div>

          <div class="reveal" data-reveal>
            <textarea id="vfio-message" placeholder="How can we help?"></textarea>
          </div>

          <button class="submit-btn" type="submit" data-submit>Continue</button>
          <div class="vfio-error" data-error></div>
        </form>
      </div>
    `

    const form = container.querySelector('[data-form]')
    const overlay = container.querySelector('[data-overlay]')
    const errorEl = container.querySelector('[data-error]')
    const submitBtn = container.querySelector('[data-submit]')
    const emailInput = container.querySelector('#vfio-email')
    const messageInput = container.querySelector('#vfio-message')
    const whoBox = container.querySelector('[data-who]')
    const nameEl = container.querySelector('[data-name]')
    const usernameEl = container.querySelector('[data-username]')
    const revealWrap = container.querySelector('[data-reveal]')

    const setLoading = (state) => {
      overlay.classList.toggle('show', state)
      submitBtn.disabled = state
    }

    const showError = (msg) => {
      errorEl.textContent = msg
      errorEl.classList.add('show')
    }

    const clearError = () => errorEl.classList.remove('show')

    const normalizeStatus = (s) => String(s || '').trim().toLowerCase()
    const isEligibleStatus = (s) =>
      normalizeStatus(s) === 'active' || normalizeStatus(s) === 'trial'

    const airtableFindByEmail = async (email) => {
      const token = getAirtableToken()
      const formula = `{${EMAIL_FIELD}}="${email.replace(/"/g, '\\"')}"`
      const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(formula)}`
      const res = await fetch(url, {
        headers: { Authorization: \`Bearer \${token}\` },
      })
      const data = await res.json()
      return data.records || []
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      clearError()

      if (!matchedRecord) {
        if (!emailInput.checkValidity()) return showError('Enter valid email')

        tries++
        setLoading(true)

        try {
          const records = await airtableFindByEmail(emailInput.value.trim())
          setLoading(false)

          if (records.length) {
            matchedRecord = records[0]
            const f = matchedRecord.fields || {}

            vfIdentity = {
              Name: f[NAME_FIELD] || '',
              Username: f[USERNAME_FIELD] || '',
              Email: f[EMAIL_FIELD] || emailInput.value.trim(),
              Plan: f[PLAN_FIELD] || '',
              Status: f[STATUS_FIELD] || '',
            }

            nameEl.textContent = vfIdentity.Name
            usernameEl.textContent = vfIdentity.Username
              ? '@' + vfIdentity.Username
              : ''
            whoBox.classList.add('show')

            supportAllowed = isEligibleStatus(vfIdentity.Status)
            emailInput.disabled = true

            if (!supportAllowed) {
              showError(
                'Unfortunately we cannot provide support as your subscription status is not eligible.'
              )
              submitBtn.disabled = true
              return
            }

            revealWrap.classList.add('show')
            submitBtn.textContent = 'Submit Message'
            return
          }

          if (tries < 2) return showError('Email not found. Try again.')

          showError(
            'Unfortunately we cannot provide support as we cannot match your email to any of our records.'
          )
          submitBtn.disabled = true
        } catch (err) {
          setLoading(false)
          showError('Something went wrong. Please try again.')
        }
      } else {
        if (!supportAllowed) return

        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { ...vfIdentity, Message: messageInput.value.trim() },
        })

        submitBtn.textContent = 'Submitted'
        submitBtn.disabled = true
      }
    })

    element.appendChild(container)
  },
}

export default VFIOFormExtension

export const HideInputExtension = {
  name: "HideInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_hide_input" || trace.payload?.name === "ext_hide_input",
  effect: ({ trace }) => {
    console.log("ðŸ”¹ HideInputExtension triggered", trace);

    // Get the Voiceflow chat container
    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      // Access the shadow root
      const shadowRoot = chatDiv.shadowRoot;

      // Find the input container inside the shadow DOM
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = "none"; // Hide input field
        console.log("âœ… vfrc-input-container hidden inside shadow root");
      } else {
        console.warn("âš ï¸ vfrc-input-container not found inside shadow root");
      }
    } else {
      console.warn("âš ï¸ voiceflow-chat or shadowRoot not found");
    }
  }
};

export const ShowInputExtension = {
  name: "ShowInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_show_input" || trace.payload?.name === "ext_show_input",
  effect: ({ trace }) => {
    console.log("ðŸ”¹ ShowInputExtension triggered", trace);

    // Get the Voiceflow chat container
    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      // Access the shadow root
      const shadowRoot = chatDiv.shadowRoot;

      // Find the input container inside the shadow DOM
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = ""; // Show input field
        console.log("âœ… vfrc-input-container is now visible again");
      } else {
        console.warn("âš ï¸ vfrc-input-container not found inside shadow root");
      }
    } else {
      console.warn("âš ï¸ voiceflow-chat or shadowRoot not found");
    }
  }
};
