/* ------------------------------------------------------------------
   Progress-bar extensions (show + hide)
   — No changes to size, animation, or position —
   ------------------------------------------------------------------*/

/* 1️⃣  Show the bar */
export const ProgressBarShow = {
  name: 'progress-bar-show',
  type: 'response',

  match: ({ trace }) => trace.type === 'progress-bar-show',

  render: ({ element }) => {
    /* inject the CSS once (re-uses your original rules) */
    if (!document.getElementById('vf-progress-style')) {
      const style = document.createElement('style');
      style.id = 'vf-progress-style';
      style.textContent = `
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
          0%   { background-position: -150% 0, -150% 0; }
          66%  { background-position:  250% 0, -150% 0; }
          100% { background-position:  250% 0,  250% 0; }
        }
      `;
      document.head.appendChild(style);
    }

    /* create + attach the bar */
    const bar = document.createElement('div');
    bar.className = 'progress';
    element.appendChild(bar);

    /* return clean-up so the bar disappears when the bubble is removed */
    return () => bar.remove();
  },
};

/* 2️⃣  Hide the bar (renders nothing) */
export const ProgressBarHide = {
  name: 'progress-bar-hide',
  type: 'response',

  match: ({ trace }) => trace.type === 'progress-bar-hide',

  render: () => {
    /* deliberately empty – this bubble stays invisible */
  },
};
