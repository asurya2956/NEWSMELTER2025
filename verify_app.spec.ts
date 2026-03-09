import { test, expect } from '@playwright/test';

test('verify application', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for the dashboard to load
  await page.waitForSelector('text=Dashboard Overview');
  await page.screenshot({ path: 'dashboard_final.png', fullPage: true });

  // Click on Reports tab
  // Based on Dashboard.tsx: <button onClick={() => setActiveTab('reports')} ...>Reports</button>
  await page.click('button:has-text("Reports")');
  await page.waitForSelector('text=Summary Kunjungan per Wilayah');
  await page.screenshot({ path: 'reports_final.png', fullPage: true });

  // Click on Data Pasien tab
  await page.click('button:has-text("Data Pasien")');
  await page.waitForSelector('text=Daftar Pasien');
  await page.screenshot({ path: 'patients_final.png', fullPage: true });
});
