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
