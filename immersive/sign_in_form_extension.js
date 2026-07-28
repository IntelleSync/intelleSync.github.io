/**
 * Voiceflow Custom Extension: Core4 & Essentia Onboarding Form
 * --------------------------------------------------------------
 * Visually matches the GHL "Core4 & Essentia Onboarding" form
 * (white card, Inter font, dark rounded submit button), minus
 * the header image (1c815971-15bc-46fb-81c7-e8661706d45d.png
 * excluded per request).
 *
 * On submit, sets these Voiceflow variables:
 *   - first_name
 *   - last_name
 *   - email
 *   - phone (digits only, no leading "+" — the "+" shown in the field
 *     is just a visual hint, since GHL adds it automatically on its end)
 *
 * Delivery method checkboxes (SMS / Email) map to exactly ONE of the
 * following boolean variables, depending on what's checked:
 *   - send_sms    (SMS only)
 *   - send_email  (Email only)
 *   - send_both   (both SMS and Email)
 * At least one option must be checked to submit the form.
 *
 * SETUP IN VOICEFLOW:
 * 1. Add a "Custom Action" / extension step to your diagram.
 * 2. Set the step's trace payload `name` to "ext_signInForm"
 *    (or update the `match` function below to fit your diagram).
 * 3. Register this extension in your Voiceflow web/react chat widget:
 *
 *      import { SignInFormExtension } from './sign-in-form-extension.js';
 *
 *      voiceflow.chat.load({
 *        // ...
 *        render: {
 *          extensions: [SignInFormExtension],
 *        },
 *      });
 *
 * 4. Downstream in the diagram, reference {first_name}, {last_name},
 *    {email}, {phone} as normal Voiceflow variables. Also make sure
 *    send_sms, send_email, and send_both exist as variables so your
 *    Code step can assign whichever one comes through in the payload.
 */

export const SignInFormExtension = {
  name: 'SignInForm',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_signInForm' ||
    trace.payload?.name === 'ext_signInForm',

  render: ({ trace, element }) => {
    // ---- Config pulled from the trace payload (with sensible defaults) ----
    const payload = trace.payload || {};
    const heading = payload.heading || 'Immersive Visualization';
    const submitLabel = payload.submitLabel || 'Get Started';

    // ---- Container ----
    const wrapper = document.createElement('div');
    wrapper.className = 'core4-form-wrap';

    wrapper.innerHTML = `
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
          margin-bottom: 8px;
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
      </style>

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

          <div class="core4-field-group">
            <label class="core4-label" for="core4-phone">Phone <span class="req">*</span></label>
            <input class="core4-input" type="tel" id="core4-phone" placeholder="Phone" value="+" required />
            <div class="core4-error-msg" id="core4-phone-error">A valid phone number is required</div>
          </div>

          <div class="core4-field-group">
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
    const phoneInput = wrapper.querySelector('#core4-phone');
    const smsCheckbox = wrapper.querySelector('#core4-delivery-sms');
    const emailCheckbox = wrapper.querySelector('#core4-delivery-email');
    const submitBtn = wrapper.querySelector('#core4-submit');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    // Accepts digits, spaces, +, -, (), with at least 7 digits overall
    const isValidPhone = (value) => (value.match(/\d/g) || []).length >= 7;

    // Keep a leading "+" pinned in the phone field and strip non-digits
    phoneInput.addEventListener('input', () => {
      let value = phoneInput.value;
      // Strip the leading "+" temporarily, remove all non-digit characters
      // from the rest, then re-attach a single leading "+"
      const digitsOnly = value.slice(1).replace(/\D/g, '');
      value = '+' + digitsOnly;
      phoneInput.value = value;
    });

    // Prevent the cursor/selection from deleting past the leading "+"
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

      const first_name = firstNameInput.value.trim();
      const last_name = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      // The "+" shown in the field is just a visual hint for the user —
      // GHL adds the "+" on its end, so we strip it before sending.
      const phone = phoneInput.value.replace(/^\+/, '').trim();

      let valid = true;

      setFieldError(firstNameInput, 'core4-first-name-error', !first_name);
      if (!first_name) valid = false;

      setFieldError(lastNameInput, 'core4-last-name-error', !last_name);
      if (!last_name) valid = false;

      const emailValid = !!email && isValidEmail(email);
      setFieldError(emailInput, 'core4-email-error', !emailValid);
      if (!emailValid) valid = false;

      const phoneValid = !!phone && isValidPhone(phone);
      setFieldError(phoneInput, 'core4-phone-error', !phoneValid);
      if (!phoneValid) valid = false;

      const smsChecked = smsCheckbox.checked;
      const emailChecked = emailCheckbox.checked;
      const deliverySelected = smsChecked || emailChecked;
      wrapper.querySelector('#core4-delivery-error').classList.toggle('show', !deliverySelected);
      if (!deliverySelected) valid = false;

      if (!valid) return;

      // Map the checkbox combination to a single delivery-method flag
      const deliveryPayload = {};
      if (smsChecked && emailChecked) {
        deliveryPayload.send_both = true;
      } else if (smsChecked) {
        deliveryPayload.send_sms = true;
      } else if (emailChecked) {
        deliveryPayload.send_email = true;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Submitted';

      // Disable the form so it can't be resubmitted
      [firstNameInput, lastNameInput, emailInput, phoneInput, smsCheckbox, emailCheckbox].forEach(
        (el) => (el.disabled = true)
      );

      // Send the captured values back into Voiceflow as variables
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          first_name,
          last_name,
          email,
          phone,
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
