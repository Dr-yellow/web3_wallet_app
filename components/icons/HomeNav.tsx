import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
const SvgHomeNav = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={20}
    fill="currentColor"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.076}
      d="M.538 8.501c0-.55 0-.826.071-1.08.063-.225.166-.436.305-.624.157-.212.375-.38.81-.72l6.51-5.06c.336-.263.505-.394.691-.445a.96.96 0 0 1 .502 0c.186.05.354.182.692.444l6.509 5.062c.435.338.653.507.81.72.138.187.242.398.305.623.07.254.07.53.07 1.08v6.943c0 1.074 0 1.612-.209 2.022a1.92 1.92 0 0 1-.838.839c-.411.21-.949.21-2.024.21H3.61c-1.075 0-1.612 0-2.023-.21a1.92 1.92 0 0 1-.839-.839c-.209-.41-.209-.948-.209-2.022z"
    />
  </Svg>
);
export default SvgHomeNav;
