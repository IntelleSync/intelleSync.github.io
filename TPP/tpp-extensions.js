export const ProgressBar = {
  name: 'progress-bar',
  type: 'response',

  // updated match — now checks for `state: "show" | "hide"`
  match: ({ trace }) =>
    trace.type === 'progress-bar' &&
    (trace.payload?.state === 'show' || trace.payload?.state === 'hide'),

  render: ({ element }) => {
    console.log('[ProgressBarExtension] Rendering progress bar');

    const bar = document.createElement('div');
    bar.className = 'progress';

    const style = document.createElement('style');
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
        0%   { background-position: -150% 0,-150% 0; }
        66%  { background-position: 250% 0,-150% 0; }
        100% { background-position: 250% 0, 250% 0; }
      }
    `;

    element.appendChild(style);
    element.appendChild(bar);
  },
};
