/**
 * Voiceflow Custom Extension: Core4 & Essentia Onboarding Form
 * --------------------------------------------------------------
 * Visually matches the GHL "Core4 & Essentia Onboarding" form
 * (white card, Inter font, dark rounded submit button), minus
 * the header image (1c815971-15bc-46fb-81c7-e8661706d45d.png
 * excluded per request).
 *
 * On submit, sets three Voiceflow variables:
 *   - first_name
 *   - last_name
 *   - email
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
 *    {email} as normal Voiceflow variables.
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
    const heading = payload.heading || 'Core4 & Essentia Onboarding';
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
      submitBtn.querySelector('span').textContent = 'Submitting...';

      // Disable the form so it can't be resubmitted
      [firstNameInput, lastNameInput, emailInput].forEach((el) => (el.disabled = true));

      // Send the captured values back into Voiceflow as variables
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
