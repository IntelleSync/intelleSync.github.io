const SVG_Thumb = `<svg width="24px" height="24px" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29398 20.4966C4.56534 20.4966 4 19.8827 4 19.1539V12.3847C4 11.6559 4.56534 11.042 5.29398 11.042H8.12364L10.8534 4.92738C10.9558 4.69809 11.1677 4.54023 11.4114 4.50434L11.5175 4.49658C12.3273 4.49658 13.0978 4.85402 13.6571 5.48039C14.2015 6.09009 14.5034 6.90649 14.5034 7.7535L14.5027 8.92295L18.1434 8.92346C18.6445 8.92346 19.1173 9.13931 19.4618 9.51188L19.5612 9.62829C19.8955 10.0523 20.0479 10.6054 19.9868 11.1531L19.1398 18.742C19.0297 19.7286 18.2529 20.4966 17.2964 20.4966H8.69422H5.29398ZM11.9545 6.02658L9.41727 11.7111L9.42149 11.7693L9.42091 19.042H17.2964C17.4587 19.042 17.6222 18.8982 17.6784 18.6701L17.6942 18.5807L18.5412 10.9918C18.5604 10.8194 18.5134 10.6486 18.4189 10.5287C18.3398 10.4284 18.2401 10.378 18.1434 10.378H13.7761C13.3745 10.378 13.0488 10.0524 13.0488 9.65073V7.7535C13.0488 7.2587 12.8749 6.78825 12.5721 6.44915C12.4281 6.28794 12.2615 6.16343 12.0824 6.07923L11.9545 6.02658ZM7.96636 12.4966H5.45455V19.042H7.96636V12.4966Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29398 20.4966C4.56534 20.4966 4 19.8827 4 19.1539V12.3847C4 11.6559 4.56534 11.042 5.29398 11.042H8.12364L10.8534 4.92738C10.9558 4.69809 11.1677 4.54023 11.4114 4.50434L11.5175 4.49658C12.3273 4.49658 13.0978 4.85402 13.6571 5.48039C14.2015 6.09009 14.5034 6.90649 14.5034 7.7535L14.5027 8.92295L18.1434 8.92346C18.6445 8.92346 19.1173 9.13931 19.4618 9.51188L19.5612 9.62829C19.8955 10.0523 20.0479 10.6054 19.9868 11.1531L19.1398 18.742C19.0297 19.7286 18.2529 20.4966 17.2964 20.4966H8.69422H5.29398ZM11.9545 6.02658L9.41727 11.7111L9.42149 11.7693L9.42091 19.042H17.2964C17.4587 19.042 17.6222 18.8982 17.6784 18.6701L17.6942 18.5807L18.5412 10.9918C18.5604 10.8194 18.5134 10.6486 18.4189 10.5287C18.3398 10.4284 18.2401 10.378 18.1434 10.378H13.7761C13.3745 10.378 13.0488 10.0524 13.0488 9.65073V7.7535C13.0488 7.2587 12.8749 6.78825 12.5721 6.44915C12.4281 6.28794 12.2615 6.16343 12.0824 6.07923L11.9545 6.02658ZM7.96636 12.4966H5.45455V19.042H7.96636V12.4966Z" fill="currentColor"></path></svg>`

window.vf_done = false

