export const VFIOFormExtension = {
  name: 'VFI/O Form',
  type: 'response',

  match: ({ trace }) =>
    trace?.type === 'ext_vfio_form' || trace?.payload?.name === 'ext_vfio_form',

  render: ({ trace, element }) => {
    console.log('[VFI/O Form] Rendering with Poppins font')

    const container = document.createElement('div')
    container.className = 'form-container'

    container.innerHTML = `
      <!-- Load Poppins Font -->
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

      <style>
        .form-container {
          font-family: 'Poppins', sans-serif;
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
          font-weight: 500;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
          background: #fff;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #398CC4;
          box-shadow: 0 0 0 2px rgba(57, 140, 196, 0.15);
        }

        .form-group textarea {
          min-height: 110px;
          resize: vertical;
        }

        .invalid {
          border-color: red !important;
        }

        .submit-btn {
          font-family: 'Poppins', sans-serif;
          background: #398CC4;
          color: white;
          border: none;
          padding: 14px;
          cursor: pointer;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          width: 100%;
          transition: all 0.2s ease;
        }

        .submit-btn:hover {
          background: #2E719E;
          transform: translateY(-1px);
        }

        /* Spinner Overlay */
        .vfio-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.85);
          display: none;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          z-index: 10;
        }

        .vfio-overlay.show { display: flex; }

        .vfio-spinner {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid rgba(0,0,0,0.1);
          border-top-color: #398CC4;
          animation: vfio-spin 0.8s linear infinite;
        }

        @keyframes vfio-spin {
          to { transform: rotate(360deg); }
        }

        .vfio-status {
          margin-top: 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }
      </style>

      <div class="vfio-overlay" data-overlay>
        <div>
          <div class="vfio-spinner"></div>
          <div class="vfio-status">Searching database...</div>
        </div>
      </div>

      <form data-form>
        <div class="form-group">
          <label>Name</label>
          <input type="text" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" required />
        </div>

        <div class="form-group">
          <label>Plan</label>
          <select required>
            <option value="" disabled selected>Select</option>
            <option>Starter</option>
            <option>Professional</option>
            <option>Business</option>
            <option>Business+</option>
          </select>
        </div>

        <div class="form-group">
          <label>Message</label>
          <textarea></textarea>
        </div>

        <button class="submit-btn" type="submit">Submit</button>
      </form>
    `

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
