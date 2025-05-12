// progress-bar-extension.js
// Voiceflow Web-Chat extension ─ shows/hides an animated loader INSIDE the chat.

export const ProgressBar = {
  name: 'progress-bar',
  type: 'effect',                              // run outside the transcript
  match: ({ trace }) => trace.type === 'progress-bar',

  effect: ({ trace }) => {
    const state     = trace.payload?.state ?? 'show';   // "show" | "hide"
    const BAR_ID    = 'vf-progress-bar';
    const STYLE_ID  = 'vf-progress-bar-style';

    /* 1 ▸ find the widget host */
    const host = document.getElementById('voiceflow-chat');   // root <div>
    if (!host || !host.shadowRoot) return;                    // widget not open yet

    /* 2 ▸ find the internal chat surface */
    const chatSurface =
      host.shadowRoot.querySelector('.vfrc-widget--chat') || // overlay + widget
      host.shadowRoot.querySelector('.vfrc-chat');            // embed fallback
    if (!chatSurface) return;

    /* 3 ▸ SHOW loader ----------------------------------------------------- */
    if (state === 'show') {
      /* inject style once */
      if (!host.shadowRoot.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
          #${BAR_ID} {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background:
              linear-gradient(#474bff 0 0) 0/45% 100% no-repeat,
              #dbdcef;
            animation: vf-slide 2.4s infinite;
            border-radius: 2px 2px 0 0;
            pointer-events: none;
          }
          @keyframes vf-slide {
            0%   { background-position: -100% 0; }
            50%  { background-position: 200% 0; }
            100% { background-position: 200% 0; }
          }`;
        host.shadowRoot.appendChild(style);
      }

      /* ensure chat surface can anchor absolutely-positioned children */
      chatSurface.style.position ||= 'relative';

      /* add bar if it isn’t there yet */
      if (!chatSurface.querySelector('#' + BAR_ID)) {
        const bar = document.createElement('div');
        bar.id = BAR_ID;
        chatSurface.appendChild(bar);
      }
      return;
    }

    /* 4 ▸ HIDE loader ----------------------------------------------------- */
    if (state === 'hide') {
      chatSurface.querySelector('#' + BAR_ID)?.remove();
      if (!chatSurface.querySelector('#' + BAR_ID)) {
        host.shadowRoot.getElementById(STYLE_ID)?.remove();
      }
    }
  },
};
