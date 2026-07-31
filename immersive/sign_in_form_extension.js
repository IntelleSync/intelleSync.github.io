/**
 * Voiceflow Custom Extensions: Core4 & Essentia Onboarding Flow
 * --------------------------------------------------------------
 * Visually matches the GHL "Core4 & Essentia Onboarding" form
 * (white card, Inter font, dark rounded submit button).
 *
 * This flow is split into TWO extension screens so the GHL contact
 * lookup by email happens server-side in the Voiceflow diagram
 * (via your existing API/Integration step), never in the browser.
 * That keeps your GHL API key out of client-side code entirely.
 *
 * SCREEN 1 — SignInFormExtension (trigger: "ext_signInForm")
 *   Collects: First Name, Last Name, Email
 *   On submit -> sets: first_name, last_name, email
 *   Your diagram then runs the GHL contact-search-by-email step and
 *   should set a `found_phone` variable:
 *     - full E.164 number (e.g. "+15205040001") if a match with a
 *       phone on file was found
 *     - empty string / null if no match or no phone on file
 *
 * SCREEN 2 — PhoneConfirmExtension (trigger: "ext_phoneConfirm")
 *   Pass `found_phone` in via the trace payload, e.g.:
 *     { "name": "ext_phoneConfirm", "found_phone": "{{found_phone}}" }
 *
 *   Behavior:
 *     - Step 1: always asks the delivery-method question (SMS / Email
 *       checkboxes) first, with a "Continue" button.
 *     - Step 2 (only if SMS was selected):
 *         - If found_phone is present: asks "We found a number ending in
 *           ****1234 — use this number?" Yes/No.
 *             - Yes -> uses that number, skips to submit
 *             - No  -> reveals the "+"-prefixed phone input
 *         - If found_phone is empty: shows the phone input directly
 *     - If only Email was selected: no phone step at all — submits
 *       immediately after Continue.
 *
 *   On final submit -> sets: phone (digits only, no leading "+" —
 *   empty string if not applicable — GHL adds the "+" automatically
 *   on its end), and exactly ONE of:
 *     - send_sms    (SMS only)
 *     - send_email  (Email only)
 *     - send_both   (both SMS and Email)
 *
 * SETUP IN VOICEFLOW:
 * 1. Add two "Custom Action" steps to your diagram, one after the
 *    other (with your GHL search step in between), with trace
 *    payload `name` set to "ext_signInForm" and "ext_phoneConfirm"
 *    respectively.
 * 2. Register both extensions in your Voiceflow web/react chat widget:
 *
 *      import { SignInFormExtension, PhoneConfirmExtension } from './sign-in-form-extension.js';
 *
 *      voiceflow.chat.load({
 *        // ...
 *        render: {
 *          extensions: [SignInFormExtension, PhoneConfirmExtension],
 *        },
 *      });
 *
 * 3. Make sure first_name, last_name, email, phone, found_phone,
 *    send_sms, send_email, and send_both all exist as variables in
 *    your Voiceflow project so your Code steps can assign to them.
 */

// Shared styling used by both screens, kept as a single string so the
// two extensions look identical without duplicating the CSS by hand.
const CORE4_STYLES = `
  <style>
    .core4-form-wrap {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 480px;
      width: 100%;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #FFFFFF;
      border-radius: 8px;
      box-shadow: 0px 4px 4px 0px rgba(87, 100, 126, 0.21);
      padding: 24px 24px 20px 24px;
      box-sizing: border-box;
    }
    .core4-form-wrap * {
      box-sizing: border-box;
    }
    .core4-form-heading {
      text-align: center;
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #000000;
      margin: 0 0 16px 0;
    }
    .core4-field-group {
      margin-bottom: 14px;
    }
    .core4-label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #2c3345;
      margin-bottom: 6px;
    }
    .core4-label .req {
      color: #2c3345;
    }
    .core4-input {
      width: 100%;
      background-color: #FFFFFF;
      color: #2c3345;
      border: 1px solid #ACACAC;
      border-radius: 5px;
      padding: 8px 15px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 300;
      outline: none;
    }
    .core4-input::placeholder {
      color: #8c8c8c;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 300;
    }
    .core4-input:focus {
      border-color: #188bf6;
    }
    .core4-input.core4-error {
      border-color: #e25950;
    }
    .core4-error-msg {
      color: #e25950;
      font-size: 12px;
      margin-top: 4px;
      display: none;
    }
    .core4-error-msg.show {
      display: block;
    }
    .core4-submit-btn {
      width: 100%;
      background: #101828;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      margin-top: 8px;
      box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.08);
      cursor: pointer;
    }
    .core4-submit-btn span {
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
    }
    .core4-submit-btn:hover {
      opacity: 0.92;
    }
    .core4-submit-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .core4-checkbox-question {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #2c3345;
      margin: 0 0 8px 0;
    }
    .core4-checkbox-row {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }
    .core4-checkbox-option {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #ACACAC;
      border-radius: 8px;
      padding: 8px 14px;
      cursor: pointer;
      flex: 1;
    }
    .core4-checkbox-option input {
      width: 16px;
      height: 16px;
      accent-color: #101828;
      cursor: pointer;
    }
    .core4-checkbox-option span {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #2c3345;
    }
    .core4-confirm-text {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #2c3345;
      margin: 0 0 12px 0;
    }
    .core4-confirm-row {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }
    .core4-confirm-btn {
      flex: 1;
      border-radius: 8px;
      padding: 10px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .core4-confirm-btn.yes {
      background: #101828;
      border: none;
      color: #FFFFFF;
    }
    .core4-confirm-btn.yes:hover {
      opacity: 0.92;
    }
    .core4-confirm-btn.no {
      background: #FFFFFF;
      border: 1px solid #ACACAC;
      color: #2c3345;
    }
    .core4-confirm-btn.no:hover {
      background: #f5f5f5;
    }
    .core4-hidden {
      display: none !important;
    }
  </style>
`;

