// progress-bar-extension.js
// Voiceflow Web Chat extension: show / hide a thin animated progress bar
// Triggered by a Custom Action trace whose `type` === "progress-bar"
// and whose payload looks like { "state": "show" }  or { "state": "hide" }

export const ProgressBar = {
  /** Unique key that Voiceflow uses to map this extension */
  name: 'progress-bar',

  /** “effect” runs outside the transcript, ideal for loaders */
  type: 'effect',

  /**
   * Run on every trace; return true when you want to handle it.
   * We only care about traces whose `type` is exactly "progress-bar".
   */
  match: ({ trace }) => trace.type === 'progress-bar',

  /**
   * Imperatively add or remove the bar.
   * Called once for every matching trace.
   */
  effect: ({ trace }) => {
    // payload.state should be "show" or "hide" (anything else → ignore)
    const state = trace.payload?.state ?? 'show';

    // CSS class & element id to keep things tidy
    const BAR_ID   = 'vf-progress-bar';
    const STYLE_ID = 'vf-progress-bar-style';

    // ----- show -----
    if (state === 'show') {
      // Inject the style tag only once
      if (!document.getElementById(STYLE_ID)) {
        const style       = document.createElement('style');
        style.id          = STYLE_ID;
        style.textContent = `
          #${BAR_ID} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            z-index: 2147483647; /* on top of everything */
            background:
              linear-gradient(#474bff 0 0) 0/40% 100% no-repeat,
              #dbdcef;
            animation: vf-loader-slide 2.4s infinite;
          }
          @keyframes vf-loader-slide {
            0%   { background-position: -100% 0; }
            50%  { background-position: 200% 0; }
            100% { background-position: 200% 0; }
          }
        `;
        document.head.appendChild(style);
      }

      // Only add the bar if it doesn’t already exist
      if (!document.getElementById(BAR_ID)) {
        const bar = document.createElement('div');
        bar.id = BAR_ID;
        document.body.appendChild(bar);
      }
      return; // done
    }

    // ----- hide -----
    if (state === 'hide') {
      document.getElementById(BAR_ID)?.remove();
      // Optional: also remove the <style> tag when the bar is gone
      if (!document.getElementById(BAR_ID)) {
        document.getElementById(STYLE_ID)?.remove();
      }
    }
  },
};
