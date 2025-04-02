export const HideInputExtension = {
  name: "HideInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_hide_input" || trace.payload?.name === "ext_hide_input",
  effect: ({ trace }) => {
    console.log("🔹 HideInputExtension triggered", trace);

    // Get the Voiceflow chat container
    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      // Access the shadow root
      const shadowRoot = chatDiv.shadowRoot;

      // Find the input container inside the shadow DOM
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = "none"; // Hide input field
        console.log("✅ vfrc-input-container hidden inside shadow root");
      } else {
        console.warn("⚠️ vfrc-input-container not found inside shadow root");
      }
    } else {
      console.warn("⚠️ voiceflow-chat or shadowRoot not found");
    }
  }
};

export const ShowInputExtension = {
  name: "ShowInputContainer",
  type: "effect",
  match: ({ trace }) => trace.type === "ext_show_input" || trace.payload?.name === "ext_show_input",
  effect: ({ trace }) => {
    console.log("🔹 ShowInputExtension triggered", trace);

    // Get the Voiceflow chat container
    const chatDiv = document.getElementById("voiceflow-chat");

    if (chatDiv && chatDiv.shadowRoot) {
      // Access the shadow root
      const shadowRoot = chatDiv.shadowRoot;

      // Find the input container inside the shadow DOM
      const inputContainer = shadowRoot.querySelector(".vfrc-input-container");

      if (inputContainer) {
        inputContainer.style.display = ""; // Show input field
        console.log("✅ vfrc-input-container is now visible again");
      } else {
        console.warn("⚠️ vfrc-input-container not found inside shadow root");
      }
    } else {
      console.warn("⚠️ voiceflow-chat or shadowRoot not found");
    }
  }
};