export const PrivacyPolicyExtension = {
  name: 'PrivacyPolicy',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_privacyPolicy' ||
    trace.payload?.name === 'ext_privacyPolicy',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    // Create main container
    const privacyContainer = document.createElement('div');
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .vfrc-message--extension-PrivacyPolicy {
        background-color: transparent !important;
        background: none !important;
      }
      
      .privacy-container {
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 600px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      .policy-text {
        line-height: 1.5;
        margin-bottom: 16px;
      }
      
      .privacy-container.minimized {
        max-height: 40px;
        overflow: hidden;
        transition: max-height 0.5s ease-out;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .minimized-text {
        display: none;
        font-weight: 600;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      
      .minimized .minimized-text {
        display: flex;
      }
      
      /* Checkmark styles */
      .checkmark-container {
        display: inline-flex;
        margin-left: 8px;
        align-items: center;
        justify-content: center;
      }
      
      .checkmark {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: #fff;
        stroke-miterlimit: 10;
        box-shadow: inset 0px 0px 0px #7ac142;
        animation: check-fill .4s ease-in-out .4s forwards, check-scale .3s ease-in-out .9s both;
        opacity: 0;
        transform: scale(0);
        position: relative;
        top: 4px; /* Adjust this value to move the checkmark up or down */
      }
      
      .minimized .checkmark {
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.3s ease-in, transform 0.3s ease-in;
        transition-delay: 0.2s;
      }
      
      .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        stroke: #7ac142;
        fill: none;
        animation: check-stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      
      .checkmark-check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: check-stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      
      @keyframes check-stroke {
        100% { stroke-dashoffset: 0; }
      }
      
      @keyframes check-scale {
        0%, 100% { transform: none; }
        50% { transform: scale3d(1.1, 1.1, 1); }
      }
      
      @keyframes check-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #7ac142; }
      }
      
      .minimized .minimized-text {
        display: block;
      }
      
      .minimized .policy-text,
      .minimized .button-container {
        display: none;
      }
      
      .policy-text a {
        color: #0066cc;
        text-decoration: none;
      }
      
      .policy-text a:hover {
        text-decoration: underline;
      }
      
      .button-container {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        margin-bottom: 20px;
      }
      
      .accept-button {
        font-family: Montserrat, sans-serif;
        background-color: #000;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        width: 100%;
        max-width: 300px;
      }
      
      .accept-button:hover {
        background-color: #333;
      }
      
      .accept-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    `;
    
    // Create container for privacy policy
    const container = document.createElement('div');
    container.className = 'privacy-container';
    
    // Create minimized text element (initially hidden)
    const minimizedText = document.createElement('div');
    minimizedText.className = 'minimized-text';
    minimizedText.textContent = 'Privacy Policy Accepted';
    
    // Create checkmark SVG element
    const checkmarkContainer = document.createElement('div');
    checkmarkContainer.className = 'checkmark-container';
    
    const checkmarkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    checkmarkSvg.setAttribute('class', 'checkmark');
    checkmarkSvg.setAttribute('viewBox', '0 0 52 52');
    
    const checkmarkCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    checkmarkCircle.setAttribute('class', 'checkmark-circle');
    checkmarkCircle.setAttribute('cx', '26');
    checkmarkCircle.setAttribute('cy', '26');
    checkmarkCircle.setAttribute('r', '25');
    checkmarkCircle.setAttribute('fill', 'none');
    
    const checkmarkCheck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkmarkCheck.setAttribute('class', 'checkmark-check');
    checkmarkCheck.setAttribute('fill', 'none');
    checkmarkCheck.setAttribute('d', 'M14 27 L 22 35 L 38 15');
    
    checkmarkSvg.appendChild(checkmarkCircle);
    checkmarkSvg.appendChild(checkmarkCheck);
    checkmarkContainer.appendChild(checkmarkSvg);
    minimizedText.appendChild(checkmarkContainer);
    
    // Create policy text
    const policyText = document.createElement('div');
    policyText.className = 'policy-text';
    policyText.innerHTML = `JoJo is an AI assistant designed to help you find information about our website, registrations, and general inquiries. JoJo utilizes commercially available third-party large language models (LLMs) and is part of your customer service team but does not provide tax advice or professional guidance—-tax-related questions should be directed to a licensed tax professional.<br/><br/>For your protection, please do not share private information. Clicking 'Accept' enables this assistant feature and confirms your understanding and agreement that use of this feature is subject to the <a href="https://www.cpehours.com/privacy-policy/" target="_blank">Basics & Beyond Privacy Policy</a>`;
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    

    
    // Create accept button
    const acceptButton = document.createElement('button');
    acceptButton.className = 'accept-button';
    acceptButton.textContent = 'Accept';
    acceptButton.addEventListener('click', () => {
      // Disable the button
      acceptButton.disabled = true;
      acceptButton.textContent = 'Accepted';
      
      // Minimize the container
      container.classList.add('minimized');
      
      // Trigger continue interaction
      window.voiceflow.chat.interact({
        type: 'continue',
      });
    });
    
    // Add button to button container
    buttonContainer.appendChild(acceptButton);
    
    // Assemble everything
    container.appendChild(policyText);
    container.appendChild(buttonContainer);
    container.appendChild(minimizedText);
    
    privacyContainer.appendChild(styleEl);
    privacyContainer.appendChild(container);
    
    element.appendChild(privacyContainer);
    
    // Keep the notification visible until user accepts
    window.vf_done = false;
  },
};

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

export const NoRecordFoundExtension = {
  name: 'NoRecordFound',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_noRecordFound' ||
    trace.payload?.name === 'ext_noRecordFound',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    window.vf_done = true
    await new Promise((resolve) => setTimeout(resolve, 250))
    
    // Get custom text or use default
    const text = trace.payload?.text || 'No record found!'
    
    const notFoundContainer = document.createElement('div')
    notFoundContainer.innerHTML = `
      <style>
        .vfrc-message--extension-NoRecordFound {
          background-color: transparent !important;
          background: none !important;
        }
        
        .not-found-animation-container {
          font-family: Montserrat, Poppins;
          font-size: 14px;
          font-weight: 400;
          color: #333;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          padding: 0px;
        }
        
        .not-found-text {
          margin-left: 20px;
          opacity: 0;
          transition: opacity 0.5s ease-in;
        }
        
        .not-found-text.show {
          opacity: 1;
        }
        
        /* X-mark animation CSS */
        .xmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #e74c3c;
          fill: none;
          animation: x-stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .xmark {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          margin: 0 auto;
          box-shadow: inset 0px 0px 0px #e74c3c;
          animation: x-fill .4s ease-in-out .4s forwards, x-scale .3s ease-in-out .9s both;
        }
        
        .xmark__x {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: x-stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        @keyframes x-stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes x-scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        
        @keyframes x-fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #e74c3c;
          }
        }
      </style>
      <div class="not-found-animation-container">
        <svg class="xmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="xmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="xmark__x" fill="none" d="M16 16 L36 36 M36 16 L16 36"/>
        </svg>
        <div class="not-found-text">${text}</div>
      </div>
    `
    
    element.appendChild(notFoundContainer)
    
    // Show text after the x-mark animation completes
    setTimeout(() => {
      const textElement = notFoundContainer.querySelector('.not-found-text')
      textElement.classList.add('show')
      
      // Wait for text fade-in to complete (500ms) before continuing
      setTimeout(() => {
        window.voiceflow.chat.interact({
          type: 'continue',
        })
      }, 600)
    }, 1200) // Timing set to show after x-mark animation finishes
    
    // Keep animation visible (don't remove)
    window.vf_done = false
  },
}

export const ProgressBarExtension = {
  name: 'ProgressBar',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_progressBar' ||
    trace.payload?.name === 'ext_progressBar',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    // Get custom settings or use defaults
    const statusMessages = trace.payload?.statusMessages || [
      'Initializing Search...',
      'Connecting to Database...',
      'Fetching Results...',
      'Searching Match...'
    ];
    const duration = trace.payload?.duration || 4000; // 4 seconds by default
    const resultType = trace.payload?.resultType || 'success'; // 'success' or 'failure'
    const resultText = trace.payload?.resultText || 
      (resultType === 'success' ? 'Registration Verified!' : 'No record found!');
    
    // Console log for debugging
    console.log('Result type:', resultType);
    
    // Create main container
    const progressContainer = document.createElement('div');
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .vfrc-message--extension-ProgressBar {
        background-color: transparent !important;
        background: none !important;
      }
      
      .progress-container {
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 300px;
      }
      
      .status-wrapper {
        position: relative;
        height: 1.4em;
        margin-bottom: 8px;
      }
      
      .status-text {
        position: absolute;
        white-space: nowrap;
      }
      
      .progress-bar-wrapper {
        width: 300px; /* Fixed width */
      }
      
      .progress-bar {
        border-radius: 60px;
        overflow: hidden;
        width: 100%;
      }
      
      .bar {
        background: rgba(0,0,0,0.075);
      }
      
      .progress {
        animation: loader ${duration / 1000}s ease;
        background: #75b800;
        color: #fff;
        padding: 5px;
        width: 0;
      }
      
      @keyframes loader {
        0% { width: 0; }
        20% { width: 10%; }
        25% { width: 24%; }
        43% { width: 41%; }
        56% { width: 50%; }
        66% { width: 52%; }
        71% { width: 60%; }
        75% { width: 76%; }
        94% { width: 86%; }
        100% { width: 100%; }
      }
      
      /* Result animations */
      .result-container {
        display: none;
        flex-direction: row;
        align-items: center;
        margin-top: 12px;
        justify-content: flex-start;
      }
      
      .result-text {
        margin-left: 12px;
        opacity: 0;
        transition: opacity 0.5s ease-in;
        width: auto; /* Allow text to fit naturally */
        white-space: nowrap; /* Keep text on one line */
        overflow: visible; /* Ensure text isn't cut off */
      }
      
      .result-text.show {
        opacity: 1;
      }
      
      /* Animation styles */
      .success-circle, .failure-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      
      .success-circle {
        stroke: #7ac142;
      }
      
      .failure-circle {
        stroke: #e74c3c;
      }
      
      .success-mark, .failure-mark {
        width: 36px; /* Reduced size */
        height: 36px; /* Reduced size */
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: #fff;
        stroke-miterlimit: 10;
        flex-shrink: 0; /* Prevent shrinking */
        animation: scale .3s ease-in-out .9s both;
      }
      
      .success-mark {
        box-shadow: inset 0px 0px 0px #7ac142;
        animation: success-fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      
      .failure-mark {
        box-shadow: inset 0px 0px 0px #e74c3c;
        animation: failure-fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      
      .success-check, .failure-x {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      
      @keyframes stroke {
        100% { stroke-dashoffset: 0; }
      }
      
      @keyframes scale {
        0%, 100% { transform: none; }
        50% { transform: scale3d(1.1, 1.1, 1); }
      }
      
      @keyframes success-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #7ac142; }
      }
      
      @keyframes failure-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #e74c3c; }
      }
    `;
    
    // Create container for progress
    const container = document.createElement('div');
    container.className = 'progress-container';
    
    // Create wrapper for status text with fixed position
    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'status-wrapper';
    
    // Create status text
    const statusTextElement = document.createElement('div');
    statusTextElement.className = 'status-text';
    statusTextElement.textContent = statusMessages[0] || 'Initializing...';
    
    statusWrapper.appendChild(statusTextElement);
    
    // Create progress bar with explicitly fixed width
    const progressBarWrapper = document.createElement('div');
    progressBarWrapper.className = 'progress-bar-wrapper';
    
    const progressBarElement = document.createElement('div');
    progressBarElement.className = 'progress-bar';
    const barElement = document.createElement('div');
    barElement.className = 'bar';
    const progressElement = document.createElement('div');
    progressElement.className = 'progress';
    
    barElement.appendChild(progressElement);
    progressBarElement.appendChild(barElement);
    progressBarWrapper.appendChild(progressBarElement);
    
    barElement.appendChild(progressElement);
    progressBarElement.appendChild(barElement);
    
    // Create result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    
    // Create SVG for either success or failure
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 52 52');
    
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleElement.setAttribute('cx', '26');
    circleElement.setAttribute('cy', '26');
    circleElement.setAttribute('r', '25');
    circleElement.setAttribute('fill', 'none');
    
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('fill', 'none');
    
    // Set classes based on result type
    if (resultType === 'success') {
      svgElement.classList.add('success-mark');
      circleElement.classList.add('success-circle');
      pathElement.classList.add('success-check');
      pathElement.setAttribute('d', 'M14.1 27.2l7.1 7.2 16.7-16.8');
    } else {
      svgElement.classList.add('failure-mark');
      circleElement.classList.add('failure-circle');
      pathElement.classList.add('failure-x');
      pathElement.setAttribute('d', 'M16 16 L36 36 M36 16 L16 36');
    }
    
    svgElement.appendChild(circleElement);
    svgElement.appendChild(pathElement);
    
    // Create result text
    const resultTextElement = document.createElement('div');
    resultTextElement.className = 'result-text';
    resultTextElement.textContent = resultText;
    resultTextElement.style.marginLeft = '12px';
    
    // Assemble everything
    resultContainer.appendChild(svgElement);
    resultContainer.appendChild(resultTextElement);
    
    container.appendChild(statusWrapper);
    container.appendChild(progressBarWrapper);
    container.appendChild(resultContainer);
    
    progressContainer.appendChild(styleEl);
    progressContainer.appendChild(container);
    
    element.appendChild(progressContainer);
    
    // Update status text at different stages of the progress
    const statusInterval = duration / (statusMessages.length + 1);
    
    // Schedule status message updates
    statusMessages.forEach((message, index) => {
      setTimeout(() => {
        statusTextElement.textContent = message;
      }, statusInterval * (index + 1));
    });
    
    // After progress completes, show the result
    setTimeout(() => {
      // Hide the progress bar
      progressBarElement.style.display = 'none';
      statusTextElement.style.display = 'none';
      
      // Show the result container
      resultContainer.style.display = 'flex';
      
      // Show text after animation completes
      setTimeout(() => {
        resultTextElement.classList.add('show');
        
        // Wait for text fade-in to complete before continuing
        setTimeout(() => {
          window.voiceflow.chat.interact({
            type: 'continue',
          });
        }, 600);
      }, 1200);
    }, duration);
    
    // Keep the animation visible
    window.vf_done = false;
  },
};

