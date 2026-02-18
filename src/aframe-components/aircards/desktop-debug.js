// This component allows you to toggle the `desktop-debug` component to perform different behaviors.

// You'll have to write your own logic to define those behaviors, but you can easily check
// `window.desktopDebug` in any other components that should run differently on mobile vs desktop.

// I recommend adding that logic here when possible to keep things more contained.

// Enable/disable on the body by adding 'a' in front of the component name, same as the xr components.

export const DesktopDebug = {
  init () {
    console.log('DESKTOP DEBUG ENABLED')
    window.desktopDebug = true
  }
}
