const kpis = {
  successRate: 0,
  concurrencyRate: 0,
  conflictRate: 0,
  averageResponseTime: 0,
};

let successfulReservations = 0;
let totalReservations = 0;
let concurrentRequests = 0;
let conflictsDetected = 0;
let responseTimes = [];

const updateKpis = () => {
  kpis.successRate =
    totalReservations > 0
      ? (successfulReservations / totalReservations) * 100
      : 0;
  kpis.concurrencyRate = concurrentRequests;
  kpis.conflictRate =
    totalReservations > 0 ? (conflictsDetected / totalReservations) * 100 : 0;
  kpis.averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length
      : 0;
};

const trackReservationAttempt = () => {
  totalReservations++;
};

const trackSuccessfulReservation = () => {
  successfulReservations++;
};

const trackConflict = () => {
  conflictsDetected++;
};

const trackConcurrency = () => {
  concurrentRequests++;
};

const trackResponseTime = (startTime) => {
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  responseTimes.push(responseTime);
};

const resetConcurrency = () => {
  concurrentRequests--;
};

export default {
  kpis,
  updateKpis,
  trackReservationAttempt,
  trackSuccessfulReservation,
  trackConflict,
  trackConcurrency,
  trackResponseTime,
  resetConcurrency,
};