export const ProgressBarExtension_failure = {
  name: 'ProgressBar',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_progressBar_failure' ||
    trace.payload?.name === 'ext_progressBar_failure',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    // Get custom settings or use defaults
    const statusMessages = trace.payload?.statusMessages || [
      'Initializing Search...',
      'Connecting to Database...',
      'Fetching Results...',
      'Searching Match...'
    ];
    const duration = trace.payload?.duration || 4000; // 4 seconds by default
    const resultType = trace.payload?.resultType || 'failure'; // 'success' or 'failure'
    const resultText = trace.payload?.resultText || 
      (resultType === 'success' ? 'Registration Verified!' : 'No record found!');
    
    // Console log for debugging
    console.log('Result type:', resultType);
    
    // Create main container
    const progressContainer = document.createElement('div');
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .vfrc-message--extension-ProgressBar {
        background-color: transparent !important;
        background: none !important;
      }
      
      .progress-container {
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 300px;
      }
      
      .status-wrapper {
        position: relative;
        height: 1.4em;
        margin-bottom: 8px;
      }
      
      .status-text {
        position: absolute;
        white-space: nowrap;
      }
      
      .progress-bar-wrapper {
        width: 300px; /* Fixed width */
      }
      
      .progress-bar {
        border-radius: 60px;
        overflow: hidden;
        width: 100%;
      }
      
      .bar {
        background: rgba(0,0,0,0.075);
      }
      
      .progress {
        animation: loader ${duration / 1000}s ease;
        background: #75b800;
        color: #fff;
        padding: 5px;
        width: 0;
      }
      
      @keyframes loader {
        0% { width: 0; }
        20% { width: 10%; }
        25% { width: 24%; }
        43% { width: 41%; }
        56% { width: 50%; }
        66% { width: 52%; }
        71% { width: 60%; }
        75% { width: 76%; }
        94% { width: 86%; }
        100% { width: 100%; }
      }
      
      /* Result animations */
      .result-container {
        display: none;
        flex-direction: row;
        align-items: center;
        margin-top: 12px;
        justify-content: flex-start;
      }
      
      .result-text {
        margin-left: 12px;
        opacity: 0;
        transition: opacity 0.5s ease-in;
        width: auto; /* Allow text to fit naturally */
        white-space: nowrap; /* Keep text on one line */
        overflow: visible; /* Ensure text isn't cut off */
      }
      
      .result-text.show {
        opacity: 1;
      }
      
      /* Animation styles */
      .success-circle, .failure-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      
      .success-circle {
        stroke: #7ac142;
      }
      
      .failure-circle {
        stroke: #e74c3c;
      }
      
      .success-mark, .failure-mark {
        width: 36px; /* Reduced size */
        height: 36px; /* Reduced size */
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: #fff;
        stroke-miterlimit: 10;
        flex-shrink: 0; /* Prevent shrinking */
        animation: scale .3s ease-in-out .9s both;
      }
      
      .success-mark {
        box-shadow: inset 0px 0px 0px #7ac142;
        animation: success-fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      
      .failure-mark {
        box-shadow: inset 0px 0px 0px #e74c3c;
        animation: failure-fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      
      .success-check, .failure-x {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      
      @keyframes stroke {
        100% { stroke-dashoffset: 0; }
      }
      
      @keyframes scale {
        0%, 100% { transform: none; }
        50% { transform: scale3d(1.1, 1.1, 1); }
      }
      
      @keyframes success-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #7ac142; }
      }
      
      @keyframes failure-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #e74c3c; }
      }
    `;
    
    // Create container for progress
    const container = document.createElement('div');
    container.className = 'progress-container';
    
    // Create wrapper for status text with fixed position
    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'status-wrapper';
    
    // Create status text
    const statusTextElement = document.createElement('div');
    statusTextElement.className = 'status-text';
    statusTextElement.textContent = statusMessages[0] || 'Initializing...';
    
    statusWrapper.appendChild(statusTextElement);
    
    // Create progress bar with explicitly fixed width
    const progressBarWrapper = document.createElement('div');
    progressBarWrapper.className = 'progress-bar-wrapper';
    
    const progressBarElement = document.createElement('div');
    progressBarElement.className = 'progress-bar';
    const barElement = document.createElement('div');
    barElement.className = 'bar';
    const progressElement = document.createElement('div');
    progressElement.className = 'progress';
    
    barElement.appendChild(progressElement);
    progressBarElement.appendChild(barElement);
    progressBarWrapper.appendChild(progressBarElement);
    
    barElement.appendChild(progressElement);
    progressBarElement.appendChild(barElement);
    
    // Create result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    
    // Create SVG for either success or failure
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 52 52');
    
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleElement.setAttribute('cx', '26');
    circleElement.setAttribute('cy', '26');
    circleElement.setAttribute('r', '25');
    circleElement.setAttribute('fill', 'none');
    
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('fill', 'none');
    
    // Set classes based on result type
    if (resultType === 'success') {
      svgElement.classList.add('success-mark');
      circleElement.classList.add('success-circle');
      pathElement.classList.add('success-check');
      pathElement.setAttribute('d', 'M14.1 27.2l7.1 7.2 16.7-16.8');
    } else {
      svgElement.classList.add('failure-mark');
      circleElement.classList.add('failure-circle');
      pathElement.classList.add('failure-x');
      pathElement.setAttribute('d', 'M16 16 L36 36 M36 16 L16 36');
    }
    
    svgElement.appendChild(circleElement);
    svgElement.appendChild(pathElement);
    
    // Create result text
    const resultTextElement = document.createElement('div');
    resultTextElement.className = 'result-text';
    resultTextElement.textContent = resultText;
    resultTextElement.style.marginLeft = '12px';
    
    // Assemble everything
    resultContainer.appendChild(svgElement);
    resultContainer.appendChild(resultTextElement);
    
    container.appendChild(statusWrapper);
    container.appendChild(progressBarWrapper);
    container.appendChild(resultContainer);
    
    progressContainer.appendChild(styleEl);
    progressContainer.appendChild(container);
    
    element.appendChild(progressContainer);
    
    // Update status text at different stages of the progress
    const statusInterval = duration / (statusMessages.length + 1);
    
    // Schedule status message updates
    statusMessages.forEach((message, index) => {
      setTimeout(() => {
        statusTextElement.textContent = message;
      }, statusInterval * (index + 1));
    });
    
    // After progress completes, show the result
    setTimeout(() => {
      // Hide the progress bar
      progressBarElement.style.display = 'none';
      statusTextElement.style.display = 'none';
      
      // Show the result container
      resultContainer.style.display = 'flex';
      
      // Show text after animation completes
      setTimeout(() => {
        resultTextElement.classList.add('show');
        
        // Wait for text fade-in to complete before continuing
        setTimeout(() => {
          window.voiceflow.chat.interact({
            type: 'continue',
          });
        }, 600);
      }, 1200);
    }, duration);
    
    // Keep the animation visible
    window.vf_done = false;
  },
};

export const SearchRecordsExtension = {
  name: 'ProgressBar',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_searchRecords' ||
    trace.payload?.name === 'ext_searchRecords',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    // Get custom settings or use defaults
    const statusMessages = trace.payload?.statusMessages || [
      'Initializing Search...',
      'Searching Database...',
      'Searching GoToWebinar...',
      'Fetching Results...',
      'Search Complete...'
    ];
    const duration = trace.payload?.duration || 4000; // 4 seconds by default
    const resultType = trace.payload?.resultType || 'success'; // 'success' or 'failure'
    const resultText = trace.payload?.resultText || 
      (resultType === 'success' ? 'Checks Complete!' : 'No record found!');
    
    // Console log for debugging
    console.log('Result type:', resultType);
    
    // Create main container
    const progressContainer = document.createElement('div');
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .vfrc-message--extension-ProgressBar {
        background-color: transparent !important;
        background: none !important;
      }
      
      .progress-container {
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 300px;
      }
      
      .status-wrapper {
        position: relative;
        height: 1.4em;
        margin-bottom: 8px;
      }
      
      .status-text {
        position: absolute;
        white-space: nowrap;
      }
      
      .progress-bar-wrapper {
        width: 300px; /* Fixed width */
      }
      
      .progress-bar {
        border-radius: 60px;
        overflow: hidden;
        width: 100%;
      }
      
      .bar {
        background: rgba(0,0,0,0.075);
      }
      
      .progress {
        animation: loader ${duration / 1000}s ease;
        background: #75b800;
        color: #fff;
        padding: 5px;
        width: 0;
      }
      
      @keyframes loader {
        0% { width: 0; }
        20% { width: 10%; }
        25% { width: 24%; }
        43% { width: 41%; }
        56% { width: 50%; }
        66% { width: 52%; }
        71% { width: 60%; }
        75% { width: 76%; }
        94% { width: 86%; }
        100% { width: 100%; }
      }
      
      /* Result animations */
      .result-container {
        display: none;
        flex-direction: row;
        align-items: center;
        margin-top: 12px;
        justify-content: flex-start;
      }
      
      .result-text {
        margin-left: 12px;
        opacity: 0;
        transition: opacity 0.5s ease-in;
        width: auto; /* Allow text to fit naturally */
        white-space: nowrap; /* Keep text on one line */
        overflow: visible; /* Ensure text isn't cut off */
      }
      
      .result-text.show {
        opacity: 1;
      }
      
      /* Animation styles */
      .success-circle, .failure-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      
      .success-circle {
        stroke: #7ac142;
      }
      
      .failure-circle {
        stroke: #e74c3c;
      }
      
      .success-mark, .failure-mark {
        width: 36px; /* Reduced size */
        height: 36px; /* Reduced size */
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: #fff;
        stroke-miterlimit: 10;
        flex-shrink: 0; /* Prevent shrinking */
        animation: scale .3s ease-in-out .9s both;
      }
      
      .success-mark {
        box-shadow: inset 0px 0px 0px #7ac142;
        animation: success-fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      
      .failure-mark {
        box-shadow: inset 0px 0px 0px #e74c3c;
        animation: failure-fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      
      .success-check, .failure-x {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      
      @keyframes stroke {
        100% { stroke-dashoffset: 0; }
      }
      
      @keyframes scale {
        0%, 100% { transform: none; }
        50% { transform: scale3d(1.1, 1.1, 1); }
      }
      
      @keyframes success-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #7ac142; }
      }
      
      @keyframes failure-fill {
        100% { box-shadow: inset 0px 0px 0px 30px #e74c3c; }
      }
    `;
    
    // Create container for progress
    const container = document.createElement('div');
    container.className = 'progress-container';
    
    // Create wrapper for status text with fixed position
    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'status-wrapper';
    
    // Create status text
    const statusTextElement = document.createElement('div');
    statusTextElement.className = 'status-text';
    statusTextElement.textContent = statusMessages[0] || 'Initializing...';
    
    statusWrapper.appendChild(statusTextElement);
    
    // Create progress bar with explicitly fixed width
    const progressBarWrapper = document.createElement('div');
    progressBarWrapper.className = 'progress-bar-wrapper';
    
    const progressBarElement = document.createElement('div');
    progressBarElement.className = 'progress-bar';
    const barElement = document.createElement('div');
    barElement.className = 'bar';
    const progressElement = document.createElement('div');
    progressElement.className = 'progress';
    
    barElement.appendChild(progressElement);
    progressBarElement.appendChild(barElement);
    progressBarWrapper.appendChild(progressBarElement);
    
    barElement.appendChild(progressElement);
    progressBarElement.appendChild(barElement);
    
    // Create result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    
    // Create SVG for either success or failure
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 52 52');
    
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleElement.setAttribute('cx', '26');
    circleElement.setAttribute('cy', '26');
    circleElement.setAttribute('r', '25');
    circleElement.setAttribute('fill', 'none');
    
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('fill', 'none');
    
    // Set classes based on result type
    if (resultType === 'success') {
      svgElement.classList.add('success-mark');
      circleElement.classList.add('success-circle');
      pathElement.classList.add('success-check');
      pathElement.setAttribute('d', 'M14.1 27.2l7.1 7.2 16.7-16.8');
    } else {
      svgElement.classList.add('failure-mark');
      circleElement.classList.add('failure-circle');
      pathElement.classList.add('failure-x');
      pathElement.setAttribute('d', 'M16 16 L36 36 M36 16 L16 36');
    }
    
    svgElement.appendChild(circleElement);
    svgElement.appendChild(pathElement);
    
    // Create result text
    const resultTextElement = document.createElement('div');
    resultTextElement.className = 'result-text';
    resultTextElement.textContent = resultText;
    resultTextElement.style.marginLeft = '12px';
    
    // Assemble everything
    resultContainer.appendChild(svgElement);
    resultContainer.appendChild(resultTextElement);
    
    container.appendChild(statusWrapper);
    container.appendChild(progressBarWrapper);
    container.appendChild(resultContainer);
    
    progressContainer.appendChild(styleEl);
    progressContainer.appendChild(container);
    
    element.appendChild(progressContainer);
    
    // Update status text at different stages of the progress
    const statusInterval = duration / (statusMessages.length + 1);
    
    // Schedule status message updates
    statusMessages.forEach((message, index) => {
      setTimeout(() => {
        statusTextElement.textContent = message;
      }, statusInterval * (index + 1));
    });
    
    // After progress completes, show the result
    setTimeout(() => {
      // Hide the progress bar
      progressBarElement.style.display = 'none';
      statusTextElement.style.display = 'none';
      
      // Show the result container
      resultContainer.style.display = 'flex';
      
      // Show text after animation completes
      setTimeout(() => {
        resultTextElement.classList.add('show');
        
        // Wait for text fade-in to complete before continuing
        setTimeout(() => {
          window.voiceflow.chat.interact({
            type: 'continue',
          });
        }, 600);
      }, 1200);
    }, duration);
    
    // Keep the animation visible
    window.vf_done = false;
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

export const SearchBarExtension = {
  name: 'search_bar',
  type: 'response',
  match: ({ trace }) => trace.type === 'search_bar' || trace.payload?.name === 'search_bar',
  render: ({ trace, element }) => {
    // Predefined list of topics
    const predefinedResults = [
      "Calculating DSUE and Gift Taxes on Form 706",
      "Related Party Transactions",
      "Divorce and its Various Tax Implications",
      "Reporting Excess Gift Taxes on Form 709",
      "How the IRS Reconstructs Income in Tax Fraud Cases",
      "Secure Act 1.0 & 2.0 Hot Topics: Part 1",
      "Casualty and Theft #1 Introduction for Individual Losses",
      "Casualty and Theft #2 Introduction for Business Losses",
      "Casualty and Theft Case Study Individual",
      "Casualty and Theft Case Study Business",
      "Casualty and Theft Odds and Ends",
      "Form 1099-MISC and 1099-NEC for 2025",
      "Ethics: Part 1",
      "Ethics: Part 2",
      "Quarterly Tax Update 2025: Part 1",
      "Ministers/Amish/Mennonite Tax Issues",
      "S-Corporation Basis and Form 7203",
      "Update on Marijuana Tax Issues",
      "Form 706 / 709 Unlock - Estate Planning and Portability",
      "Charitable Contributions Compliance",
      "Ethics: Part 3",
      "Ethics: Part 4",
      "Employment Taxes and the Trust Fund Recovery Penalty",
      "Estates & Trusts",
      "There is a Form for That â€“ Explore IRS Forms You May Not Know Exist",
      "Tax-exempt Organizations",
      "IRS issued 'B' and 'C' Notices - What you need to know & How to fix",
      "Impact on Expiring Tax Provisions â€“ TCJA",
      "Farm Rentals",
      "Quarterly Tax Update 2025: Part 2",
      "Residential Complications",
      "IRS Streamlined Procedures and the Nonwillful Certification",
      "Tax Research Strategies",
      "Amended vs Superceded Returns",
      "Fall Topical Federal Tax Update (Seminar)",
      "Charitable Gifting",
      "IRS Collection Due Process Procedures",
      "Tax Issues surrounding Sale of Fixed Assets",
      "From Summonses to International Evidence Gathering Techniques - How the IRS Gathers Evidence in the 21st Century",
      "Form 1041 Compliance Review and Planning: Part 1",
      "Form 1041 Compliance Review and Planning: Part 2",
      "Turning Theory into Practice - Estates and Trusts",
      "Clean Vehicle Credits â€“ Purchasing Credits Limitations and Rules",
      "Secure Act 1.0 & 2.0 Hot Topics: Part 2",
      "Is that Worker an Employee? Questions and Answers on Worker Classification",
      "Quarterly Tax Update: Part 3",
      "Business Energy Incentives Update",
      "Fraud Technical Advisors: An End-Run Around the Case of Tweel?",
      "Year-End Federal Tax Update (Seminar)",
      "Quarterly Tax Update: Part 4",
      "Ethics: Part 3",
      "Ethics: Part 4"
    ];

    // Create search bar container
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .search-container {
          position: relative;
          width: 100%;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .vfrc-message--extension-search_bar {
          background-color: #FFFFFF;  
        }
        .search-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .dropdown {
          position: absolute;
          width: 100%;
          background: white;
          border: 1px solid #ccc;
          border-bottom: none;
          max-height: 150px;
          overflow-y: auto;
          bottom: 40px; /* Moves the dropdown above the search bar */
          display: none;
          z-index: 10;
        }
        .dropdown div {
          padding: 8px;
          cursor: pointer;
        }
        .dropdown div:hover {
          background: #f0f0f0;
        }
        
        ._1ddzqsn8 {
          display: block;
        }
    
        ._1ddzqsn7 {
          display: block;
          box-sizing: border-box;
          padding: 10px 14px;
          border-radius: 10px;
          overflow-wrap: anywhere;
          color: #000;
          background-color: #f4f4f4;
        }
        .disabled {
          background-color: #e0e0e0;
          cursor: not-allowed;
        }
      </style>

      <div class="search-container">
        <input type="text" class="search-input" placeholder="Start typing to search Webinars...">
        <div class="dropdown"></div>
      </div>
    `;

    // Append to chat element
    element.appendChild(container);

    // Get elements
    const searchInput = container.querySelector('.search-input');
    const dropdown = container.querySelector('.dropdown');

    // Handle input typing
    searchInput.addEventListener('input', () => {
      if (searchInput.disabled) return;

      const query = searchInput.value.toLowerCase();
      dropdown.innerHTML = ''; // Clear previous results

      if (query.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      const filteredResults = predefinedResults.filter(item =>
        item.toLowerCase().includes(query)
      );

      if (filteredResults.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      filteredResults.forEach(item => {
        const option = document.createElement('div');
        option.textContent = item;
        option.classList.add('_1ddzqsn7'); // Apply custom styling

        option.addEventListener('click', () => {
          searchInput.value = item;
          dropdown.style.display = 'none';

          // Disable input after selection
          searchInput.disabled = true;
          searchInput.classList.add('disabled');

          // Correctly formatted payload with no undefined errors
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: { user_webinar_choice: item }
          });

        });

        dropdown.appendChild(option);
      });

      dropdown.style.display = 'block';
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!container.contains(event.target)) {
        dropdown.style.display = 'none';
      }
    });
  }
};

export const DropUpMenuExtension = {
  name: 'drop_up_menu',
  type: 'response',
  match: ({ trace }) => trace.type === 'drop_up_menu' || trace.payload?.name === 'drop_up_menu',
  render: ({ trace, element }) => {
    // Predefined list of topics
    const predefinedResults = [
      "Calculating DSUE and Gift Taxes on Form 706",
      "Related Party Transactions",
      "Divorce and its Various Tax Implications",
      "Reporting Excess Gift Taxes on Form 709",
      "How the IRS Reconstructs Income in Tax Fraud Cases",
      "Secure Act 1.0 & 2.0 Hot Topics: Part 1",
      "Casualty and Theft #1 Introduction for Individual Losses",
      "Casualty and Theft #2 Introduction for Business Losses",
      "Casualty and Theft Case Study Individual",
      "Casualty and Theft Case Study Business",
      "Casualty and Theft Odds and Ends",
      "Form 1099-MISC and 1099-NEC for 2025",
      "Ethics: Part 1",
      "Ethics: Part 2",
      "Quarterly Tax Update 2025: Part 1",
      "Ministers/Amish/Mennonite Tax Issues",
      "S-Corporation Basis and Form 7203",
      "Update on Marijuana Tax Issues",
      "Form 706 / 709 Unlock - Estate Planning and Portability",
      "Charitable Contributions Compliance",
      "Ethics: Part 3",
      "Ethics: Part 4",
      "Employment Taxes and the Trust Fund Recovery Penalty",
      "Estates & Trusts",
      "There is a Form for That â€“ Explore IRS Forms You May Not Know Exist",
      "Tax-exempt Organizations",
      "IRS issued 'B' and 'C' Notices - What you need to know & How to fix",
      "Impact on Expiring Tax Provisions â€“ TCJA",
      "Farm Rentals",
      "Quarterly Tax Update 2025: Part 2",
      "Residential Complications",
      "IRS Streamlined Procedures and the Nonwillful Certification",
      "Tax Research Strategies",
      "Amended vs Superceded Returns",
      "Fall Topical Federal Tax Update (Seminar)",
      "Charitable Gifting",
      "IRS Collection Due Process Procedures",
      "Tax Issues surrounding Sale of Fixed Assets",
      "From Summonses to International Evidence Gathering Techniques - How the IRS Gathers Evidence in the 21st Century",
      "Form 1041 Compliance Review and Planning: Part 1",
      "Form 1041 Compliance Review and Planning: Part 2",
      "Turning Theory into Practice - Estates and Trusts",
      "Clean Vehicle Credits â€“ Purchasing Credits Limitations and Rules",
      "Secure Act 1.0 & 2.0 Hot Topics: Part 2",
      "Is that Worker an Employee? Questions and Answers on Worker Classification",
      "Quarterly Tax Update: Part 3",
      "Business Energy Incentives Update",
      "Fraud Technical Advisors: An End-Run Around the Case of Tweel?",
      "Year-End Federal Tax Update (Seminar)",
      "Quarterly Tax Update: Part 4",
      "Ethics: Part 3",
      "Ethics: Part 4"
    ];

    // Create drop-up menu container
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .dropup-container {
          position: relative;
          width: 100%;
        }
        .dropup-button {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          text-align: center;
        }
        .dropdown-menu {
          position: absolute;
          width: 100%;
          background: white;
          border: 1px solid #ccc;
          max-height: 200px;
          overflow-y: auto;
          bottom: 40px; /* Makes the dropdown go UP */
          display: none;
          z-index: 10;
        }
        .dropdown-menu div {
          padding: 8px;
          cursor: pointer;
          text-align: center;
        }
        .dropdown-menu div:hover {
          background: #f0f0f0;
        }
        .disabled {
          background-color: #e0e0e0;
          cursor: not-allowed;
        }
      </style>

      <div class="dropup-container">
        <button class="dropup-button">${predefinedResults[0]}</button>
        <div class="dropdown-menu"></div>
      </div>
    `;

    // Append to chat element
    element.appendChild(container);

    // Get elements
    const dropupButton = container.querySelector('.dropup-button');
    const dropdownMenu = container.querySelector('.dropdown-menu');

    // Show dropdown when hovering over button
    dropupButton.addEventListener('mouseenter', () => {
      if (!dropupButton.classList.contains('disabled')) {
        dropdownMenu.style.display = 'block';
      }
    });

    // Hide dropdown when mouse leaves
    container.addEventListener('mouseleave', () => {
      dropdownMenu.style.display = 'none';
    });

    // Populate dropdown options
    predefinedResults.forEach(item => {
      const option = document.createElement('div');
      option.textContent = item;

      option.addEventListener('click', () => {
        dropupButton.textContent = item;
        dropdownMenu.style.display = 'none';

        // Disable dropdown after selection
        dropupButton.classList.add('disabled');
        dropupButton.disabled = true;

        // Send selection to Voiceflow
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { user_webinar_choice: item }
        });
      });

      dropdownMenu.appendChild(option);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!container.contains(event.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  }
};

export const FormExtension = {
  name: 'MultiFormTest',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_form' || trace.payload?.name === 'ext_form',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form')

    // Improved styling
    formContainer.innerHTML = `
      <style>
        .form-container {
          width: 100%;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
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
        .attendee {
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
        }
        .attendees-container {
          margin-bottom: 20px;
        }
        .remove-attendee-btn {
          background: #ff6666;
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          display: block;
          margin-top: 10px;
        }
        .remove-attendee-btn:hover {
          background: #ff3333;
        }
        .add-attendee-btn {
          background: #50C878;
          color: white;
          border: none;
          padding: 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          width: 100%;
          margin-bottom: 15px;
        }
        .add-attendee-btn:hover {
          background: #3CAE63;
        }
        .designation-group {
          margin-top: 10px;
        }
        /* Styles for the confirmation popup */
        .confirmation-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding-bottom: 20px;
        }
        .confirmation-popup {
          background: white;
          padding: 25px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 70%;
          overflow-y: auto;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 20px;
        }
        .confirmation-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
        }
        .attendee-summary {
          margin-bottom: 15px;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        .confirmation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .edit-btn {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ccc;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          flex: 1;
          margin-right: 10px;
        }
        .edit-btn:hover {
          background: #e0e0e0;
        }
        .confirm-btn {
          background: #398CC4;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          flex: 1;
          margin-left: 10px;
        }
        .confirm-btn:hover {
          background: #2E719E;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          width: 110px;
        }
      </style>
    `

    // Create a wrapper for better layout
    const formWrapper = document.createElement('div')
    formWrapper.className = 'form-container'
    // Make sure the form wrapper has a position context for the absolute popup
    formWrapper.style.position = 'relative'

    const attendeesContainer = document.createElement('div')
    attendeesContainer.className = 'attendees-container'

    // + Add Attendee button
    const addAttendeeBtn = document.createElement('button')
    addAttendeeBtn.type = 'button'
    addAttendeeBtn.textContent = '+ Add Another Attendee'
    addAttendeeBtn.className = 'add-attendee-btn'

    // Submit button
    const submitBtn = document.createElement('input')
    submitBtn.type = 'submit'
    submitBtn.value = 'Submit'
    submitBtn.className = 'submit-btn'

    /**
     * Creates a single "attendee" block,
     * including a "remove" button.
     */
    function createAttendeeBlock() {
      const div = document.createElement('div')
      div.className = 'attendee'

      // The main attendee fields
      div.innerHTML = `
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="name" name="name" required>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" class="email" name="email" required>
        </div>

        <div class="form-group">
          <label>PTIN</label>
          <input type="text" class="ptin" name="ptin" required>
        </div>

        <div class="form-group">
          <label>Fall Date</label>
          <select class="falldate" name="falldate" required>
            <option value="" disabled selected>Fall Tax Update Seminar 2025</option>
            <option value="Wednesday, September 17, 2025 | Larry Johnson & Kristy Maitre">Wednesday, September 17, 2025 | Larry Johnson & Kristy Maitre</option>
            <option value="Friday, September 19, 2025 | Michael Miranda & Kristy Maitre">Friday, September 19, 2025 | Michael Miranda & Kristy Maitre</option>
            <option value="Tuesday, September 23, 2025 | AJ Reynolds & Randy Adams">Tuesday, September 23, 2025 | AJ Reynolds & Randy Adams</option>
            <option value="Thursday, September 25, 2025 | Larry Johnson & Kristy Maitre">Thursday, September 25, 2025 | Larry Johnson & Kristy Maitre</option>
            <option value="Wednesday, October 1, 2025 | Larry Johnson & Kristy Maitre">Wednesday, October 1, 2025 | Larry Johnson & Kristy Maitre</option>
          </select>
        </div>

        <div class="form-group">
          <label>Year End Date</label>
          <select class="yearenddate" name="yearenddate" required>
            <option value="" disabled selected>Year-End Tax Update Seminar 2025</option>
            <option value="Tuesday, December 2, 2025 | AJ Reynolds & Kristy Maitre">Tuesday, December 2, 2025 | AJ Reynolds & Kristy Maitre</option>
            <option value="Friday, December 5, 2025 | Larry Johnson & Kristy Maitre">Friday, December 5, 2025 | Larry Johnson & Kristy Maitre</option>
            <option value="Tuesday, December 9, 2025 | Larry Johnson & Kristy Maitre">Tuesday, December 9, 2025 | Larry Johnson & Kristy Maitre</option>
            <option value="Wednesday, December 10, 2025 | AJ Reynolds & Michael Miranda">Wednesday, December 10, 2025 | AJ Reynolds & Michael Miranda</option>
            <option value="Friday, December 12, 2025 | AJ Reynolds & Michael Miranda">Friday, December 12, 2025 | AJ Reynolds & Michael Miranda</option>
          </select>
        </div>

        <label>Designations</label>
        <div class="designation-group">
          <input type="checkbox" class="designation" value="AP"> AP (Accounting Practitioner)<br>
          <input type="checkbox" class="designation" value="LPA"> LPA (Licensed Public Accountant)<br>
          <input type="checkbox" class="designation" value="Attorney"> Attorney<br>
          <input type="checkbox" class="designation" value="CFP"> CFP (Certified Financial Planner)<br>
          <input type="checkbox" class="designation" value="CPA"> CPA (Certified Public Accountant)<br>
          <input type="checkbox" class="designation" value="EA"> EA (Enrolled Agent)<br>
          <input type="checkbox" class="designation" value="RTRP"> RTRP (Registered Tax Return Preparer)<br>
          <input type="checkbox" class="designation" value="TRP"> TRP (Tax Return Preparer)<br>
        </div>
      `

      // Create and append "Remove Attendee" button
      const removeBtn = document.createElement('button')
      removeBtn.type = 'button'
      removeBtn.textContent = '- Remove Attendee'
      removeBtn.className = 'remove-attendee-btn'

      removeBtn.addEventListener('click', () => {
        div.remove()
      })

      div.appendChild(removeBtn)
      return div
    }

    // Initialize the form with one attendee block
    attendeesContainer.appendChild(createAttendeeBlock())

    // Handle adding more attendee blocks
    addAttendeeBtn.addEventListener('click', () => {
      attendeesContainer.appendChild(createAttendeeBlock())
    })

    formWrapper.appendChild(attendeesContainer)
    formWrapper.appendChild(addAttendeeBtn)
    formWrapper.appendChild(submitBtn)

    formContainer.appendChild(formWrapper)

    // Create confirmation popup function
    function createConfirmationPopup(attendeesData) {
      const overlay = document.createElement('div')
      overlay.className = 'confirmation-overlay'
      
      const popup = document.createElement('div')
      popup.className = 'confirmation-popup'
      
      // Add title
      const title = document.createElement('div')
      title.className = 'confirmation-title'
      title.textContent = 'Please Confirm Your Information'
      popup.appendChild(title)
      
      // Add attendee information
      attendeesData.forEach((attendee, index) => {
        const attendeeDiv = document.createElement('div')
        attendeeDiv.className = 'attendee-summary'
        
        const attendeeTitle = document.createElement('h3')
        attendeeTitle.textContent = `Attendee ${index + 1}: ${attendee.name}`
        attendeeDiv.appendChild(attendeeTitle)
        
        // Email
        const emailDiv = document.createElement('div')
        emailDiv.innerHTML = `<span class="info-label">Email:</span> ${attendee.email}`
        attendeeDiv.appendChild(emailDiv)
        
        // PTIN
        const ptinDiv = document.createElement('div')
        ptinDiv.innerHTML = `<span class="info-label">PTIN:</span> ${attendee.ptin}`
        attendeeDiv.appendChild(ptinDiv)
        
        // Fall Date
        const fallDateDiv = document.createElement('div')
        fallDateDiv.innerHTML = `<span class="info-label">Fall Date:</span> ${attendee.falldate}`
        attendeeDiv.appendChild(fallDateDiv)
        
        // Year End Date
        const yearEndDateDiv = document.createElement('div')
        yearEndDateDiv.innerHTML = `<span class="info-label">Year End Date:</span> ${attendee.yearenddate}`
        attendeeDiv.appendChild(yearEndDateDiv)
        
        // Designations
        const designationsDiv = document.createElement('div')
        designationsDiv.innerHTML = `<span class="info-label">Designations:</span> ${attendee.designations.length > 0 ? attendee.designations.join(', ') : 'None'}`
        attendeeDiv.appendChild(designationsDiv)
        
        popup.appendChild(attendeeDiv)
      })
      
      // Add confirmation question
      const question = document.createElement('div')
      question.style.fontWeight = 'bold'
      question.style.margin = '20px 0 10px'
      question.textContent = 'Is all the information correct?'
      popup.appendChild(question)
      
      // Add buttons container
      const buttonsDiv = document.createElement('div')
      buttonsDiv.className = 'confirmation-buttons'
      
      // Edit button
      const editBtn = document.createElement('button')
      editBtn.className = 'edit-btn'
      editBtn.textContent = 'Edit'
      editBtn.addEventListener('click', () => {
        overlay.remove()
      })
      buttonsDiv.appendChild(editBtn)
      
      // Submit button
      const confirmBtn = document.createElement('button')
      confirmBtn.className = 'confirm-btn'
      confirmBtn.textContent = 'Submit'
      confirmBtn.addEventListener('click', () => {
        // Send to Voiceflow as a payload
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { attendees: attendeesData },
        })
        
        // Disable all fields & buttons after submit
        const allAttendeeBlocks = attendeesContainer.querySelectorAll('.attendee')
        allAttendeeBlocks.forEach((attendeeDiv) => {
          attendeeDiv.querySelectorAll('input, select').forEach((el) => {
            el.disabled = true
          })
        })
        addAttendeeBtn.disabled = true
        submitBtn.disabled = true
        
        // Also disable each remove button
        const removeButtons = attendeesContainer.querySelectorAll('.remove-attendee-btn')
        removeButtons.forEach((btn) => {
          btn.disabled = true
        })
        
        // Remove the confirmation popup
        overlay.remove()
      })
      buttonsDiv.appendChild(confirmBtn)
      
      popup.appendChild(buttonsDiv)
      overlay.appendChild(popup)
      
      return overlay
    }

    // ==========================
    // Handle form submission
    // ==========================
    formContainer.addEventListener('submit', (e) => {
      e.preventDefault()
      
      // We'll collect all the attendees' data in an array
      const attendeesData = []
      let valid = true

      // Grab all .attendee blocks
      const allAttendeeBlocks = attendeesContainer.querySelectorAll('.attendee')

      allAttendeeBlocks.forEach((attendeeDiv) => {
        // Grab each field within a single attendee block
        const nameInput = attendeeDiv.querySelector('.name')
        const emailInput = attendeeDiv.querySelector('.email')
        const ptinInput = attendeeDiv.querySelector('.ptin')
        const fallDateSelect = attendeeDiv.querySelector('.falldate')
        const yearendDateSelect = attendeeDiv.querySelector('.yearenddate')
        const designationCheckboxes = attendeeDiv.querySelectorAll('.designation')

        // Clear invalid styles from any prior submission
        nameInput.classList.remove('invalid')
        emailInput.classList.remove('invalid')
        ptinInput.classList.remove('invalid')
        fallDateSelect.classList.remove('invalid')
        yearendDateSelect.classList.remove('invalid')

        // Validate
        if (!nameInput.value.trim()) {
          valid = false
          nameInput.classList.add('invalid')
        }
        if (!emailInput.checkValidity()) {
          valid = false
          emailInput.classList.add('invalid')
        }
        if (!ptinInput.value.trim()) {
          valid = false
          ptinInput.classList.add('invalid')
        }
        if (!fallDateSelect.value) {
          valid = false
          fallDateSelect.classList.add('invalid')
        }
        if (!yearendDateSelect.value) {
          valid = false
          yearendDateSelect.classList.add('invalid')
        }

        // If one required field is invalid, skip adding data
        if (!valid) return

        // Collect the designations that were checked
        const designations = Array.from(designationCheckboxes)
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value)

        // Build the data object for this attendee
        const singleAttendeeData = {
          name: nameInput.value,
          email: emailInput.value,
          ptin: ptinInput.value,
          falldate: fallDateSelect.value,
          yearenddate: yearendDateSelect.value,
          designations,
        }

        // Add to the array
        attendeesData.push(singleAttendeeData)
      })

      // If anything invalid, stop here
      if (!valid) return

      // Instead of submitting directly, show the confirmation popup
      const confirmationPopup = createConfirmationPopup(attendeesData)
      formWrapper.appendChild(confirmationPopup)
    })

    element.appendChild(formContainer)
  },
}

