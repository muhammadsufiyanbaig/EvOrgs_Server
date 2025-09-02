// src/Config/email/templates.ts

/**
 * Replace placeholders in email templates with actual values
 */
export const replaceTemplatePlaceholders = (template: string, data: Record<string, any>): string => {
  let result = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `%${key.toUpperCase()}%`;
    const replacement = value ? String(value) : '';
    result = result.replace(new RegExp(placeholder, 'g'), replacement);
  });
  
  return result;
};

/**
 * Generate items table HTML for invoice emails
 */
export const generateItemsTable = (items: Array<{
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}>): string => {
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

/**
 * Format date for email templates
 */
export const formatDateForEmail = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generate description paragraph if description exists
 */
export const formatDescription = (description?: string): string => {
  return description ? `<p>${description}</p>` : '';
};
