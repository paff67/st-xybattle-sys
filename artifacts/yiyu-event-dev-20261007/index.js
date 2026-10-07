import { createEventRuntime } from './src/event-runtime.js';
const statuses = [];
globalThis.xyEventDev = createEventRuntime({ onStatus: status => statuses.push(status) });
globalThis.xyEventDevStatuses = statuses;
// Disabled on load. Test operator must open the disposable chat and enable it.
