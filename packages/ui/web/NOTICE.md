# Browser entry

`@bubbasfw/ui/web` compiles the same React Native component source used by the
universal entry against external React Native Web. It includes NativeWind
4.2.7 / react-native-css-interop 0.2.7's MIT web interop helper, so plain Vite
and Node/Astro SSR never parse React Native's native Flow sources. React and
React Native Web remain external; consumers provide one React instance.
The universal entry retains the external NativeWind JSX runtime and native peers.
The upstream license is retained as NATIVEWIND-LICENSE. No artwork or font binary
is distributed. CSS is built from the exact shared sources and foundation pin.

For browser form semantics the build adapts React Native Web0.21.4's Pressable
and View primitives with one allowlisted View prop: `type`. Upstream otherwise
drops submit/reset intent. The build verifies the exact upstream version and
forwarding patch target. Other RNW internals remain external to preserve the
host StyleSheet/context singleton. The upstream MIT license is retained as
REACT-NATIVE-WEB-LICENSE. Initial Image defaultSource uses the caller's supplied
source when no fallback is provided, preserving real artwork in unhydrated SSR.

Browser conditional exports reference RNW's ESM internals, matching browser hosts'
root RNW import. Node defaults reference RNW's CJS internals, matching Node's root
import. This keeps inherited locale/direction and structural styling contexts
shared with the host on both paths. Do not alias a browser bundle to the Node
file or vice versa; import the exported package subpath.