export const FirmFormExtension = {
  name: 'SimpleFirmForm',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_firmform' || trace.payload?.name === 'ext_firmform',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form')

    // Use the same style as MultiFormTest (minus classes not needed here)
    formContainer.innerHTML = `
      <style>
        .form-container {
          width: 100%;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .g3dqfd8 {
        display: block;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        /* We included select styling, in case you ever add a <select> */
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
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
          background: #8BD;
        }
      </style>
    `

    // Create a container for better alignment
    const formWrapper = document.createElement('div')
    formWrapper.className = 'form-container'

    // Create form fields
    const fields = [
      { label: 'Firm Name', type: 'text', className: 'firm-name', name: 'firm_name' },
      { label: 'Firm Address', type: 'text', className: 'firm-address', name: 'firm_address' },
      { label: 'City', type: 'text', className: 'city', name: 'city' },
      { label: 'State', type: 'text', className: 'state', name: 'state' },
      { label: 'Zip', type: 'text', className: 'zip', name: 'zip' },
      { label: 'Contact Email', type: 'email', className: 'contact-email', name: 'contact_email' },
    ]

    // Append input fields to form
    fields.forEach(field => {
      const div = document.createElement('div')
      div.className = 'form-group'
      div.innerHTML = `
        <label>${field.label}</label>
        <input type="${field.type}" class="${field.className}" name="${field.name}" required>
      `
      formWrapper.appendChild(div)
    })

    // Submit button
    const submitBtn = document.createElement('input')
    submitBtn.type = 'submit'
    submitBtn.value = 'Submit'
    submitBtn.className = 'submit-btn'

    // Add submit button to the form wrapper
    formWrapper.appendChild(submitBtn)

    // Mount the form wrapper into the form
    formContainer.appendChild(formWrapper)

    // Handle form submission
    formContainer.addEventListener('submit', (e) => {
      e.preventDefault()
      let valid = true
      const data = {}

      // Validate and gather data
      fields.forEach(field => {
        const input = formContainer.querySelector(`.${field.className}`)
        // clear previous invalid state
        input.classList.remove('invalid')
        
        if (!input.checkValidity()) {
          valid = false
          input.classList.add('invalid')
        } else {
          data[field.name] = input.value
        }
      })

      // If any field invalid, stop
      if (!valid) return

      // If valid, send to Voiceflow
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { firm_details: data },
      })

      // ==========================
      // Disable all fields & button after submit
      // ==========================
      fields.forEach(field => {
        const input = formContainer.querySelector(`.${field.className}`)
        input.disabled = true
      })
      submitBtn.disabled = true
    })

    // Finally, mount the form into the Voiceflow element
    element.appendChild(formContainer)
  },
}