// ---------------------------------------------------------------------
// SCREEN 1: First Name / Last Name / Email
// ---------------------------------------------------------------------
export const SignInFormExtension = {
  name: 'SignInForm',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_signInForm' ||
    trace.payload?.name === 'ext_signInForm',

  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const heading = payload.heading || 'Immersive Visualization';
    const submitLabel = payload.submitLabel || 'Get Started';

    const wrapper = document.createElement('div');
    wrapper.className = 'core4-form-wrap';

    wrapper.innerHTML = `
      ${CORE4_STYLES}
      <div>
        <p class="core4-form-heading">${heading}</p>

        <form id="core4-form" novalidate>
          <div class="core4-field-group">
            <label class="core4-label" for="core4-first-name">First Name <span class="req">*</span></label>
            <input class="core4-input" type="text" id="core4-first-name" placeholder="First Name" required />
            <div class="core4-error-msg" id="core4-first-name-error">First name is required</div>
          </div>

          <div class="core4-field-group">
            <label class="core4-label" for="core4-last-name">Last Name <span class="req">*</span></label>
            <input class="core4-input" type="text" id="core4-last-name" placeholder="Last Name" required />
            <div class="core4-error-msg" id="core4-last-name-error">Last name is required</div>
          </div>

          <div class="core4-field-group">
            <label class="core4-label" for="core4-email">Email <span class="req">*</span></label>
            <input class="core4-input" type="email" id="core4-email" placeholder="Email" required />
            <div class="core4-error-msg" id="core4-email-error">A valid email is required</div>
          </div>

          <button type="submit" class="core4-submit-btn" id="core4-submit">
            <span>${submitLabel}</span>
          </button>
        </form>
      </div>
    `;

    element.appendChild(wrapper);

    const form = wrapper.querySelector('#core4-form');
    const firstNameInput = wrapper.querySelector('#core4-first-name');
    const lastNameInput = wrapper.querySelector('#core4-last-name');
    const emailInput = wrapper.querySelector('#core4-email');
    const submitBtn = wrapper.querySelector('#core4-submit');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const setFieldError = (input, errorId, show) => {
      input.classList.toggle('core4-error', show);
      wrapper.querySelector(`#${errorId}`).classList.toggle('show', show);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const first_name = firstNameInput.value.trim();
      const last_name = lastNameInput.value.trim();
      const email = emailInput.value.trim();

      let valid = true;

      setFieldError(firstNameInput, 'core4-first-name-error', !first_name);
      if (!first_name) valid = false;

      setFieldError(lastNameInput, 'core4-last-name-error', !last_name);
      if (!last_name) valid = false;

      const emailValid = !!email && isValidEmail(email);
      setFieldError(emailInput, 'core4-email-error', !emailValid);
      if (!emailValid) valid = false;

      if (!valid) return;

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Submitted';

      [firstNameInput, lastNameInput, emailInput].forEach((el) => (el.disabled = true));

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          first_name,
          last_name,
          email,
        },
      });
    });
  },
};

