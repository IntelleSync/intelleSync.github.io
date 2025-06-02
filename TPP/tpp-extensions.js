window.vf_done = false

export const ProgressBar = {
  name: 'progress-bar',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'progress-bar_show' || trace.type === 'progress-bar_hide' || 
    trace.payload?.name === 'progress-bar_show' || trace.payload?.name === 'progress-bar_hide',

  render: ({ trace, element }) => {
    console.log('[ProgressBarExtension] rendering:', trace.payload?.name);

    const existing = document.getElementById('vf-progress-bar');
    if (existing) existing.remove(); // clean up if already exists

    if (trace.payload?.name === 'progress-bar_hide') {
      console.log('[ProgressBarExtension] Hiding progress bar');
      return;
    }

    const bar = document.createElement('div');
    bar.id = 'vf-progress-bar';
    bar.className = 'progress';

    bar.innerHTML = `
      <style>
        .progress {
          height: 4.5px;
          width: 145.6px;
          background: linear-gradient(#474bff 0 0),
                      linear-gradient(#474bff 0 0),
                      #dbdcef;
          background-size: 60% 100%;
          background-repeat: no-repeat;
          animation: progress-7x9cg2 3s infinite;
        }

        @keyframes progress-7x9cg2 {
          0% {
            background-position: -150% 0, -150% 0;
          }
          66% {
            background-position: 250% 0, -150% 0;
          }
          100% {
            background-position: 250% 0, 250% 0;
          }
        }
      </style>
    `;

    element.appendChild(bar);
  },
}

export const RegistrationVerifiedExtension = {
  name: 'RegistrationVerified',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_registrationVerified' ||
    trace.payload?.name === 'ext_registrationVerified',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    window.vf_done = true
    await new Promise((resolve) => setTimeout(resolve, 250))
    
    // Get custom text or use default
    const text = trace.payload?.text || 'Registration Verified!'
    const delay = trace.payload?.delay || 5000
    
    const verifiedContainer = document.createElement('div')
    verifiedContainer.innerHTML = `
      <style>
        .vfrc-message--extension-RegistrationVerified {
          background-color: transparent !important;
          background: none !important;
        }
        
        .verified-animation-container {
          font-family: Montserrat, Poppins, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #333;
          display: flex;
          flex-direction: row;
          align-items: left;
          justify-content: flex-start;
        }
        
        .verified-text {
          margin-left: 20px;
          opacity: 0;
          transition: opacity 0.5s ease-in;
        }
        
        .verified-text.show {
          opacity: 1;
        }
        
        /* Checkmark animation CSS */
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #7ac142;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .checkmark {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          margin: 0 auto;
          box-shadow: inset 0px 0px 0px #7ac142;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #7ac142;
          }
        }
      </style>
      <div class="verified-animation-container">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <div class="verified-text">${text}</div>
      </div>
    `
    
    element.appendChild(verifiedContainer)
    
    // Show text after the checkmark animation completes
    setTimeout(() => {
      const textElement = verifiedContainer.querySelector('.verified-text')
      textElement.classList.add('show')
      
      // Wait for text fade-in to complete (500ms) before continuing
      setTimeout(() => {
        window.voiceflow.chat.interact({
          type: 'continue',
        })
      }, 600)
    }, 1200) // Timing set to show after checkmark animation finishes
    
    // Continue the conversation flow without removing the animation
    window.vf_done = false
  },
}

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