export const DisableInputExtension = {
  name: 'DisableInput',
  type: 'effect',
  match: ({ trace }) =>
    trace.type === 'ext_disableInput' ||
    trace.payload?.name === 'ext_disableInput',
  effect: ({ trace }) => {
    const { isDisabled } = trace.payload

    function disableInput() {
      const chatDiv = document.getElementById('voiceflow-chat')

      if (chatDiv) {
        const shadowRoot = chatDiv.shadowRoot
        if (shadowRoot) {
          const chatInput = shadowRoot.querySelector('.vfrc-chat-input')
          const textarea = shadowRoot.querySelector(
            'textarea[id^="vf-chat-input--"]'
          )
          const button = shadowRoot.querySelector('.vfrc-chat-input--button')

          if (chatInput && textarea && button) {
            // Add a style tag if it doesn't exist
            let styleTag = shadowRoot.querySelector('#vf-disable-input-style')
            if (!styleTag) {
              styleTag = document.createElement('style')
              styleTag.id = 'vf-disable-input-style'
              styleTag.textContent = `
                .vf-no-border, .vf-no-border * {
                  border: none !important;
                }
                .vf-hide-button {
                  display: none !important;
                }
              `
              shadowRoot.appendChild(styleTag)
            }

            function updateInputState() {
              textarea.disabled = isDisabled
              if (!isDisabled) {
                textarea.placeholder = 'Message...'
                chatInput.classList.remove('vf-no-border')
                button.classList.remove('vf-hide-button')
                // Restore original value getter/setter
                Object.defineProperty(
                  textarea,
                  'value',
                  originalValueDescriptor
                )
              } else {
                textarea.placeholder = ''
                chatInput.classList.add('vf-no-border')
                button.classList.add('vf-hide-button')
                Object.defineProperty(textarea, 'value', {
                  get: function () {
                    return ''
                  },
                  configurable: true,
                })
              }

              // Trigger events to update component state
              textarea.dispatchEvent(
                new Event('input', { bubbles: true, cancelable: true })
              )
              textarea.dispatchEvent(
                new Event('change', { bubbles: true, cancelable: true })
              )
            }

            // Store original value descriptor
            const originalValueDescriptor = Object.getOwnPropertyDescriptor(
              HTMLTextAreaElement.prototype,
              'value'
            )

            // Initial update
            updateInputState()
          } else {
            console.error('Chat input, textarea, or button not found')
          }
        } else {
          console.error('Shadow root not found')
        }
      } else {
        console.error('Chat div not found')
      }
    }

    disableInput()
  },
}

