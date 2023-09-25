# PrintWatch AI Plugin for DuetWebControl-only [BETA[

This plugin monitors the webcam stream on any RepRapFirmware printer for spaghetti type defects. It can work with any camera that is accessible via an IP address/HTTP endpoint. 
If running Duet in SBC mode, use the [DSF Plugin](https://github.com/printpal-io/DSF_PrintWatchAI_Plugin) instead of this one.

![alt text](https://forum.duet3d.com/assets/uploads/files/1693886852613-665bd7f4-af57-4130-a03a-eadb9dd80558-image.png)
## Installation

The use of the DWC-only version of this Plugin requires two steps:

**1 - DWC UI component:** 

To install this plugin, open DWC, go to `Settings -> Plugins -> External Plugins` and click on "Install Plugin".

Then select the plugin ZIP file and confirm the following steps. 

The plugin ZIP can be found on this GitHub repository's **Releases -> Version X.X.X -> PrintWatch-X.X.X.zip**. 
Alternatively, click [here](https://github.com/printpal-io/DWC_PrintWatchAI_Plugin/releases) to be taken to the release page.

**2 - AI Backend Component:** 

In order to use this Plugin in DWC-only mode, the AI Backend needs to be running on another device. The AI backend can run on any Linux device (Raspberry Pi, Orange Pi, etc..). 

Follow the instructions on the [PrintWatchAI Backend repository](https://github.com/printpal-io/PrintWatchAI_Backend) to setup the backend on your secondary device.

## Usage
**Getting started with the plugin.**
  1. Go to the plugin tab by navigating the side panel **Plugins -> PrintWatch AI**
  2. Enable the plugin by clicking the **Enable Monitoring** button
  3. In the PrintWatch AI plugin page, navigate to the **Settings** tab.
  4. Obtain the IP address of the device running the [PrintWatchAI Backend](https://github.com/printpal-io/PrintWatchAI_Backend) and input it into the `Backend IP` setting input **First**
  5. Enter the IP address of the Duet Board into the `Duet board IP` setting. This is the same IP address that you use to access DWC in your browser `e.g. 172.17.18.139`
  6. Obtain your API key and enter it into the **API key** field. Navigate to the [WebApp](https://app.printpal.io) and create a Free account:
      1. Click 'Sign Up'
      2. Enter desired credentials
      3. Verify account with code sent via email
      4. Log into the WebApp and navigate to **Account -> Settings** and copy the **API key** value. Paste this value into the **API key** field in the Duet plugin
  7. For the Webcam URL input, enter the HTTP url at which the static image of the IP camera can be found. If using [Motion](https://plugins.duet3d.com/plugins/MotionWebcamServerPlugin.html) to handle the webcam streaming,       this value will be: "http://<ip_address>:<port>/<camera_number>/current". If configured using default settings with the Motion Plugin, this will be:  "http://localhost:8081/0/current"


**Thresholds**
   
   There are two threshold setting values:
   - _Notification Threshold:_ this is the defectiveness value at which a notification will be sent to the user. The defectiveness value 
   - _Action Threshold:_ this is the defectiveness value at which an action (pause with m25) will be taken on behalf of the printer.


**Enabling Monitoring**

The plugin will begin actively monitoring the printer if:
- A print job is currently active
  
OR
- Test mode is enable. (Enable this by clicking the **Enable Test Mode** button in the top right corner or the Plugin page)


**Interpreting Results**

Navigate to the **Preview** tab on the PrintWatch AI plugin page to view the AI's bounding boxes overlayed on the webcam preview. Detections with a certain score value will be drawn boxed in _red_.

The **Defectiveness Level** is shown on a circular Gauge to the right of the camera preview. The Guage displays the level on a scale of 0 - 100. A score close to zero indicates that there are no defects detected in the current frame, where a larger value indicates that defects have been detected.

Each printer and configuration will have a different value at which defects are detected well at. Please refer [section 1.3.1 of the Configuration Guide](https://printpal.io/documentation/tuning-your-setup/#articleTOC_3) to properly setup the printer's AI.