// ---------------------------------------------------------------------
// SCREEN 2: Phone confirmation/entry + delivery method checkboxes
// ---------------------------------------------------------------------
export const PhoneConfirmExtension = {
  name: 'PhoneConfirm',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_phoneConfirm' ||
    trace.payload?.name === 'ext_phoneConfirm',

  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const heading = payload.heading || 'Almost done!';
    const submitLabel = payload.submitLabel || 'Get Started';

    // The full number found in GHL for this contact (E.164, e.g. "+15205040001"),
    // or empty/null if no match or no phone on file.
    const foundPhoneRaw = (payload.found_phone || '').toString().trim();
    const hasFoundPhone = foundPhoneRaw.length >= 4;
    const digitsOnlyFound = foundPhoneRaw.replace(/\D/g, '');
    const last4 = digitsOnlyFound.slice(-4);

    const wrapper = document.createElement('div');
    wrapper.className = 'core4-form-wrap';

    wrapper.innerHTML = `
      ${CORE4_STYLES}
      <div>
        <p class="core4-form-heading">${heading}</p>

        <form id="core4-form" novalidate>

          <!-- Step 1: delivery method, always shown first -->
          <div class="core4-field-group" id="core4-delivery-group">
            <p class="core4-checkbox-question">How would you like your personalized immersive visualization delivered? <span class="req">*</span></p>
            <div class="core4-checkbox-row">
              <label class="core4-checkbox-option">
                <input type="checkbox" id="core4-delivery-sms" />
                <span>SMS</span>
              </label>
              <label class="core4-checkbox-option">
                <input type="checkbox" id="core4-delivery-email" />
                <span>Email</span>
              </label>
            </div>
            <div class="core4-error-msg" id="core4-delivery-error">Please select at least one delivery method</div>
            <button type="button" class="core4-submit-btn" id="core4-continue-btn" style="margin-top:14px;">
              <span>Continue</span>
            </button>
          </div>

          <!-- Step 2a: shown only if SMS is selected AND a phone number was found in GHL -->
          <div class="core4-field-group core4-hidden" id="core4-confirm-group">
            <p class="core4-confirm-text">We found a number ending in •••• ${last4} on file. Use this number?</p>
            <div class="core4-confirm-row">
              <button type="button" class="core4-confirm-btn yes" id="core4-confirm-yes">Yes, use it</button>
              <button type="button" class="core4-confirm-btn no" id="core4-confirm-no">No, enter a different number</button>
            </div>
          </div>

          <!-- Step 2b: shown only if SMS is selected AND no phone was found (or user chose "No" above) -->
          <div class="core4-field-group core4-hidden" id="core4-phone-group">
            <label class="core4-label" for="core4-phone">Phone <span class="req">*</span></label>
            <input class="core4-input" type="tel" id="core4-phone" placeholder="Phone" value="+" />
            <div class="core4-error-msg" id="core4-phone-error">A valid phone number is required</div>
          </div>

          <button type="submit" class="core4-submit-btn core4-hidden" id="core4-submit">
            <span>${submitLabel}</span>
          </button>
        </form>
      </div>
    `;

    element.appendChild(wrapper);

    const form = wrapper.querySelector('#core4-form');
    const deliveryGroup = wrapper.querySelector('#core4-delivery-group');
    const smsCheckbox = wrapper.querySelector('#core4-delivery-sms');
    const emailCheckbox = wrapper.querySelector('#core4-delivery-email');
    const continueBtn = wrapper.querySelector('#core4-continue-btn');
    const confirmGroup = wrapper.querySelector('#core4-confirm-group');
    const confirmYesBtn = wrapper.querySelector('#core4-confirm-yes');
    const confirmNoBtn = wrapper.querySelector('#core4-confirm-no');
    const phoneGroup = wrapper.querySelector('#core4-phone-group');
    const phoneInput = wrapper.querySelector('#core4-phone');
    const submitBtn = wrapper.querySelector('#core4-submit');

    // Tracks which number will actually be submitted (only relevant if SMS is chosen):
    // either the confirmed GHL number, or whatever the user types in the phone field.
    let chosenPhoneDigits = hasFoundPhone ? digitsOnlyFound : null;
    let smsRequired = false; // set once the user clicks Continue

    const isValidPhone = (value) => (value.match(/\d/g) || []).length >= 7;

    const revealSubmitStep = () => {
      submitBtn.classList.remove('core4-hidden');
    };

    // Step 1 -> Step 2: decide whether the phone step is needed at all
    continueBtn.addEventListener('click', () => {
      const smsChecked = smsCheckbox.checked;
      const emailChecked = emailCheckbox.checked;
      const deliverySelected = smsChecked || emailChecked;
      wrapper.querySelector('#core4-delivery-error').classList.toggle('show', !deliverySelected);
      if (!deliverySelected) return;

      smsRequired = smsChecked;

      // Lock in the delivery choice
      deliveryGroup.classList.add('core4-hidden');
      smsCheckbox.disabled = true;
      emailCheckbox.disabled = true;

      if (!smsRequired) {
        // Email only — no phone needed at all
        chosenPhoneDigits = null;
        revealSubmitStep();
        return;
      }

      // SMS selected — show the appropriate phone step
      if (hasFoundPhone) {
        confirmGroup.classList.remove('core4-hidden');
      } else {
        phoneGroup.classList.remove('core4-hidden');
        revealSubmitStep();
      }
    });

    if (hasFoundPhone) {
      confirmYesBtn.addEventListener('click', () => {
        chosenPhoneDigits = digitsOnlyFound;
        confirmGroup.classList.add('core4-hidden');
        phoneGroup.classList.add('core4-hidden');
        revealSubmitStep();
      });

      confirmNoBtn.addEventListener('click', () => {
        chosenPhoneDigits = null;
        confirmGroup.classList.add('core4-hidden');
        phoneGroup.classList.remove('core4-hidden');
        revealSubmitStep();
      });
    }

    // Keep a leading "+" pinned in the phone field and strip non-digits
    phoneInput.addEventListener('input', () => {
      const digitsOnly = phoneInput.value.slice(1).replace(/\D/g, '');
      phoneInput.value = '+' + digitsOnly;
    });

    phoneInput.addEventListener('keydown', (e) => {
      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        phoneInput.selectionStart <= 1 &&
        phoneInput.selectionEnd <= 1
      ) {
        e.preventDefault();
      }
    });

    const setFieldError = (input, errorId, show) => {
      input.classList.toggle('core4-error', show);
      wrapper.querySelector(`#${errorId}`).classList.toggle('show', show);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      // If the phone field is visible (SMS chosen, no confirmed number yet), validate it
      const phoneFieldVisible = !phoneGroup.classList.contains('core4-hidden');
      if (smsRequired && phoneFieldVisible) {
        // The "+" shown in the field is just a visual hint — GHL adds
        // the "+" automatically on its end, so we strip it before sending.
        const enteredPhone = phoneInput.value.replace(/^\+/, '').trim();
        const phoneValid = !!enteredPhone && isValidPhone(enteredPhone);
        setFieldError(phoneInput, 'core4-phone-error', !phoneValid);
        if (!phoneValid) {
          valid = false;
        } else {
          chosenPhoneDigits = enteredPhone;
        }
      }

      if (smsRequired && !chosenPhoneDigits) valid = false;

      if (!valid) return;

      const deliveryPayload = {};
      if (smsCheckbox.checked && emailCheckbox.checked) {
        deliveryPayload.send_both = true;
      } else if (smsCheckbox.checked) {
        deliveryPayload.send_sms = true;
      } else if (emailCheckbox.checked) {
        deliveryPayload.send_email = true;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Submitted';

      [phoneInput, confirmYesBtn, confirmNoBtn].forEach((el) => {
        if (el) el.disabled = true;
      });

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          phone: chosenPhoneDigits || '',
          ...deliveryPayload,
        },
      });
    });
  },
};

