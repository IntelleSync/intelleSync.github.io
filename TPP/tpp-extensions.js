export const ProgressBar = {
  name: 'progress-bar',
  type: 'effect',

  match: ({ trace }) =>
    trace.type === 'progress-bar' &&
    (trace.payload?.state === 'show' || trace.payload?.state === 'hide'),

  effect: ({ trace }) => {
    /* inject CSS once */
    if (!document.getElementById('vf-progress-style')) {
      const style = document.createElement('style');
      style.id = 'vf-progress-style';
      style.textContent = `
        .vf-progress { height:4.5px; width:145.6px;
          background:linear-gradient(#474bff 0 0),
                     linear-gradient(#474bff 0 0), #dbdcef;
          background-size:60% 100%; background-repeat:no-repeat;
          animation:vf-progress-anim 3s infinite !important;
        }
        @keyframes vf-progress-anim{
          0%{background-position:-150% 0,-150% 0;}
          66%{background-position:250% 0,-150% 0;}
          100%{background-position:250% 0,250% 0;}
        }`;
      document.head.appendChild(style);
    }

    if (trace.payload.state === 'show') {
      if (!document.getElementById('vf-progress-bar')) {
        const bar = document.createElement('div');
        bar.id = 'vf-progress-bar';
        bar.className = 'vf-progress';
        /* append to chat root */
        document.querySelector('#voiceflow-chat-frame')?.appendChild(bar);
      }
    } else {
      document.getElementById('vf-progress-bar')?.remove();
    }
  },
};
