type Evidence = { backupRestoreTested: boolean; monitored: boolean;
  budgetAlerts: boolean; securityReview: boolean; capacityTested: boolean };
function productionReady(evidence: Evidence) {
  return Object.values(evidence).every(Boolean);
}
const readyForProduction = productionReady({
  backupRestoreTested: false, monitored: false, budgetAlerts: false,
  securityReview: false, capacityTested: false,
});