export const FileUploadExtension = {
  name: 'FileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_fileUpload' || trace.payload?.name === 'ext_fileUpload',
  render: ({ trace, element }) => {
    const fileUploadContainer = document.createElement('div')
    fileUploadContainer.innerHTML = `
      <style>
        .my-file-upload {
          border: 2px dashed rgba(46, 110, 225, 0.3);
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
      </style>
      <div class='my-file-upload'>Drag and drop a file here or click to upload</div>
      <input type='file' style='display: none;'>
    `

    const fileInput = fileUploadContainer.querySelector('input[type=file]')
    const fileUploadBox = fileUploadContainer.querySelector('.my-file-upload')

    fileUploadBox.addEventListener('click', function () {
      fileInput.click()
    })

    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0]
      console.log('File selected:', file)

      fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Upload" width="50" height="50">`

      var data = new FormData()
      data.append('file', file)

      fetch('https://console.cloud.google.com/storage/browser/vf-image-upload', {
        method: 'POST',
        body: data,
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Upload failed: ' + response.statusText)
          }
        })
        .then((result) => {
          fileUploadContainer.innerHTML =
            '<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">'
          console.log('File uploaded:', result.data.url)
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: {
              file: result.data.url.replace(
                'https://tmpfiles.org/',
                'https://tmpfiles.org/dl/'
              ),
            },
          })
        })
        .catch((error) => {
          console.error(error)
          fileUploadContainer.innerHTML = '<div>Error during upload</div>'
        })
    })

    element.appendChild(fileUploadContainer)
  },
}

