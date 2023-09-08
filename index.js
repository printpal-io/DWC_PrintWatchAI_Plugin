'use strict'

import { registerRoute } from '@/routes'
import { registerPluginData, PluginDataType } from '../../store'

import PrintWatch from './PrintWatch.vue'

// Register a route via Plugins -> Print Watch
registerRoute(PrintWatch, {
	Plugins: {
		PrintWatch: {
			icon: 'mdi-eye',
			caption: 'PrintWatch AI',
			translated: true,
			path: '/PrintWatch'
		}
	}
});

registerPluginData('PrintWatch', PluginDataType.machineCache, 'backendAddr', '');