export const HideInputExtension = {
  name: "HideInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_hide_input" || trace.payload?.name === "ext_hide_input",
  effect: ({ trace }) => {
    console.log("🔹 HideInputExtension triggered", trace);

    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      const shadowRoot = chatDiv.shadowRoot;

      // Hide the text input container
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");
      if (inputContainer) {
        inputContainer.style.display = "none";
        console.log("✅ vfrc-input-container hidden inside shadow root");
      } else {
        console.warn("⚠️ vfrc-input-container not found inside shadow root");
      }

      // Hide the voice-mode (waveform) button separately — it's a sibling, not a child
      const voiceModeButton = shadowRoot.querySelector(".vfrc-chat-input__voice-mode");
      if (voiceModeButton) {
        voiceModeButton.style.display = "none";
        console.log("✅ voice-mode button hidden inside shadow root");
      } else {
        console.warn("⚠️ voice-mode button not found inside shadow root");
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

    // Get the Voiceflow chat container
    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      // Access the shadow root
      const shadowRoot = chatDiv.shadowRoot;

      // Find the input container inside the shadow DOM
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = ""; // Show input field
        console.log("✅ vfrc-input-container is now visible again");
      } else {
        console.warn("⚠️ vfrc-input-container not found inside shadow root");
      }

      // Find the voice-mode button inside the shadow DOM
      const voiceModeButton = shadowRoot.querySelector(".vfrc-chat-input__voice-mode");

      if (voiceModeButton) {
        voiceModeButton.style.display = ""; // Show voice-mode button
        console.log("✅ voice-mode button is now visible again");
      } else {
        console.warn("⚠️ voice-mode button not found inside shadow root");
      }
    } else {
      console.warn("⚠️ voiceflow-chat or shadowRoot not found");
    }
  }
};