export const FeedbackExtension = {
  name: 'Feedback',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_feedback' || trace.payload?.name === 'ext_feedback',
  render: ({ trace, element }) => {
    const feedbackContainer = document.createElement('div')

    feedbackContainer.innerHTML = `
          <style>
            .vfrc-feedback {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .vfrc-feedback--description {
                font-size: 0.8em;
                color: grey;
                pointer-events: none;
            }

            .vfrc-feedback--buttons {
                display: flex;
            }

            .vfrc-feedback--button {
                margin: 0;
                padding: 0;
                margin-left: 0px;
                border: none;
                background: none;
                opacity: 0.2;
            }

            .vfrc-feedback--button:hover {
              opacity: 0.5; /* opacity on hover */
            }

            .vfrc-feedback--button.selected {
              opacity: 0.6;
            }

            .vfrc-feedback--button.disabled {
                pointer-events: none;
            }

            .vfrc-feedback--button:first-child svg {
                fill: none; /* color for thumb up */
                stroke: none;
                border: none;
                margin-left: 6px;
            }

            .vfrc-feedback--button:last-child svg {
                margin-left: 4px;
                fill: none; /* color for thumb down */
                stroke: none;
                border: none;
                transform: rotate(180deg);
            }
          </style>
          <div class="vfrc-feedback">
            <div class="vfrc-feedback--description">Was this helpful?</div>
            <div class="vfrc-feedback--buttons">
              <button class="vfrc-feedback--button" data-feedback="1">${SVG_Thumb}</button>
              <button class="vfrc-feedback--button" data-feedback="0">${SVG_Thumb}</button>
            </div>
          </div>
        `

    feedbackContainer
      .querySelectorAll('.vfrc-feedback--button')
      .forEach((button) => {
        button.addEventListener('click', function (event) {
          const feedback = this.getAttribute('data-feedback')
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: { feedback: feedback },
          })

          feedbackContainer
            .querySelectorAll('.vfrc-feedback--button')
            .forEach((btn) => {
              btn.classList.add('disabled')
              if (btn === this) {
                btn.classList.add('selected')
              }
            })
        })
      })

    element.appendChild(feedbackContainer)
  },
}

