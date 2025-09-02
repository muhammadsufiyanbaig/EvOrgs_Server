"use strict";
// src/Config/email/templates.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDescription = exports.formatDateForEmail = exports.generateItemsTable = exports.replaceTemplatePlaceholders = void 0;
/**
 * Replace placeholders in email templates with actual values
 */
const replaceTemplatePlaceholders = (template, data) => {
    let result = template;
    Object.entries(data).forEach(([key, value]) => {
        const placeholder = `%${key.toUpperCase()}%`;
        const replacement = value ? String(value) : '';
        result = result.replace(new RegExp(placeholder, 'g'), replacement);
    });
    return result;
};
exports.replaceTemplatePlaceholders = replaceTemplatePlaceholders;
/**
 * Generate items table HTML for invoice emails
 */
const generateItemsTable = (items) => {
    const tableHeader = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Description</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
  `;
    const tableRows = items.map(item => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${item.description}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');
    const tableFooter = `
      </tbody>
    </table>
  `;
    return tableHeader + tableRows + tableFooter;
};
exports.generateItemsTable = generateItemsTable;
/**
 * Format date for email templates
 */
const formatDateForEmail = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
exports.formatDateForEmail = formatDateForEmail;
/**
 * Generate description paragraph if description exists
 */
const formatDescription = (description) => {
    return description ? `<p>${description}</p>` : '';
};
exports.formatDescription = formatDescription;
