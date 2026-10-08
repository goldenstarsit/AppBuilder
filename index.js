import { getEnvironmentDetails } from "./tables/index.js";

export function getDashboard() {
  return {
    name: "AppBuilder Dashboard",
    environmentDetails: getEnvironmentDetails()
  };
}

export function renderDashboard() {
  const dashboard = getDashboard();

  const rows = dashboard.environmentDetails
    .map(
      (row) => `
        <tr>
          <td style="padding:12px;border:1px solid #ddd;">${row.id}</td>
          <td style="padding:12px;border:1px solid #ddd;">${row.environment}</td>
          <td style="padding:12px;border:1px solid #ddd;">${row.type}</td>
          <td style="padding:12px;border:1px solid #ddd;">${row.description}</td>
          <td style="padding:12px;border:1px solid #ddd;">${row.decoder}</td>
        </tr>
      `
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dashboard.name}</title>
</head>
<body style="margin:0;font-family:Arial,sans-serif;background:#f5f5f5;">
  <div style="padding:32px;">
    <h1 style="margin:0 0 8px;">${dashboard.name}</h1>
    <p style="margin:0 0 24px;color:#666;">Environment Details</p>

    <div style="background:#fff;border:1px solid #ddd;border-radius:8px;overflow:auto;">
      <table style="width:100%;border-collapse:collapse;text-align:left;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:12px;border:1px solid #ddd;">ID</th>
            <th style="padding:12px;border:1px solid #ddd;">Environment</th>
            <th style="padding:12px;border:1px solid #ddd;">Type</th>
            <th style="padding:12px;border:1px solid #ddd;">Description</th>
            <th style="padding:12px;border:1px solid #ddd;">Decoder</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}