export const WaitingAnimationExtension = {
  name: 'WaitingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_waitingAnimation' ||
    trace.payload?.name === 'ext_waitingAnimation',
  render: async ({ trace, element }) => {
    // Small delay (optional)
    window.vf_done = true
    await new Promise((resolve) => setTimeout(resolve, 250))

    const text = trace.payload?.text || 'Please wait...'
    const delay = trace.payload?.delay || 3000

    const waitingContainer = document.createElement('div')
    waitingContainer.innerHTML = `
      <style>
        .vfrc-message--extension-WaitingAnimation {
          background-color: transparent !important;
          background: none !important;
        }
        .waiting-animation-container {
          font-family: Poppins, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #fffc;
          display: flex;
          align-items: center;
        }
        .waiting-text {
          display: inline-block;
          margin-left: 10px;
        }
        .waiting-letter {
          display: inline-block;
          animation: shine 1s linear infinite;
        }
        @keyframes shine {
          0%, 100% { color: #fffc; }
          50% { color: #000; }
        }

        /* New loader styles */
        .loader {
          width: 20px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid #0000;
          border-right-color: #398CC4;
          position: relative;
          animation: l24 1s infinite linear;
        }
        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: inherit;
          animation: inherit;
          animation-duration: 2s;
        }
        .loader:after {
          animation-duration: 4s;
        }
        @keyframes l24 {
          100% {
            transform: rotate(1turn);
          }
        }
      </style>

      <div class="waiting-animation-container">
        <div class="loader"></div>
        <span class="waiting-text">
          ${text
            .split('')
            .map((letter, index) =>
              letter === ' '
                ? ' '
                : `<span class="waiting-letter" style="animation-delay: ${
                    index * (1000 / text.length)
                  }ms">${letter}</span>`
            )
            .join('')}
        </span>
      </div>
    `

    element.appendChild(waitingContainer)

    window.voiceflow.chat.interact({
      type: 'continue',
    })

    let intervalCleared = false
    window.vf_done = false

    const checkDoneInterval = setInterval(() => {
      if (window.vf_done) {
        clearInterval(checkDoneInterval)
        waitingContainer.style.display = 'none'
        window.vf_done = false
      }
    }, 100)

    setTimeout(() => {
      if (!intervalCleared) {
        clearInterval(checkDoneInterval)
        waitingContainer.style.display = 'none'
      }
    }, delay)
  },
}

// This extension triggers a "done" action,
// typically used to signal the completion of a task
// and hide a previous WaitingAnimation
export const DoneAnimationExtension = {
  name: 'DoneAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_doneAnimation' ||
    trace.payload?.name === 'ext_doneAnimation',
  render: async ({ trace, element }) => {
    window.vf_done = true
    await new Promise((resolve) => setTimeout(resolve, 250))

    window.voiceflow.chat.interact({
      type: 'continue',
    })
  },
}

export const DownloadButtonExtension = {
  name: 'DownloadButton',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_download_button' || trace.payload?.name === 'ext_download_button',
  render: ({ trace, element }) => {
    console.log('Rendering Download Button Extension', trace)

    const buttonContainer = document.createElement('div')

    buttonContainer.innerHTML = `
      <style>
        .download-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #2e6ee1;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.3s ease;
        }
        .download-button:hover {
          background: #1f5ed1;
        }
        .download-button:active {
          background: #184bb1;
        }
      </style>

      <button class="download-button">Download</button>
    `

    const downloadButton = buttonContainer.querySelector('.download-button')

    downloadButton.addEventListener('click', () => {
      console.log('Download button clicked')

      // Open the download link
      window.open('https://drive.google.com/uc?export=download&id=1ARh23VueJHMmXjzZ0UkC5JnHJjp2Ye35', '_blank')

      // Trigger Voiceflow exit path
      window.voiceflow.chat.interact({
        type: 'path',
        payload: { path: 'download_clicked' }, // Customize this in Voiceflow
      })

      console.log('Exit path "download_clicked" triggered')
    })

    element.appendChild(buttonContainer)

    // Immediately continue the flow
    window.voiceflow.chat.interact({
      type: 'complete',
      payload: {},
    })
    console.log('Flow automatically continued after button render')
  },
}
