(function () {
	// ----------------------------------------
	// 1. Function to inject the command panel
	// ----------------------------------------
	function injectPanel() {
	  // Prevent multiple injections
	  if (document.getElementById("agentic-ai-command-panel-host")) return;
  
	  // Create the host for Shadow DOM
	  const shadowHost = document.createElement("div");
	  shadowHost.id = "agentic-ai-command-panel-host";
	  shadowHost.style.position = "fixed";
	  shadowHost.style.top = "0";
	  shadowHost.style.left = "0";
	  shadowHost.style.width = "100%";
	  shadowHost.style.height = "100%";
	  shadowHost.style.pointerEvents = "none"; // Allow clicks to pass through when not interacting
	  // Increase z-index if needed
	  shadowHost.style.zIndex = "999999";
	  document.body.appendChild(shadowHost);
  
	  // Attach Shadow DOM
	  const shadowRoot = shadowHost.attachShadow({ mode: "closed" });
  
	  // ----------------------------------------
	  // 2. Inject Styles
	  //    - Original EXACT styles for panel.
	  //    - Minimal additional CSS for Advanced Settings.
	  // ----------------------------------------
	  const style = document.createElement("style");
	  style.textContent = `
		/* ::::::::::::::::::::::::::::::::::::::::::::::
		   ORIGINAL EXACT STYLES (unchanged)
		:::::::::::::::::::::::::::::::::::::::::::::::: */
		.command-panel {
		  position: fixed;
		  top: 10%; /* Adjust to your liking */
		  left: 0;
		  height: 50px; /* Collapsed height */
		  background: rgba(255, 255, 255, 0.2);
		  backdrop-filter: blur(10px);
		  border-radius: 0 8px 8px 0;
		  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		  overflow: hidden;
		  width: 50px; /* Collapsed width */
		  cursor: pointer;
		  transition: width 0.3s ease, height 0.3s ease;
		  pointer-events: auto; /* Enable interactions */
		}
  
		/* Expanded state */
		.command-panel.expanded {
		  width: 90%; /* Expand width */
		  height: 250px; /* Expand height */
		  left: 5%; /* Pull away from the edge */
		}
  
		/* The clickable arrow/tab */
		.toggle-tab {
		  position: absolute;
		  top: 0;
		  left: 0;
		  height: 100%;
		  width: 50px; /* Same as collapsed width */
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  background: rgba(255, 255, 255, 0.3);
		  backdrop-filter: blur(10px);
		  border-radius: 0 8px 8px 0;
		  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
		  z-index: 2;
		}
  
		/* Steep arrow icon */
		.toggle-arrow {
		  font-size: 18px;
		  color: #333;
		  transform: rotate(0deg);
		  transition: transform 0.3s ease;
		}
  
		/* Rotate arrow on expand */
		.command-panel.expanded .toggle-arrow {
		  transform: rotate(180deg);
		}
  
		/* Inside content */
		.command-content {
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  width: 100%;
		  height: 100%;
		  background: rgba(255, 255, 255, 0.2); /* Added background */
		  backdrop-filter: blur(10px); /* Added backdrop blur */
		  opacity: 0; /* Hidden when collapsed */
		  pointer-events: none;
		  transition: opacity 0.3s ease;
		}
  
		.command-panel.expanded .command-content {
		  opacity: 1;
		  pointer-events: auto;
		}
  
		/* Title */
		.command-title {
		  font-size: 20px;
		  color: #333;
		  margin-bottom: 15px;
		}
  
		/* Input field and button container */
		.command-input-container {
		  display: flex;
		  align-items: center;
		  width: 80%;
		}
  
		/* Command-line arrow for input */
		.command-icon {
		  margin-right: 10px;
		  font-size: 20px;
		  color: #fff; /* Match input box */
		}
  
		/* Input field */
		.command-input {
		  flex: 1;
		  padding: 10px;
		  border: none; /* Removed border */
		  border-radius: 5px;
		  outline: none;
		  font-size: 16px;
		  background: #fff; /* White background */
		  color: #333; /* Dark text */
		}
  
		.command-input::placeholder {
		  color: #aaa;
		}
  
		/* Run button */
		.run-button {
		  margin-left: 10px;
		  padding: 10px 20px;
		  background: rgba(255, 255, 255, 0.3);
		  border: none;
		  border-radius: 5px;
		  color: #333;
		  font-size: 16px;
		  font-weight: bold;
		  cursor: pointer;
		  backdrop-filter: blur(5px);
		  transition: background 0.3s ease, transform 0.2s ease;
		}
  
		.run-button:hover {
		  background: rgba(255, 255, 255, 0.5);
		  transform: scale(1.05);
		}
  
		.run-button:disabled {
		  background: rgba(255, 255, 255, 0.1);
		  cursor: not-allowed;
		  transform: scale(1);
		}
  
		/* Feedback message */
		.feedback-message {
		  margin-top: 10px;
		  font-size: 14px;
		  color: #333;
		}
  
		/* ::::::::::::::::::::::::::::::::::::::::::::::
		   NEW STYLES for Advanced Settings
		:::::::::::::::::::::::::::::::::::::::::::::::: */
  
		/* Additional panel height when advanced is open */
		.command-panel.expanded.expanded-advanced {
		  /* Bump the height so the textarea is visible */
		  height: 400px; 
		}
  
		/* Gear button */
		.advanced-settings-btn {
		  margin-top: 10px; /* small top margin */
		  font-size: 14px;
		  background: rgba(255, 255, 255, 0.3);
		  border: none;
		  border-radius: 5px;
		  color: #333;
		  font-weight: bold;
		  cursor: pointer;
		  backdrop-filter: blur(5px);
		  padding: 5px 10px;
		  display: flex;
		  align-items: center;
		  transition: background 0.3s ease, transform 0.2s ease;
		}
		.advanced-settings-btn:hover {
		  background: rgba(255, 255, 255, 0.5);
		  transform: scale(1.02);
		}
		.gear-icon {
		  margin-right: 5px;
		}
  
		/* The advanced settings container (hidden by default) */
		.advanced-settings-container {
		  display: none;
		  flex-direction: column;
		  justify-content: flex-start;
		  align-items: center;
		  width: 80%;
		  margin-top: 15px;
		  border-top: 2px solid #aaa;
		  border-bottom: 2px solid #aaa;
		  padding: 10px 0;
		}
		.advanced-settings-container.active {
		  display: flex;
		}
  
		.advanced-settings-text {
		  font-size: 14px;
		  color: #333;
		  margin-bottom: 8px;
		  text-align: center;
		  line-height: 1.4;
		}
  
		.advanced-settings-textarea {
		  width: 100%;
		  height: 80px;
		  resize: vertical;
		  padding: 8px;
		  font-size: 14px;
		  border-radius: 5px;
		  border: 1px solid #ccc;
		  outline: none;
		}
  
		.advanced-settings-actions {
		  display: flex;
		  justify-content: center;
		  margin-top: 8px;
		}
  
		.save-btn, .cancel-btn {
		  margin: 0 5px;
		  padding: 6px 12px;
		  background: rgba(255, 255, 255, 0.3);
		  border: none;
		  border-radius: 5px;
		  color: #333;
		  font-weight: bold;
		  cursor: pointer;
		  backdrop-filter: blur(5px);
		}
  
		.save-btn:hover, .cancel-btn:hover {
		  background: rgba(255, 255, 255, 0.5);
		}
	  `;
	  shadowRoot.appendChild(style);
  
	  // ----------------------------------------
	  // 3. Inject the Panel HTML Structure
	  // ----------------------------------------
	  const panel = document.createElement("div");
	  panel.classList.add("command-panel");
	  panel.id = "commandPanel";
  
	  panel.innerHTML = `
		<div class="toggle-tab" id="toggleTab" role="button" aria-expanded="false" aria-label="Toggle Command Panel">
		  <span class="toggle-arrow">❱</span>
		</div>
		<div class="command-content">
		  <div class="command-title">Agentic AI Command</div>
  
		  <div class="command-input-container">
			<span class="command-icon">❱</span>
			<input
			  type="text"
			  class="command-input"
			  id="commandInput"
			  placeholder="From this page, I would like to..."
			/>
			<button class="run-button" id="runButton">Run</button>
		  </div>
  
		  <div class="feedback-message" id="feedbackMessage"></div>
  
		  <!-- Advanced Settings Button -->
		  <button class="advanced-settings-btn" id="advancedSettingsBtn">
			<span class="gear-icon">⚙</span> Advanced Settings
		  </button>
  
		  <!-- Advanced Settings Container -->
		  <div class="advanced-settings-container" id="advancedSettingsContainer">
			<div class="advanced-settings-text">
			  Add relevant information about how you would like your agent to operate.
			  This may include personal details, navigation preferences, etc.
			  <br><br>
			  <em>Note: This could increase token usage.</em>
			</div>
			<textarea
			  class="advanced-settings-textarea"
			  id="advancedSettingsTextarea"
			  placeholder="Enter your advanced context here..."
			></textarea>
			<div class="advanced-settings-actions">
			  <button class="save-btn" id="saveBtn">Save</button>
			  <button class="cancel-btn" id="cancelBtn">Cancel</button>
			</div>
		  </div>
		</div>
	  `;
	  shadowRoot.appendChild(panel);
  
	  // ----------------------------------------
	  // 4. Grab Elements and Add Event Listeners
	  // ----------------------------------------
	  const toggleTab = shadowRoot.getElementById("toggleTab");
	  const runButton = shadowRoot.getElementById("runButton");
	  const commandInput = shadowRoot.getElementById("commandInput");
	  const feedbackMessage = shadowRoot.getElementById("feedbackMessage");
	  const advancedSettingsBtn = shadowRoot.getElementById("advancedSettingsBtn");
	  const advancedSettingsContainer = shadowRoot.getElementById("advancedSettingsContainer");
	  const advancedSettingsTextarea = shadowRoot.getElementById("advancedSettingsTextarea");
	  const saveBtn = shadowRoot.getElementById("saveBtn");
	  const cancelBtn = shadowRoot.getElementById("cancelBtn");
  
	  // ----------------------------------------
	  // 5. Toggle Expand/Collapse of Main Panel
	  // ----------------------------------------
	    
	  // Close panel when clicking outside
	  document.addEventListener("click", (e) => {
		if (!shadowHost.contains(e.target)) {
		  panel.classList.remove("expanded");
		  toggleTab.setAttribute("aria-expanded", "false");
		  advancedSettingsContainer.classList.remove("active");
		  panel.classList.remove("expanded-advanced");
  
		  // If you also want it to reset to 10% whenever it closes via outside click:
		  // panel.style.top = "10%";
		}
	  });
  
	  // Prevent closing when interacting with the panel content
	  panel.addEventListener("click", (e) => e.stopPropagation());
  
	  // ----------------------------------------
	  // 6. Advanced Settings Toggle
	  // ----------------------------------------
	  advancedSettingsBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		// Toggle visibility of advanced settings
		const currentlyActive = advancedSettingsContainer.classList.contains("active");
		if (currentlyActive) {
		  advancedSettingsContainer.classList.remove("active");
		  // If we close advanced settings, revert to normal panel height
		  panel.classList.remove("expanded-advanced");
		} else {
		  advancedSettingsContainer.classList.add("active");
		  // Increase panel height if advanced is open
		  if (panel.classList.contains("expanded")) {
			panel.classList.add("expanded-advanced");
		  }
		  loadAdvancedSettings(); // Load from chrome.storage
		}
	  });
  
	  // ----------------------------------------
	  // 7. Load and Save Advanced Settings
	  // ----------------------------------------
	  function loadAdvancedSettings() {
		chrome.storage.local.get(["agenticAdvancedContext"], (result) => {
		  const existingContext = result.agenticAdvancedContext || "";
		  advancedSettingsTextarea.value = existingContext;
		});
	  }
  
	  function saveAdvancedSettings() {
		const contextValue = advancedSettingsTextarea.value || "";
		// Indicate saving
		saveBtn.textContent = "Saving...";
		chrome.storage.local.set({ agenticAdvancedContext: contextValue }, () => {
		  // On successful save
		  setTimeout(() => {
			saveBtn.textContent = "Saved!";
			setTimeout(() => {
			  // Reset button text and collapse advanced area
			  saveBtn.textContent = "Save";
			  advancedSettingsContainer.classList.remove("active");
			  panel.classList.remove("expanded-advanced");
			}, 1000);
		  }, 500);
		});
	  }
  
	  // ----------------------------------------
	  // 8. Save / Cancel Buttons in Advanced Panel
	  // ----------------------------------------
	  saveBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		saveAdvancedSettings();
	  });
  
	  cancelBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		advancedSettingsContainer.classList.remove("active");
		panel.classList.remove("expanded-advanced");
	  });
  
	  // ----------------------------------------
	  // 9. Handle "Run" Button Click
	  // ----------------------------------------
	  runButton.addEventListener("click", async () => {
		const task = commandInput.value.trim();
		if (!task) {
		  alert("Please enter a task.");
		  return;
		}
  
		// Disable the button and change its text to "Running"
		runButton.disabled = true;
		runButton.textContent = "Running...";
		feedbackMessage.textContent = "Submitting your task...";
  
		try {
		  // Retrieve advanced context from chrome.storage.local
		  chrome.storage.local.get(["agenticAdvancedContext"], async (result) => {
			const advancedContext = result.agenticAdvancedContext || "";
  
			// Construct the task with context
			const sanitizedContext = advancedContext
			  .replace(/\\/g, "\\\\")
			  .replace(/"/g, '\\"')
			  .replace(/\n/g, "\\n");
  
			let taskWithContext = `Please start from this site ${window.location.href} and do this: ${task}`;
			if (sanitizedContext.trim().length > 0) {
			  taskWithContext += `\n\nHere is additional context about the user:\n"${sanitizedContext}"`;
			}
  
			// Send the task to the local server
			const response = await fetch("http://127.0.0.1:8888/run", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
				"Origin": "http://127.0.0.1"
			  },
			  body: JSON.stringify({ task: taskWithContext }),
			});
  
			if (!response.ok) {
			  throw new Error(`Server responded with status ${response.status}`);
			}
  
			const data = await response.json();
			console.log("Task submitted:", data);
  
			// Update feedback message
			feedbackMessage.textContent = "Task is being processed.";
		  });
		} catch (error) {
		  console.error("Error submitting task:", error);
		  feedbackMessage.textContent = "Failed to submit the task. Please try again.";
		} finally {
		  // Re-enable the button and reset its text after 15 seconds
		  setTimeout(() => {
			runButton.disabled = false;
			runButton.textContent = "Run";
			feedbackMessage.textContent = "";
		  }, 15000);
		}
	  });
  
	  // ----------------------------------------
	  // 10. Handle Enter Key in the Input Field
	  // ----------------------------------------
	  commandInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
		  runButton.click();
		}
	  });
  
	  // ----------------------------------------
	  // 11. Make the toggle button draggable on Y-axis
	  // ----------------------------------------
	  // Variables for dragging
		let isDragging = false;
		let isClick = false;
		let startY = 0;
		let initialTop = 0;
		const DRAG_THRESHOLD = 5; // You can tweak this number

		// 1. MOUSE DOWN
		toggleTab.addEventListener("mousedown", (e) => {
		e.stopPropagation();

		isDragging = true;
		isClick = true; // Assume it might be a click until movement exceeds threshold

		startY = e.clientY;
		// Current top of panel
		const panelStyles = window.getComputedStyle(panel);
		initialTop = parseInt(panelStyles.top, 10) || 0;

		// Change cursor to indicate dragging is possible
		toggleTab.style.cursor = "grabbing";
		});

		// 2. MOUSE MOVE
		document.addEventListener("mousemove", (e) => {
		if (!isDragging) return;

		e.preventDefault();
		e.stopPropagation();

		// Calculate how far the mouse has moved vertically
		const deltaY = e.clientY - startY;

		// If the movement exceeds our threshold, it's no longer just a click
		if (Math.abs(deltaY) > DRAG_THRESHOLD) {
			isClick = false;
		}

		// If we’re dragging, update the top position of the panel (stay in bounds)
		if (!isClick) {
			let newTop = initialTop + deltaY;

			// Constrain within viewport
			const panelHeight = panel.offsetHeight;
			const viewportHeight = window.innerHeight;
			if (newTop < 0) newTop = 0;
			if (newTop + panelHeight > viewportHeight) {
			newTop = viewportHeight - panelHeight;
			}

			panel.style.top = `${newTop}px`;
		}
		});

		// 3. MOUSE UP
		document.addEventListener("mouseup", (e) => {
		if (!isDragging) return;
		e.stopPropagation();

		// Restore cursor
		toggleTab.style.cursor = "pointer";

		// If movement stayed under threshold, treat as click → toggle the panel
		if (isClick) {
			const isExpanded = panel.classList.toggle("expanded");
			toggleTab.setAttribute("aria-expanded", isExpanded);

			// Close advanced settings when collapsing
			if (!isExpanded) {
			advancedSettingsContainer.classList.remove("active");
			panel.classList.remove("expanded-advanced");
			} else {
			commandInput.focus();
			}
		}

		// Reset flags
		isDragging = false;
		isClick = false;
});

	}
  
	// ----------------------------------------
	// 12. Inject Panel When Document is Ready
	// ----------------------------------------
	function waitForBodyAndInject() {
	  if (document.body) {
		injectPanel();
	  } else {
		const observer = new MutationObserver((mutations, obs) => {
		  if (document.body) {
			injectPanel();
			obs.disconnect();
		  }
		});
		observer.observe(document.documentElement, { childList: true, subtree: true });
	  }
	}
  
	// Invoke the function
	waitForBodyAndInject();
  })();
  