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

export function IconDragDrop(props) {
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

export function IconSwitch(props) {
  return <svg version="1.1" {...makeSvgProps(props)}>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Environment" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="env-001-3R1" transform="translate(-423.000000, -368.000000)">
            <g id="colSpaces" transform="translate(118.000000, 166.000000)">
                <g id="containerSpaces" transform="translate(0.000000, 105.000000)">
                    <g id="space" transform="translate(20.000000, 20.000000)">
                        <g id="dwy" transform="translate(20.000000, 62.000000)">
                            <g id="dir" transform="translate(173.000000, 10.000000)">
                                <g id="iconDragdropCopy" transform="translate(92.000000, 5.000000)">
                                    <rect id="boundsCopy" fillOpacity="0" fill="#E3E3E6" x="1.275" y="1.275" width="10.45" height="10.45"></rect>
                                    <path d="M10.9,9.43333333 L3.1,9.43333333" id="Stroke-3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
                                    <path d="M9.9,3.56666667 L2.1,3.56666667" id="Stroke-3Copy-8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
                                    <polygon id="Stroke-3Copy-6" fill="#FFFFFF" transform="translate(2.375000, 9.433333) rotate(-90.000000) translate(-2.375000, -9.433333) " points="-0.275 11.2583333 2.375 7.60833333 5.025 11.2583333"></polygon>
                                    <polygon id="Stroke-3Copy-9" fill="#FFFFFF" transform="translate(10.625000, 3.566667) rotate(-270.000000) translate(-10.625000, -3.566667) " points="7.975 5.39166667 10.625 1.74166667 13.275 5.39166667"></polygon>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </svg>
}
