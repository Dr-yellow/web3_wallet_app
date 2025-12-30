import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
const SvgPersonNav = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="currentColor"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.81 11.844c3.038 0 5.722 1.551 7.419 3.924.286.4.652.857.641 1.477a1.7 1.7 0 0 1-.172.697 1.7 1.7 0 0 1-.434.578 1.6 1.6 0 0 1-.84.34c-.252.031-.554.03-.864.03H3.06c-.31 0-.612.001-.865-.03-.275-.036-.572-.118-.84-.34a1.7 1.7 0 0 1-.433-.578 1.7 1.7 0 0 1-.172-.697c-.01-.62.355-1.077.642-1.477 1.696-2.373 4.38-3.924 7.418-3.924M8.81.75c2.626 0 4.686 2.238 4.686 4.91s-2.06 4.91-4.686 4.91-4.686-2.238-4.686-4.91S6.184.75 8.81.75"
    />
  </Svg>
);
export default SvgPersonNav;
