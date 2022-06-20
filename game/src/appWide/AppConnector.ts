export const MESSAGE_EVENT = "container:message";

if (typeof window !== "undefined") {
  window.addEventListener(
    "message",
    function (event) {
      console.log('iframe game received message: ', event)
      // TODO: turn back on domain checking
      // if (event.origin === "http://example.com") {
        // always check message came from your website
        // call API method two:
        const app = pc.Application.getApplication();
        if (app) {
          app.fire(MESSAGE_EVENT, event.data);
        }
      // }
    },
    false
  );
}
