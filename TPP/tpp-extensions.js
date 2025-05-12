// progress-bar-extension.js
// Show/hide an animated loader **inside** the Voiceflow chat widget.

export const ProgressBar = {
  name: 'progress-bar',
  type: 'effect',                                    // <— runs outside transcript
  match: ({ trace }) => trace.type === 'progress-bar',

  effect: ({ trace }) => {
    const state = trace.payload?.state ?? 'show';    // show | hide
    const BAR_ID   = 'vf-progress-bar';
    const STYLE_ID = 'vf-progress-bar-style';

    /* 1 ▸ find the chat container (overlay or embedded) */
    const chatHost =
      document.querySelector('.vfrc-chat') ||        // overlay
      document.getElementById('voiceflow-chat-frame'); // embedded

    if (!chatHost) return;                           // chat not open yet

    /* 2 ▸ inject / remove */
    if (state === 'show') {
      // add CSS once
      if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
          #${BAR_ID} {
            position: absolute;      /* relative to chat container */
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background:
              linear-gradient(#474bff 0 0) 0/45% 100% no-repeat,
              #dbdcef;
            animation: vf-slide 2.4s infinite;
            border-radius: 2px 2px 0 0;
            pointer-events: none;    /* ignore clicks */
          }
          @keyframes vf-slide {
            0%   { background-position: -100% 0; }
            50%  { background-position: 200% 0; }
            100% { background-position: 200% 0; }
          }`;
        document.head.appendChild(style);
      }

      // add bar if missing
      if (!chatHost.querySelector(`#${BAR_ID}`)) {
        /* make sure host is positioning context */
        chatHost.style.position ||= 'relative';

        const bar = document.createElement('div');
        bar.id = BAR_ID;
        chatHost.appendChild(bar);
      }
    }

    if (state === 'hide') {
      chatHost.querySelector(`#${BAR_ID}`)?.remove();
      if (!chatHost.querySelector(`#${BAR_ID}`)) {
        document.getElementById(STYLE_ID)?.remove();
      }
    }
  },
};
