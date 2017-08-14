import * as React from 'react';

function makeSvgProps({className, size}) {
  size = size || 20;
  return {
    width: `${size}px`,
    height: `${size}px`,
    viewBox: `0 0 ${size} ${size}`,
    className,
    style: {
      // Vertically center the icon.
      marginBottom: -1 * (size / 4),
    },
  };
}

export function DragDropIcon(props) {
  return <svg version="1.1" {...makeSvgProps(props)}>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g id="Environment" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="env-001-4-r1" transform="translate(-290.000000, -654.000000)">
              <g id="col-spaces" transform="translate(170.000000, 166.000000)">
                  <g id="container-spaces" transform="translate(0.000000, 105.000000)">
                      <g id="space-copy-3" transform="translate(20.000000, 310.000000)">
                          <g id="Group-2" transform="translate(100.000000, 73.000000)">
                              <g id="icon-dragdrop">
                                  <rect id="bounds-copy" x="0.5" y="0.5" width="19" height="19"></rect>
                                  <path d="M18,10 L2,10" id="Stroke-3" stroke="#B4B8BF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
                                  <path d="M10,2 L10,18" id="Stroke-3" stroke="#B4B8BF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
                                  <polyline id="Stroke-3" stroke="#B4B8BF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" points="8 3 10 1 12 3"></polyline>
                                  <polyline id="Stroke-3-Copy-5" stroke="#B4B8BF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" transform="translate(10.000000, 18.000000) rotate(-180.000000) translate(-10.000000, -18.000000) " points="8 19 10 17 12 19"></polyline>
                                  <polyline id="Stroke-3-Copy-6" stroke="#B4B8BF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" transform="translate(2.000000, 10.000000) rotate(-90.000000) translate(-2.000000, -10.000000) " points="0 11 2 9 4 11"></polyline>
                                  <polyline id="Stroke-3-Copy-7" stroke="#B4B8BF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" transform="translate(18.000000, 10.000000) rotate(-270.000000) translate(-18.000000, -10.000000) " points="16 11 18 9 20 11"></polyline>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </g>
      </g>
  </svg>
}
