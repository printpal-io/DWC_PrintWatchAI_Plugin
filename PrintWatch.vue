<style scoped>
.content {
	position: relative;
	min-height: 480px;
}

.content canvas {
	position: absolute;
}

th {
	white-space: nowrap;
}

iframe {
	width: 100%;
	height: 100%;
	border: 0px;
	overflow: hidden;
}

img {
	max-width: 100%;
	max-height: 100%;
	border: 0px;
	overflow: hidden;
}

.img-container {
	overflow: hidden;
}
</style>

<template>
	<v-row>
		<v-col>
			<v-card>
				<v-tabs v-model="tab">
					<!-- Tabs -->
					<v-tab href="#current">
						<v-icon class="mr-1">mdi-information</v-icon>
						Preview
					</v-tab>
					<v-tab href="#settings">
						<v-icon class="mr-1">mdi-cog</v-icon>
						Settings
					</v-tab>
					<v-btn v-if="enableMonitoring && !testMode" color="success" class="align-self-center ml-auto mr-2 hidden-sm-and-down" :disabled="!enableMonitoring" @click="testMode = !testMode">
						<v-icon class="mr-1">mdi-test-tube</v-icon>
						Enable Test Mode
					</v-btn>
					<v-btn v-if="!enableMonitoring || (enableMonitoring && testMode)" color="gray" class="align-self-center ml-auto mr-2 hidden-sm-and-down" :disabled="!enableMonitoring" @click="testMode = !testMode">
						<v-icon class="mr-1">mdi-test-tube</v-icon>
						Disable Test Mode
					</v-btn>
					<v-btn v-if="!enableMonitoring" color="success" class="align-self-center ml-2 mr-2 hidden-sm-and-down" :disabled="false" @click="enableMonitoring = !enableMonitoring">
						<v-icon class="mr-1">mdi-power</v-icon>
						Enable Monitoring
					</v-btn>
					<v-btn v-if="enableMonitoring" color="warning" class="align-self-center ml-2 mr-2 hidden-sm-and-down" :disabled="false" @click="enableMonitoring = !enableMonitoring">
						<v-icon class="mr-1">mdi-power</v-icon>
						Disable Monitoring
					</v-btn>
				</v-tabs>

				<v-tabs-items v-model="tab">
					<!-- Current Preview -->
					<v-tab-item value="current">
						<div class="d-flex flex-column">
							<v-alert :value="!enableMonitoring" type="info" class="mb-0">
								AI Monitoring is not enabled. Please enable it with the "Enable Monitoring" button
							</v-alert>
							<div v-show="enableMonitoring" class="content flex-grow-1 pa-2">
								<div class="row">
									<div class="col-md-6 col-lg-6 col-12">
										<div class="v-card v-sheet v-sheet--outlined theme--light">
											<v-card-text class="pa-0 img-container">
												<v-responsive v-if="enableMonitoring && streamIntervalId" :aspect-ratio="16/9">
													<img :src="imageDetectionPreview"  class="previewIFrame" style="width:100%;height:100%">
												</v-responsive>
											</v-card-text>
										</div>
									</div>
									<div class="col-md-2 col-lg-2 col-12">
										<div class="v-card v-sheet v-sheet--outlined theme--light">
											<div class="v-card__title pb-0">
												Defectiveness Level
											</div>
												<div class="text-center mb-4 mt-4">
													<v-progress-circular
														v-if="enableMonitoring && streamIntervalId"
														v-model="defectLevel"
														:rotate="180"
														:size="100"
														:width="15"
														:color="gaugeColor"
													>
														<strong style="color:black">{{ defectLevel }}</strong>
													</v-progress-circular>
												</div>
											</div>
									</div>
								</div>
							</div>
						</div>
					</v-tab-item>

					<!-- Settings -->
					<v-tab-item value="settings">
						<div class="d-flex flex-column">
							<v-alert :value="!enableMonitoring" type="info" class="mb-0">
								AI Monitoring is not enabled. Please enable it with the "Enable Monitoring" button
							</v-alert>
							<div class="content flex-grow-1 pa-2">

							<v-card-text>
										<v-row :dense="$vuetify.breakpoint.mobile">
											<div class="row pa-3"  v-show="enableMonitoring">
												<div class="col-md-4 col-lg-4 col-12">
													<div class="v-card v-sheet v-sheet--outlined theme--light">
														<div class="v-card__title pb-0">
															General
														</div>
														<div class="col-md-12 col-12">
															<v-col cols="12" md="8">
																<v-text-field v-model="backendAddr" label="Backend IP" hide-details></v-text-field><v-icon title="Backend Connected to IP successfully" v-show="backendIPValid">mdi-check-circle</v-icon><v-icon title="Failed to connect to Backend using this IP" v-show="!backendIPValid">mdi-alert</v-icon>
															</v-col>
															<v-col cols="12" md="8">
																<v-text-field v-model="duet_ip" label="Duet board IP" :disabled="!backendIPValid || duetIPFetched" hide-details></v-text-field>
															</v-col>
															<v-col cols="12" md="8">
																<v-text-field v-model="apiKey" label="API key" :disabled="!backendIPValid" hide-details></v-text-field>
															</v-col>
															<v-col cols="12" md="8">
																<v-text-field v-model="snapshotUrl" label="Webcam URL" :disabled="!backendIPValid" hide-details></v-text-field><v-icon title="Valid Webcam URL" v-show="cameraIPValid">mdi-check-circle</v-icon><v-icon title="Invalid Webcam URL" v-show="!cameraIPValid">mdi-alert</v-icon>
															</v-col>
															<v-col cols="12" md="8">
																<v-text-field v-model="emailAddr" label="Email address" :disabled="!backendIPValid" hide-details></v-text-field>
															</v-col>
															<div class="pt-8">
																<div class="text-caption">
													        Notification Threshold
													      </div>
																<v-slider
															    v-model="notificationThreshold"
															    :max="100"
															    :min="0"
																	:disabled="!backendIPValid"
															    hide-details
																	thumb-label="always"
																	class="pt-8"
															  >
															  </v-slider>
															</div>

															<div class="pt-2">
																<div class="text-caption">
													        Action Threshold
													      </div>
																<v-slider
															    v-model="actionThreshold"
															    :max="100"
															    :min="0"
																	:disabled="!backendIPValid"
															    hide-details
																	thumb-label="always"
																	class="pt-8"
															  >
															  </v-slider>
															</div>

														</div>
													</div>
												</div>
												<div class="col-md-4 col-12">
													<div class="v-card v-sheet v-sheet--outlined theme--light">
														<div class="v-card__title pb-0">
															Action
														</div>
														<div class="col-md-12 col-12">
															<v-col cols="12" md="12">
																<v-switch v-model="enableNotify" label="Enable Email Notification" :disabled="!backendIPValid" hide-details></v-switch>
															</v-col>
															<v-col cols="12" md="12">
																<v-switch v-model="pausePrint" label="Pause Print" :disabled="!backendIPValid" hide-details></v-switch>
															</v-col>
															<v-col cols="12" md="8">
																<v-text-field v-model="pauseGCode" label="Pause G/M-Code command" :disabled="!pausePrint" hide-details></v-text-field>
															</v-col>
														</div>
													</div>
												</div>

											</div>
										</v-row>
							</v-card-text>
							</div>
						</div>
					</v-tab-item>
				</v-tabs-items>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
