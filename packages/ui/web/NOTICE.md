# Browser entry

`@bubbasfw/ui/web` compiles the same React Native component source used by the
universal entry against external React Native Web. It includes NativeWind
4.2.7 / react-native-css-interop 0.2.7's MIT web interop helper, so plain Vite
and Node/Astro SSR never parse React Native's native Flow sources. React and
React Native Web remain external; consumers provide one React instance.
The universal entry retains the external NativeWind JSX runtime and native peers.
The upstream license is retained as NATIVEWIND-LICENSE. No artwork or font binary
is distributed. CSS is built from the exact shared sources and foundation pin.