'use strict'
import { mapState, mapGetters } from 'vuex'
import { PluginDataType } from '@/store/index'
import { setPluginData } from '@/store/index'

export default {
	components: {
	},
	computed: {
		...mapState(['selectedMachine']),
		...mapState('machine', ['settings']),
		...mapGetters(['isConnected', 'uiFrozen']),
	},
	data() {
		return {
			tab : null,
			imageDetectionPreview : null,
			enableMonitoring : true,
			trackingInfo : {},
			intervalId : null,
			streamIntervalId : null,
			heartbeatInterval : null,
			notificationThreshold : null,
			actionThreshold : null,
			pausePrint : null, //false
			emailAddr : '',
			enableNotify : null, //false
			snapshotUrl : '',
			apiKey : '',
			testMode : null, //false
			defectLevel : 0,
			gaugeColor : 'primary',
			duet_ip : '',
			backendAddr : '',
			backendIPValid : false,
			failedComms : 0,
			validateIntervalId : undefined,
			duetIPFetched : false,
			pauseGCode : '',
			cameraIPValid : false,
			validateCamIntervalId : undefined
		}
	},

	methods: {
		//...mapActions(['save']),
		//insert methods for creating a new file for saving settings, modifying existing file when settings update.
		// settings would be all the variables in data()
		// these should retain when the user restarts Duet or refreshes browser
		// unlike the DSF plugin, we cannot rely on pinging the backend using localhost
		setGaugeColor() {
			if(this.defectLevel < 20) {
				this.gaugeColor = "success";
			} else if (this.defectLevel >= 20 && this.defectLevel < 40.0) {
				this.gaugeColor = "amber";
			} else if (this.defectLevel >= 40 && this.defectLevel < 60.0) {
				this.gaugeColor = "warning";
			} else {
				this.gaugeColor = "error";
			}
		},
		fetchSettings() {
			// API call to backend
			if (this.backendIPValid) {
				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/get_settings', {signal : controller.signal})
					.then((response) => response.json())
					.then((data) => {
						clearTimeout(id);
						this.notificationThreshold = Math.round(data.settings.thresholds.notification * 100.0);
						this.actionThreshold = Math.round(data.settings.thresholds.action * 100.0);
						this.pausePrint = data.settings.actions.pause;
						this.emailAddr = data.settings.email_addr;
						this.enableNotify = data.settings.actions.notify;
						this.snapshotUrl = data.settings.camera_ip;
						this.apiKey = data.settings.api_key;
						this.testMode = data.settings.test_mode;
						this.enableMonitoring = data.settings.monitoring_on;
						this.duet_ip = data.settings.duet_ip;
						this.pauseGCode = data.settings.pause_gcode;
					})
					.catch(error => {
						clearTimeout(id);
						console.log('There was a problem with the fetch operation:', error);
						this.failedComms++;
					});
				}
		},
    fetchData() {
			if (this.backendIPValid) {
				// API call to backend
				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/monitor', {signal : controller.signal})
					.then((response) => response.json())
					.then((data) => {
						clearTimeout(id);
						if (data.status == 8000) {
							this.trackingInfo = data.items.status;
							this.defectLevel = parseInt(parseFloat(data.items.status.buffer.slice(-1)[0][0]) * 100)
						}
					})
					.catch(error => {
						clearTimeout(id);
						console.log('There was a problem with the fetch operation:', error);
						this.failedComms++;
					});
			}
    },
		fetchPreview() {
			if (this.backendIPValid) {
				// API call to backend
				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/preview', {signal : controller.signal})
					.then((response) => response.json())
					.then((data) => {
						clearTimeout(id);
						if (data.status == 8000) {
							this.imageDetectionPreview = data.items.status.preview;
						}
					})
					.catch(error => {
						clearTimeout(id);
						console.log('There was a problem with the fetch operation:', error);
						this.failedComms++;
					});
			}
    },
		fetchHeartbeat() {
			if (this.backendAddr != '') {
				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				let prms_ = new URLSearchParams({
						api_key: this.apiKey,
						duet_ip : this.duet_ip
					});
				if (this.testMode != null) {
					prms_.append("test_mode", this.testMode);
				}
				if (this.enableMonitoring != null) {
					prms_.append("enable_monitor", this.enableMonitoring);
				}
				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/heartbeat?' + prms_,
					{signal : controller.signal})
					.then((response) => response.json())
					.then((data) => {
						clearTimeout(id);
						if (data.status == 8001) {
							this.setAll();
							console.log('Synced variables with the backend');
						} else if (data.status == 8002) {
							this.notificationThreshold = Math.round(data.settings.thresholds.notification * 100.0);
							this.actionThreshold = Math.round(data.settings.thresholds.action * 100.0);
							this.pausePrint = data.settings.actions.pause;
							this.emailAddr = data.settings.email_addr;
							this.enableNotify = data.settings.actions.notify;
							this.apiKey = data.settings.api_key;
							this.testMode = data.settings.test_mode;
							this.pauseGCode = data.settings.pause_gcode;
						}
						if (!this.backendIPValid) {
							this.backendIPValid = true;
							this.failedComms = 0;

							if (this.intervalId == null) {
								this.intervalId = setInterval(() => {
									this.fetchData();
								}, 5000); // Every 5 seconds
							}

							if (this.streamIntervalId == null) {
								this.streamIntervalId = setInterval(() => {
									this.fetchPreview();
								}, 5000); // Every 5 seconds
							}
						}
					})
					.catch(error => {
						clearTimeout(id);
						console.log('There was a problem with the fetch operation:', error);
						this.failedComms++;
					});
			}
		},
		getActualIP() {
			const timeout = 5000;
			const controller = new AbortController();
			const id = setTimeout(() => controller.abort(), timeout);

			fetch('/rr_model?key=network',
				{signal : controller.signal})
				.then((response) => response.json())
				.then((data) => {
					clearTimeout(id);
					if (data.result.interfaces[0].actualIP.split('.').length == 4) {
						this.duet_ip = data.result.interfaces[0].actualIP;
						this.duetIPFetched = true;
						this.setSettings("duet_ip", this.duet_ip);
						console.log('Got duet board IP: ' + data.result.interfaces[0].actualIP);
					} else {
						this.duetIPFetched = false;
					}
				})
				.catch(error => {
					clearTimeout(id);
					console.log('There was a problem with the fetch operation:', error);
					this.failedComms++;
				});
		},
		initMonitor() {
			if (this.backendIPValid) {
				// API call to backend
				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/monitor_init', {signal : controller.signal})
				.then((response) => response.json())
				.then(() => {
					clearTimeout(id);
				})
				.catch(error => {
					clearTimeout(id);
					console.log('There was a problem with the fetch operation:', error);
					this.failedComms++;
				});
			}
    },
		stopMonitor() {
			if (this.backendIPValid) {
				// API call to backend
				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/monitor_off', {signal : controller.signal})
				.then((response) => response.json())
				.then(() => {
					clearTimeout(id);
				})
				.catch(error => {
					clearTimeout(id);
					console.log('There was a problem with the fetch operation:', error);
					this.failedComms++;
				});
			}
    },
		setSettings(keyName, value) {
			if (this.backendIPValid) {
				// API call to backend
				var ss = {};
				ss[keyName] = value;

				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/set_settings', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(ss),
					signal : controller.signal
				})
				.then(response => response.json())
				.then(() => {
					clearTimeout(id);
				})
				.catch(error => {
					clearTimeout(id);
					console.log('There was a problem with the fetch operation:', error);
					this.failedComms++;
				});
			}
    },
		setAll() {
			if (this.backendIPValid) {
				var ss = {
					camera_ip : this.snapshotUrl,
					email_addr : this.emailAddr,
					notification_threshold : this.notificationThreshold,
					action_threshold : this.actionThreshold,
					notify_action : this.enableNotify,
					pause_action : this.pausePrint
				};

				const timeout = 5000;
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);

				fetch('http://' + this.backendAddr + ':8989/machine/printwatch/set_settings', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(ss),
					signal : controller.signal
				})
				.then(response => response.json())
				.then(() => {
					clearTimeout(id);
				})
				.catch(error => {
					clearTimeout(id);
					console.log('There was a problem with the fetch operation:', error);
					this.failedComms++;
				});
			}
		},
    checkAndStartInterval() {
      if (this.enableMonitoring && this.backendAddr != '') {
        this.fetchData(); // Initial API call
				this.fetchPreview();

				if (this.intervalId != null) {
					clearInterval(this.intervalId);
				}
				this.intervalId = setInterval(() => {
					this.fetchData();
				}, 5000); // Every 5 seconds

				if (this.streamIntervalId != null) {
					clearInterval(this.streamIntervalId);
				}
				this.streamIntervalId = setInterval(() => {
					this.fetchPreview();
				}, 5000); // Every 5 seconds
      }
			if (this.heartbeatInterval == null) {
				this.heartbeatInterval = setInterval(() => {
					this.fetchHeartbeat();
				}, 10000);
			}
    },
		validateBackendIP() {
			// API call to backend
			this.backendIPValid = false;
			if (this.validateIntervalId != null && this.validateIntervalId != undefined) {
				clearTimeout(this.validateIntervalId);
			}
			const timeout = 5000;
			const controller = new AbortController();
			this.validateIntervalId = setTimeout(() => controller.abort(), timeout);

			fetch('http://' + this.backendAddr + ':8989/machine/printwatch/get_settings', {signal : controller.signal})
				.then((response) => response.json())
				.then((data) => {
					clearTimeout(this.validateIntervalId);
					this.backendIPValid = true;
					console.log('Successfully got the response to validate backendIP: ' + this.backendIPValid + ' ' + this.backendAddr);
					this.notificationThreshold = Math.round(data.settings.thresholds.notification * 100.0);
					this.actionThreshold = Math.round(data.settings.thresholds.action * 100.0);
					this.pausePrint = data.settings.actions.pause;
					this.emailAddr = data.settings.email_addr;
					this.enableNotify = data.settings.actions.notify;
					this.snapshotUrl = data.settings.camera_ip;
					this.apiKey = data.settings.api_key;
					this.testMode = data.settings.test_mode;
					this.enableMonitoring = data.settings.monitoring_on;
					this.duet_ip = data.settings.duet_ip;
					this.pauseGCode = data.settings.pause_gcode;
				})

				.catch(error => {
					clearTimeout(this.validateIntervalId);
					console.log('There was a problem with the fetch operation:', error);
					this.backendIPValid = false;
				});
		},
		validateWebcamUrl() {

			this.cameraIPValid = false;
			if (this.validateCamIntervalId != null && this.validateCamIntervalId != undefined) {
				clearTimeout(this.validateCamIntervalId);
			}

			const timeout = 5000;
			const controller = new AbortController();
			this.validateCamIntervalId = setTimeout(() => controller.abort(), timeout);

			console.log('Trying to validate snapshot URL: ' + this.snapshotUrl);
			fetch('http://' + this.backendAddr + ':8989/machine/printwatch/test_url', {signal : controller.signal})
				.then((response) => response.json())
				.then((data) => {
					clearTimeout(this.validateCamIntervalId);
					if (data.status == 8000) {
						this.cameraIPValid = true;
					} else {
						this.cameraIPValid = false;
					}

				})
				.catch(error => {
					clearTimeout(this.validateCamIntervalId);
					console.log('There was a problem with the fetch operation:', error);
					this.cameraIPValid = false;
				});
		},
    stopInterval() {
      clearInterval(this.intervalId);
			clearInterval(this.streamIntervalId);
    },
		initSettings() {
			this.backendAddr = this.settings.plugins['PrintWatch'].backendAddr;
		}
  },

	mounted() {
		// Reload the file list
		this.getActualIP();
		this.initSettings();
		this.fetchSettings();
    this.checkAndStartInterval();
		this.setGaugeColor();
	},
	beforeDestroy() {
		this.stopInterval();
	},
	watch: {
		...mapState('machine', ['settings']),
		...mapState('machine/cache', {
			pluginCache: (state) => state.plugins.PrintWatch,
		}),
		backendAddr: function() {
			if (this.backendAddr != null && this.backendAddr.length > 5) {
				setPluginData('PrintWatch', PluginDataType.machineSetting, 'backendAddr', this.backendAddr);
				this.validateBackendIP();
			}
		},
		enableMonitoring : function(){
			if (this.enableMonitoring != null) {
				if (this.enableMonitoring) {
					this.initMonitor();
					this.checkAndStartInterval();
				} else {
					this.stopMonitor();
					this.stopInterval();
				}
			}
		},
		apiKey : function(){
			if (this.apiKey != '') {
				this.setSettings("api_key", this.apiKey);
			}
		},
		snapshotUrl : function(){
			if (this.snapshotUrl != '' && this.snapshotUrl.length > 5) {
				this.setSettings("camera_ip", this.snapshotUrl);
				this.validateWebcamUrl();
			}
		},
		emailAddr : function(){
			if (this.emailAddr != '' && this.emailAddr.length > 5) {
				this.setSettings("email_addr", this.emailAddr);
			}
		},
		notificationThreshold : function(){
			if (this.notificationThreshold != null) {
				this.setSettings("notification_threshold", this.notificationThreshold);
			}
		},
		actionThreshold : function(){
			if (this.actionThreshold != null) {
				this.setSettings("action_threshold", this.actionThreshold);
			}
		},
		enableNotify : function(){
			if (this.enableNotify != null) {
				this.setSettings("notify_action", this.enableNotify);
			}
		},
		pausePrint : function(){
			if (this.pausePrint != null) {
				this.setSettings("pause_action", this.pausePrint);
			}
		},
		defectLevel : function(){
			this.setGaugeColor();
		},
		duet_ip : function(){
			if (this.duet_ip != '' && this.duet_ip.length > 5) {
				this.setSettings("duet_ip", this.duet_ip);
			}
		},
		testMode : function(){
			if (this.testMode != null) {
				this.setSettings("test_mode", this.testMode);
			}
		},
		pauseGCode : function(){
			if (this.pauseGCode != '' && this.pauseGCode.length > 1) {
				this.setSettings("pause_gcode", this.pauseGCode);
			}
		},
		failedComms : function(){
			if (this.failedComms>20) {
				this.backendIPValid = false;
			}
		}
	}
}
</script>
